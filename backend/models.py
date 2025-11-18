from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Capture(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    source: Optional[str] = Field(default=None, index=True)
    content_type: str = Field(default="text", index=True)
    raw_text: str
    tags: str = Field(default="", index=True, description="Comma separated tags")

    def set_tags(self, tag_list: list[str] | None) -> None:
        tag_list = tag_list or []
        cleaned = sorted({tag.strip() for tag in tag_list if tag and tag.strip()})
        self.tags = ",".join(cleaned)

    def tag_list(self) -> list[str]:
        return [tag for tag in self.tags.split(",") if tag]
