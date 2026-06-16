import os
import httpx
from fastapi import UploadFile, HTTPException
import logging

logger = logging.getLogger(__name__)

# URL of the ML Service running in WSL / Host
ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://127.0.0.1:8001/predict")

async def predict_palm(image_url: str):
    """
    Sends the Cloudinary image URL to the ML Service in WSL and returns the predictions.
    """
    try:
        async with httpx.AsyncClient() as client:
            payload = {"image_url": image_url}
            response = await client.post(ML_SERVICE_URL, json=payload, timeout=30.0)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"ML Service returned error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=500, detail="Error communicating with ML Service")
                
    except httpx.RequestError as e:
        logger.error(f"Error connecting to ML Service: {str(e)}")
        raise HTTPException(
            status_code=503, 
            detail="ML Service is unavailable. Please ensure it is running in WSL."
        )
