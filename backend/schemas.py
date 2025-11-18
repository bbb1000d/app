from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class CaptureBase(BaseModel):
    source: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class CaptureCreate(CaptureBase):
    text: str
    captured_at: Optional[datetime] = None


class CaptureRead(CaptureBase):
    id: int
    content_type: str
    raw_text: str
    created_at: datetime

    class Config:
        orm_mode = True


class CaptureSearchResults(BaseModel):
    total: int
    items: List[CaptureRead]


class CaptureUpdateTags(BaseModel):
    tags: List[str]
