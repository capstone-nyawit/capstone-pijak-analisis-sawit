import json
import random
from datetime import datetime, timezone
from fastapi import APIRouter, UploadFile, File, Depends, Form
from sqlalchemy.orm import Session
from app.services.ml_client import predict_palm
from app.services.cloudinary_service import upload_image
from app.db.session import get_db
from app.models.inference_log import InferenceLog
from app.api.routes.auth import get_current_user
from app.models.user import User
from app.db.redis import redis_client

router = APIRouter()

@router.post("")
async def predict_image(
    file: UploadFile = File(...),
    block_name: str = Form("Block Alpha Sector"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint to receive an image, upload to Cloudinary, 
    forward URL to ML Service, and save the results dynamically.
    Stores a pending session in Redis during execution.
    """
    company_id = current_user.company_id or 0
    log_code = f"NYA-{random.randint(10000, 99999)}"
    redis_key = f"active_analysis:{company_id}:{log_code}"
    
    # 1. Store pending session in Redis
    pending_data = {
        "id": -random.randint(10000, 99999),
        "company_id": company_id,
        "log_code": log_code,
        "user_name": current_user.full_name,
        "user_role": current_user.role,
        "block_name": block_name,
        "trees_count": 0,
        "confidence_score": 0.0,
        "status": "Pending",
        "image_url": None,
        "results_json": None,
        "healthy_count": 0,
        "small_count": 0,
        "yellow_count": 0,
        "dead_count": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    try:
        redis_client.setex(redis_key, 300, json.dumps(pending_data))
    except Exception as e:
        # If Redis is unavailable, log but don't crash
        print(f"Failed to write pending session to Redis: {e}")

    try:
        # 2. Upload to Cloudinary
        secure_url = await upload_image(file)
        
        # 3. Forward to ML Service
        results = await predict_palm(secure_url)
        
        predictions = results.get("predictions", [])
        
        # 4. Calculate counts based on class mapping:
        # 0: Dead, 1: Healthy, 2: Grass, 3: Small, 4: Yellow
        healthy_count = sum(1 for p in predictions if p.get("class_id") == 1)
        dead_count = sum(1 for p in predictions if p.get("class_id") == 0)
        small_count = sum(1 for p in predictions if p.get("class_id") == 3)
        yellow_count = sum(1 for p in predictions if p.get("class_id") == 4)
        
        trees_count = healthy_count + dead_count + small_count + yellow_count
        
        # Calculate average confidence
        avg_confidence = 0.0
        if trees_count > 0:
            confidences = [p.get("confidence", 0) for p in predictions if p.get("class_id") in [0, 1, 3, 4]]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0

        # 5. Save to SQL Database
        new_log = InferenceLog(
            company_id=current_user.company_id,
            user_id=current_user.id,
            log_code=log_code,
            user_name=current_user.full_name,
            user_role=current_user.role,
            block_name=block_name,
            trees_count=trees_count,
            confidence_score=round(avg_confidence * 100, 2),
            status="Completed",
            image_url=secure_url,
            results_json=predictions,
            healthy_count=healthy_count,
            small_count=small_count,
            yellow_count=yellow_count,
            dead_count=dead_count
        )
        db.add(new_log)
        db.flush() # to get new_log.id

        # 5.5 Generate VRA Recommendation & Report
        from app.models.vra_recommendation import VraRecommendation
        from app.models.report import Report
        from app.services.vra_engine import VraRuleEngine

        rec_data = VraRuleEngine.generate_recommendation(
            healthy=healthy_count,
            yellowing=yellow_count,
            small_canopy=small_count,
            dead=dead_count
        )
        
        vra_rec = VraRecommendation(
            inference_log_id=new_log.id,
            healthy_count=healthy_count,
            yellowing_count=yellow_count,
            small_canopy_count=small_count,
            dead_count=dead_count,
            overall_priority=rec_data["overall_priority"],
            primary_concern=rec_data["primary_concern"],
            secondary_concern=rec_data["secondary_concern"],
            recommended_programs=rec_data["recommended_programs"]
        )
        db.add(vra_rec)

        while True:
            rpt_code = f"RPT-{random.randint(1000, 9999)}"
            existing = db.query(Report).filter(Report.report_code == rpt_code).first()
            if not existing:
                break
        
        report = Report(
            company_id=current_user.company_id,
            user_id=current_user.id,
            report_code=rpt_code,
            name=block_name,
            type="PDF",
            size="1.5 MB",
            inference_log_id=new_log.id
        )
        db.add(report)

        db.commit()
        db.refresh(new_log)
        
        # 6. Delete Redis pending key upon success
        try:
            redis_client.delete(redis_key)
        except Exception as e:
            print(f"Failed to delete pending session from Redis: {e}")

        # 7. Clear Dashboard Cache in Redis
        try:
            if current_user.role == "admin" and current_user.company_id:
                cache_key = f"dashboard_stats:company:{current_user.company_id}"
            else:
                cache_key = f"dashboard_stats:user:{current_user.id}"
            redis_client.delete(cache_key)
        except Exception as e:
            print(f"Failed to delete dashboard cache from Redis: {e}")

        return {
            "success": True,
            "log_code": log_code,
            "image_url": secure_url,
            "predictions": predictions,
            "counts": {
                "healthy": healthy_count,
                "small": small_count,
                "yellow": yellow_count,
                "dead": dead_count,
                "total": trees_count
            }
        }

    except Exception as e:
        # 8. Clean up Redis pending key upon failure
        try:
            redis_client.delete(redis_key)
        except Exception as err:
            print(f"Failed to delete pending session on error cleanup: {err}")
            
        # Create a Failed InferenceLog
        failed_log = InferenceLog(
            company_id=current_user.company_id,
            user_id=current_user.id,
            log_code=log_code,
            user_name=current_user.full_name,
            user_role=current_user.role,
            block_name=block_name,
            trees_count=0,
            confidence_score=0.0,
            status="Failed",
            image_url=None,
            results_json={"error": str(e)},
            healthy_count=0,
            small_count=0,
            yellow_count=0,
            dead_count=0
        )
        db.add(failed_log)
        db.commit()
        raise e
