from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlmodel import select

from .database import get_session, init_db
from .models import Capture
from .ocr import image_bytes_to_text
from .schemas import CaptureCreate, CaptureRead, CaptureSearchResults, CaptureUpdateTags

app = FastAPI(title="Study Capture MVP", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()


@app.get("/", include_in_schema=False)
async def root() -> FileResponse:
    return FileResponse("frontend/index.html")


@app.post("/captures/text", response_model=CaptureRead, status_code=201)
def create_text_capture(payload: CaptureCreate, session=Depends(get_session)):
    capture = Capture(
        raw_text=payload.text.strip(),
        content_type="text",
        created_at=payload.captured_at or datetime.utcnow(),
        source=payload.source,
    )
    capture.set_tags(payload.tags)
    session.add(capture)
    session.commit()
    session.refresh(capture)
    return serialize_capture(capture)


@app.post("/captures/image", response_model=CaptureRead, status_code=201)
async def create_image_capture(
    file: UploadFile = File(...),
    source: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    captured_at: Optional[str] = Form(None),
    session=Depends(get_session),
):
    contents = await file.read()
    extracted_text = image_bytes_to_text(contents)
    if not extracted_text:
        raise HTTPException(status_code=400, detail="No text detected in the provided image")

    parsed_tags = [tag.strip() for tag in (tags or "").split(",") if tag.strip()]
    capture_time = datetime.fromisoformat(captured_at) if captured_at else datetime.utcnow()

    capture = Capture(
        raw_text=extracted_text,
        content_type="image",
        created_at=capture_time,
        source=source,
    )
    capture.set_tags(parsed_tags)
    session.add(capture)
    session.commit()
    session.refresh(capture)
    return serialize_capture(capture)


@app.get("/captures", response_model=List[CaptureRead])
def list_captures(
    limit: int = 50,
    offset: int = 0,
    tag: Optional[str] = None,
    session=Depends(get_session),
):
    statement = select(Capture).order_by(Capture.created_at.desc()).offset(offset).limit(limit)
    if tag:
        statement = statement.where(Capture.tags.like(f"%{tag}%"))
    captures = session.exec(statement).all()
    return [serialize_capture(c) for c in captures]


@app.get("/captures/{capture_id}", response_model=CaptureRead)
def get_capture(capture_id: int, session=Depends(get_session)):
    capture = session.get(Capture, capture_id)
    if not capture:
        raise HTTPException(status_code=404, detail="Capture not found")
    return serialize_capture(capture)


@app.post("/captures/{capture_id}/tags", response_model=CaptureRead)
def update_tags(
    capture_id: int,
    payload: CaptureUpdateTags,
    session=Depends(get_session),
):
    capture = session.get(Capture, capture_id)
    if not capture:
        raise HTTPException(status_code=404, detail="Capture not found")
    capture.set_tags(payload.tags)
    session.add(capture)
    session.commit()
    session.refresh(capture)
    return serialize_capture(capture)


@app.get("/search", response_model=CaptureSearchResults)
def search(
    query: str,
    tag: Optional[str] = None,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    session=Depends(get_session),
):
    statement = select(Capture)
    if query:
        statement = statement.where(Capture.raw_text.contains(query))
    if tag:
        statement = statement.where(Capture.tags.like(f"%{tag}%"))
    if start:
        statement = statement.where(Capture.created_at >= start)
    if end:
        statement = statement.where(Capture.created_at <= end)
    statement = statement.order_by(Capture.created_at.desc())
    results = session.exec(statement).all()
    return CaptureSearchResults(
        total=len(results),
        items=[serialize_capture(c) for c in results],
    )


def serialize_capture(capture: Capture) -> CaptureRead:
    return CaptureRead(
        id=capture.id,
        content_type=capture.content_type,
        raw_text=capture.raw_text,
        created_at=capture.created_at,
        source=capture.source,
        tags=capture.tag_list(),
    )
