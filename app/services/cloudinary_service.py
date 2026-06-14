import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from app.core.config import get_settings

settings = get_settings()

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True
)

async def upload_image(file: UploadFile) -> str:
    """
    Uploads an image to Cloudinary and returns the secure URL.
    """
    # Upload to Cloudinary. We pass the file's raw content bytes.
    # Cloudinary can accept file objects, but since it's an async UploadFile, 
    # we should read it first.
    content = await file.read()
    
    # We must reset the cursor so subsequent services can read the file if needed.
    await file.seek(0)
    
    result = cloudinary.uploader.upload(content, folder="capstone_palm")
    return result.get("secure_url")
