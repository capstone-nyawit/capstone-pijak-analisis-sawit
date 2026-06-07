from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.inference_log import InferenceLog
from app.schemas.inference_log import InferenceLogResponse
from app.api.routes.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=list[InferenceLogResponse])
def get_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.company_id:
        return []
    logs = db.query(InferenceLog).filter(
        InferenceLog.company_id == current_user.company_id
    ).order_by(InferenceLog.created_at.desc()).all()
    return logs
