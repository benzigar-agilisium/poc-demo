from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas
from utils.dependencies import get_db
from botocore.exceptions import NoCredentialsError
from boto3 import client
from botocore.config import Config
import mimetypes
import os


router = APIRouter()

@router.post("/create", response_model=dict)
def create_file(request: schemas.FileCreateRequest, db: Session = Depends(get_db)):
    content = db.query(models.Content).filter(models.Content.id == request.content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    new_file = models.File(
        content_id=request.content_id,
        name=request.name,
        type=request.type,
        link=request.link,
        status=request.status
    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    return {
        "id": new_file.id,
        "content_id": new_file.content_id,
        "name": new_file.name,
        "type": new_file.type,
        "link": new_file.link,
        "status": new_file.status
    }

@router.post("/get-signed-url")
async def get_signed_url(request: schemas.SignedUrlRequest):
    file_name = request.fileName
    mime_type, _ = mimetypes.guess_type(file_name)
    
    if not mime_type:
        mime_type = "application/octet-stream"

    s3_client = client(
        's3',
        region_name=os.getenv("AWS_REGION"),
        endpoint_url=os.getenv("AWS_ENDPOINT"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        config=Config(signature_version='s3v4')
    )

    try:
        command = {
            "Bucket": os.getenv("AWS_S3_BUCKET_NAME"),
            "Key": f"public/{file_name}",
            "ACL": "public-read",
            "ContentType": mime_type
        }

        signed_url = s3_client.generate_presigned_url('put_object', Params=command, ExpiresIn=900)

        return {
            "url": signed_url,
            "publicURL": os.getenv("AWS_S3_PUBLIC_BASEURL") + file_name
        }

    except NoCredentialsError:
        raise HTTPException(status_code=403, detail="AWS credentials not found")