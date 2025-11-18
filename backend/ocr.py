from __future__ import annotations

from io import BytesIO

from fastapi import HTTPException, status

try:
    from PIL import Image
except ImportError as exc:  # pragma: no cover - import guard
    raise RuntimeError("Pillow must be installed to perform OCR") from exc

try:  # pragma: no cover - optional dependency
    import pytesseract
except ImportError as exc:  # pragma: no cover
    raise RuntimeError(
        "pytesseract is required for OCR. Install it with 'pip install pytesseract' "
        "and ensure the Tesseract binary is available."
    ) from exc


def image_bytes_to_text(data: bytes) -> str:
    try:
        image = Image.open(BytesIO(data))
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    try:
        text = pytesseract.image_to_string(image)
    except pytesseract.TesseractNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Tesseract binary not found. Install it from https://github.com/tesseract-ocr/tesseract"
            ),
        ) from exc
    return text.strip()
