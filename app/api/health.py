from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db

router = APIRouter()


@router.get("/health")
def health_check() -> dict:
    settings = get_settings()
    return {"status": "ok", "service": settings.app_name}


@router.get("/db-test")
def db_test(db: Session = Depends(get_db)) -> dict:
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Database connection failed") from exc
    return {"database": "connected"}
