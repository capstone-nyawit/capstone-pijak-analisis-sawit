from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.report import Report
from app.schemas.report import ReportResponse
from app.api.routes.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=list[ReportResponse])
def get_reports(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.company_id:
        return []
    reports = db.query(Report).filter(
        Report.company_id == current_user.company_id
    ).order_by(Report.created_at.desc()).all()
    return reports
