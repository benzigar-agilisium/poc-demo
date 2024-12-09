from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
import models, schemas
from utils.dependencies import get_db, sql_alchemy_to_dict

router = APIRouter()

@router.post("/create", response_model=dict)
def create_content(content: schemas.ContentBase, db: Session = Depends(get_db)):
    
    directory = db.query(models.Directory).filter(models.Directory.id == content.directory_id).first()
    if not directory:
        raise HTTPException(status_code=404, detail="Directory not found")

    db_content = models.Content(
        directory_id=content.directory_id,
        name=content.name,
        header=content.header,
        sub_header=content.sub_header,
        document_number=content.document_number,
        active_from=content.active_from,
        active_to=content.active_to,
        show_landing_page=content.show_landing_page,
        created_at=content.created_at,
        status=content.status
    )
    db.add(db_content)
    db.commit()
    db.refresh(db_content) 
    
    return {
        "content_id": db_content.id
    }

@router.post("/get-all-contents", response_model=list)
def get_all_contents_with_files_and_directories(
    request: schemas.ContentListRequest, db: Session = Depends(get_db)
):
    query = db.query(models.Content)
    
    if request.directory_id:
        query = query.filter(models.Content.directory_id == request.directory_id)
    
    if request.search:
        query = query.filter(models.Content.name.ilike(f"%{request.search}%"))
        
    db_contents = query.filter(models.Content.status == "active").order_by(desc(models.Content.id)).all()

    contents_with_files_and_directories = []
    for content in db_contents:
        files = db.query(models.File).filter(models.File.content_id == content.id).all()
        directory = db.query(models.Directory).filter(models.Directory.id == content.directory_id).first()
        content_dict = sql_alchemy_to_dict(content)
        files_dict = [sql_alchemy_to_dict(file) for file in files]
        directory_dict = sql_alchemy_to_dict(directory) if directory else None
        content_dict["files"] = files_dict
        content_dict["directory"] = directory_dict

        contents_with_files_and_directories.append(content_dict)

    return contents_with_files_and_directories


@router.get("/get-content/{content_id}", response_model=dict)
def get_single_content(content_id: int, db: Session = Depends(get_db)):
    content = db.query(models.Content).filter(models.Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    files = db.query(models.File).filter(models.File.content_id == content.id).all()

    directory = db.query(models.Directory).filter(models.Directory.id == content.directory_id).first()


    content_dict = sql_alchemy_to_dict(content)
    files_dict = [sql_alchemy_to_dict(file) for file in files]
    directory_dict = sql_alchemy_to_dict(directory) if directory else None


    content_dict["files"] = files_dict
    content_dict["directory"] = directory_dict

    return content_dict

@router.delete("/delete-content/{content_id}", response_model=dict)
def delete_content(content_id: int, db: Session = Depends(get_db)):

    content = db.query(models.Content).filter(models.Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")


    content.status = "deleted"
    db.commit()

    return {
        "message": "Content deleted successfully",
        "content_id": content_id,
        "status": "delete"
    }