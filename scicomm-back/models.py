from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Directory(Base):
    __tablename__ = "directories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)

class Content(Base):
    __tablename__ = "contents"
    id = Column(Integer, primary_key=True, index=True)
    directory_id = Column(Integer, ForeignKey("directories.id"), nullable=False)
    name = Column(String, nullable=False)
    header = Column(String, nullable=True)
    sub_header = Column(String, nullable=True)
    document_number = Column(String, nullable=False)
    active_from = Column(Date, nullable=True)
    active_to = Column(Date, nullable=True)
    show_landing_page = Column(Boolean, default=False)
    created_at = Column(Date, nullable=False)
    status = Column(String, nullable=False)

    directory = relationship("Directory", back_populates="contents")

Directory.contents = relationship("Content", back_populates="directory")

class File(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    link = Column(String, nullable=False)
    status = Column(String, nullable=False)

    content = relationship("Content", back_populates="files")

Content.files = relationship("File", back_populates="content")
