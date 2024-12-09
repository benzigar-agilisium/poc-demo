from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from utils.dependencies import get_db
import models, schemas

router = APIRouter()

@router.get("/get-all-directories", response_model=list[schemas.Directory])
def get_all_directories(db: Session = Depends(get_db)):
    db_directories = db.query(models.Directory).all()
    if not db_directories:
        raise HTTPException(status_code=404, detail="No directories found")
    return db_directories