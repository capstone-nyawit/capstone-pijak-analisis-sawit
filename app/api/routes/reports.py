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
    from app.models.inference_log import InferenceLog
    
    query = db.query(Report)
    if current_user.role == "admin" and current_user.company_id:
        query = query.filter(Report.company_id == current_user.company_id)
    else:
        query = query.filter(Report.user_id == current_user.id)
        
    reports = query.order_by(Report.created_at.desc()).all()
    
    response_list = []
    for r in reports:
        log = None
        if r.inference_log_id:
            log = db.query(InferenceLog).filter(InferenceLog.id == r.inference_log_id).first()
        else:
            log = db.query(InferenceLog).filter(
                InferenceLog.company_id == r.company_id,
                InferenceLog.block_name == r.name
            ).order_by(InferenceLog.created_at.desc()).first()
            
        item = ReportResponse(
            id=r.id,
            company_id=r.company_id,
            report_code=r.report_code,
            name=r.name,
            type=r.type,
            size=r.size,
            created_at=r.created_at,
            inference_log_id=r.inference_log_id,
            log_code=log.log_code if log else None,
            image_url=log.image_url if log else None,
            results_json=log.results_json if log else None,
            healthy_count=log.healthy_count if log else 0,
            small_count=log.small_count if log else 0,
            yellow_count=log.yellow_count if log else 0,
            dead_count=log.dead_count if log else 0
        )
        response_list.append(item)
        
    return response_list

@router.delete("/{report_code}")
def delete_report(report_code: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Report).filter(Report.report_code == report_code)
    
    if current_user.role == "admin" and current_user.company_id:
        query = query.filter(Report.company_id == current_user.company_id)
    else:
        query = query.filter(Report.user_id == current_user.id)
        
    report = query.first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    db.delete(report)
    db.commit()
    
    return {"success": True, "message": "Report deleted successfully"}
