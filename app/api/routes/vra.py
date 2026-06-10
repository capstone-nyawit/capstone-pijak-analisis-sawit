from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import random
from app.db.session import get_db
from app.api.routes.auth import get_current_user
from app.models.user import User
from app.models.inference_log import InferenceLog
from app.models.vra_recommendation import VraRecommendation
from app.models.report import Report
from app.schemas.vra import VraAnalyzeRequest, VraRecommendationResponse
from app.services.vra_engine import VraRuleEngine

router = APIRouter()

def generate_unique_log_code(db: Session) -> str:
    while True:
        code = f"ANL-{random.randint(1000, 9999)}"
        existing = db.query(InferenceLog).filter(InferenceLog.log_code == code).first()
        if not existing:
            return code

def generate_unique_report_code(db: Session) -> str:
    while True:
        code = f"RPT-{random.randint(1000, 9999)}"
        existing = db.query(Report).filter(Report.report_code == code).first()
        if not existing:
            return code

@router.post("/analyze", response_model=VraRecommendationResponse)
def analyze_vra(
    request: VraAnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must belong to a company to run analysis."
        )

    # 1. Generate recommendation via rule engine
    rec_data = VraRuleEngine.generate_recommendation(
        healthy=request.healthy_count,
        yellowing=request.yellowing_count,
        small_canopy=request.small_canopy_count,
        dead=request.dead_count
    )

    # 2. Create InferenceLog
    log_code = generate_unique_log_code(db)
    total_trees = request.healthy_count + request.yellowing_count + request.small_canopy_count + request.dead_count
    
    inference_log = InferenceLog(
        company_id=current_user.company_id,
        log_code=log_code,
        user_name=current_user.full_name or current_user.email,
        user_role=current_user.role,
        block_name=request.block_name,
        trees_count=total_trees,
        confidence_score=request.confidence_score,
        status="Completed"
    )
    db.add(inference_log)
    db.flush()  # to get inference_log.id

    # 3. Create VraRecommendation
    vra_rec = VraRecommendation(
        inference_log_id=inference_log.id,
        healthy_count=request.healthy_count,
        yellowing_count=request.yellowing_count,
        small_canopy_count=request.small_canopy_count,
        dead_count=request.dead_count,
        overall_priority=rec_data["overall_priority"],
        primary_concern=rec_data["primary_concern"],
        secondary_concern=rec_data["secondary_concern"],
        recommended_programs=rec_data["recommended_programs"]
    )
    db.add(vra_rec)

    # 4. Create Report record
    report_code = generate_unique_report_code(db)
    report = Report(
        company_id=current_user.company_id,
        report_code=report_code,
        name=request.block_name,
        type="PDF",
        size="1.5 MB"
    )
    db.add(report)

    db.commit()
    db.refresh(vra_rec)

    return vra_rec

@router.get("/recommendation/log/{log_code}", response_model=VraRecommendationResponse)
def get_recommendation_by_log_code(
    log_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must belong to a company."
        )

    log = db.query(InferenceLog).filter(
        InferenceLog.log_code == log_code,
        InferenceLog.company_id == current_user.company_id
    ).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inference log not found."
        )

    vra_rec = db.query(VraRecommendation).filter(
        VraRecommendation.inference_log_id == log.id
    ).first()
    if not vra_rec:
        # Generate one dynamically if missing (e.g. for pre-existing seed data)
        # Assuming seed stats based on 84% healthy, 12% small, 3% yellow, remainder dead
        healthy = int(log.trees_count * 0.84)
        small = int(log.trees_count * 0.12)
        yellow = int(log.trees_count * 0.03)
        dead = log.trees_count - healthy - small - yellow

        rec_data = VraRuleEngine.generate_recommendation(healthy, yellow, small, dead)
        vra_rec = VraRecommendation(
            inference_log_id=log.id,
            healthy_count=healthy,
            yellowing_count=yellow,
            small_canopy_count=small,
            dead_count=dead,
            overall_priority=rec_data["overall_priority"],
            primary_concern=rec_data["primary_concern"],
            secondary_concern=rec_data["secondary_concern"],
            recommended_programs=rec_data["recommended_programs"]
        )
        db.add(vra_rec)
        db.commit()
        db.refresh(vra_rec)

    return vra_rec

@router.get("/recommendation/{inference_log_id}", response_model=VraRecommendationResponse)
def get_recommendation_by_id(
    inference_log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must belong to a company."
        )

    vra_rec = db.query(VraRecommendation).filter(
        VraRecommendation.id == inference_log_id
    ).first()
    if not vra_rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommendation not found."
        )
    
    # Verify authorization
    log = db.query(InferenceLog).filter(
        InferenceLog.id == vra_rec.inference_log_id,
        InferenceLog.company_id == current_user.company_id
    ).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied."
        )

    return vra_rec
