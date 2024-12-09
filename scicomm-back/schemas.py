from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class File(BaseModel):
    id: int
    name: str
    type: str
    link: str
    status: str

    class Config:
        orm_mode = True

class Directory(BaseModel):
    id: int
    name: str
    status: str

    class Config:
        orm_mode = True

class ContentBase(BaseModel):
    directory_id: int
    name: str
    header: Optional[str] = None
    sub_header: Optional[str] = None
    document_number: str
    active_from: Optional[date] = None
    active_to: Optional[date] = None
    show_landing_page: bool = False
    created_at: date
    status: str

    class Config:
        orm_mode = True

class ContentListRequest(BaseModel):
    directory_id: int = None
    search: str = None

class FileCreateRequest(BaseModel):
    content_id: int
    name: str
    type: str
    link: str
    status: str

class SignedUrlRequest(BaseModel):
    fileName: str = "filename.jpg"

class ContentWithFilesAndDirectories(ContentBase):
    files: List[File] = []
    directory: Directory
    content: ContentBase

    class Config:
        orm_mode = True