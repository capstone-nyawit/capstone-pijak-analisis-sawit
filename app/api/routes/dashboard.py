from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.security import get_current_user_token
from app.db.session import get_db
from app.models.inference_log import InferenceLog
from app.models.user import User
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    company_id = current_user.company_id
    
    if not company_id:
        return {
            "classDistribution": [],
            "riskHeatmap": [],
            "recentHistory": [],
            "kpiStats": []
        }

    total_trees = int(db.query(func.sum(InferenceLog.trees_count)).filter(
        InferenceLog.company_id == company_id
    ).scalar() or 0)
    
    healthy = int(total_trees * 0.84)
    small = int(total_trees * 0.12)
    yellow = int(total_trees * 0.03)
    dead = total_trees - healthy - small - yellow

    logs = db.query(InferenceLog).filter(
        InferenceLog.company_id == company_id
    ).order_by(InferenceLog.created_at.desc()).limit(4).all()

    recentHistory = [
        {
            "id": log.log_code,
            "date": log.created_at.strftime('%b %d, %Y'),
            "block": log.block_name,
            "trees": log.trees_count,
            "status": log.status,
            "confidence": f"{log.confidence_score}%",
            "thumb": 'https://images.unsplash.com/photo-1627883907153-61b453e00cc2?auto=format&fit=crop&w=100&q=80'
        }
        for log in logs
    ]

    # Fetch VRA Recommendations for priority zones
    from app.models.vra_recommendation import VraRecommendation
    priority_zones = []
    
    if logs:
        log_ids = [log.id for log in logs]
        recs = db.query(VraRecommendation, InferenceLog).join(
            InferenceLog, VraRecommendation.inference_log_id == InferenceLog.id
        ).filter(VraRecommendation.inference_log_id.in_(log_ids)).all()
        
        # Sort by priority level (Critical > High > Medium > Low) and then by anomaly percentage
        priority_map = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}
        
        def sort_key(item):
            rec, log = item
            total = log.trees_count or 1
            anomaly_pct = ((rec.dead_count + rec.yellowing_count + rec.small_canopy_count) / total) * 100
            return (priority_map.get(rec.overall_priority, 1), anomaly_pct)
            
        sorted_recs = sorted(recs, key=sort_key, reverse=True)
        top_recs = sorted_recs[:2] # Top 2 priority zones
        
        for rec, log in top_recs:
            priority_zones.append({
                "block": log.block_name,
                "priority": rec.overall_priority,
                "primary_concern": rec.primary_concern,
                "log_id": log.log_code
            })

    return {
        "classDistribution": [
            { "name": 'Healthy', "value": healthy, "color": '#10b981' },
            { "name": 'Small', "value": small, "color": '#3b82f6' },
            { "name": 'Yellow', "value": yellow, "color": '#f59e0b' },
            { "name": 'Dead', "value": dead, "color": '#ef4444' }
        ],
        "priorityZones": priority_zones,
        "recentHistory": recentHistory,
        "kpiStats": [
            { "label": 'Total Trees', "val": f"{total_trees:,}", "trend": '+1.2%', "trendUp": True, "color": 'text-[#04211a]', "border": 'border-slate-200' },
            { "label": 'Healthy', "val": f"{healthy:,}", "trend": '+2.4%', "trendUp": True, "color": 'text-emerald-700', "border": 'border-emerald-200' },
            { "label": 'Small Canopy', "val": f"{small:,}", "trend": '-0.5%', "trendUp": False, "color": 'text-blue-700', "border": 'border-blue-200' },
            { "label": 'Yellowing', "val": f"{yellow:,}", "trend": '+12.4%', "trendUp": False, "color": 'text-amber-700', "border": 'border-amber-200' },
            { "label": 'Dead / Missing', "val": f"{dead:,}", "trend": '-2.1%', "trendUp": True, "color": 'text-red-700', "border": 'border-red-200' },
        ]
    }
