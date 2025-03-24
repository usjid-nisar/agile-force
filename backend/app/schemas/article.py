from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class ArticleBase(BaseModel):
    title: str
    content: str = ""
    description: str = ""
    summary: str = ""

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None

class ArticleInDB(ArticleBase):
    id: str = Field(..., alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True 