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
    # 1. Fetch completed logs from SQL Database
    query = db.query(InferenceLog)
    
    if current_user.role == "admin" and current_user.company_id:
        query = query.filter(InferenceLog.company_id == current_user.company_id)
    else:
        query = query.filter(InferenceLog.user_id == current_user.id)
        
    logs = query.order_by(InferenceLog.created_at.desc()).all()
    
    logs_list = list(logs)
    
    # 2. Fetch pending logs from Redis
    from app.db.redis import redis_client
    import json
    try:
        company_id = current_user.company_id or 0
        pattern = f"active_analysis:{company_id}:*"
        keys = redis_client.keys(pattern)
        
        pending_logs = []
        for key in keys:
            val = redis_client.get(key)
            if val:
                try:
                    data = json.loads(val)
                    pending_logs.append(data)
                except Exception as e:
                    print(f"Error parsing Redis pending log JSON: {e}")
                    
        # Sort pending logs (newest first)
        pending_logs.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        
        return pending_logs + logs_list
    except Exception as e:
        print(f"Failed to fetch pending logs from Redis: {e}")
        return logs_list

@router.delete("/{log_code}")
def delete_log(log_code: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(InferenceLog).filter(InferenceLog.log_code == log_code)
    
    if current_user.role == "admin" and current_user.company_id:
        query = query.filter(InferenceLog.company_id == current_user.company_id)
    else:
        query = query.filter(InferenceLog.user_id == current_user.id)
        
    log = query.first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Log not found or unauthorized")
        
    # Delete associated VRA Recommendations
    from app.models.vra_recommendation import VraRecommendation
    db.query(VraRecommendation).filter(VraRecommendation.inference_log_id == log.id).delete()
    
    # Also delete associated Report (matched by inference_log_id)
    from app.models.report import Report
    db.query(Report).filter(Report.inference_log_id == log.id).delete()
    
    db.delete(log)
    db.commit()
    
    # Clear cache
    from app.db.redis import redis_client
    cache_key = f"dashboard_stats:{current_user.company_id or current_user.full_name}"
    redis_client.delete(cache_key)
    
    return {"success": True, "message": "Log and associated reports deleted successfully"}
