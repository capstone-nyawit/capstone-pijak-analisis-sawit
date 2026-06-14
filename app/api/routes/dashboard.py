from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.security import get_current_user_token
from app.db.session import get_db
from app.models.inference_log import InferenceLog
from app.models.user import User
from app.api.routes.auth import get_current_user
from app.db.redis import redis_client
import json

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    company_id = current_user.company_id
    user_id = current_user.id
    
    # Check cache
    cache_key = f"dashboard_stats:user:{user_id}"
    if current_user.role == "admin" and company_id:
        cache_key = f"dashboard_stats:company:{company_id}"
        
    cached_stats = redis_client.get(cache_key)
    if cached_stats:
        return json.loads(cached_stats)

    # Base query
    base_query = db.query(InferenceLog)
    if current_user.role == "admin" and company_id:
        base_query = base_query.filter(InferenceLog.company_id == company_id)
    else:
        base_query = base_query.filter(InferenceLog.user_id == user_id)

    # Query aggregates
    aggregates = db.query(
        func.sum(InferenceLog.trees_count).label("total"),
        func.sum(InferenceLog.healthy_count).label("healthy"),
        func.sum(InferenceLog.small_count).label("small"),
        func.sum(InferenceLog.yellow_count).label("yellow"),
        func.sum(InferenceLog.dead_count).label("dead")
    )
    
    if current_user.role == "admin" and company_id:
        aggregates = aggregates.filter(InferenceLog.company_id == company_id).first()
    else:
        aggregates = aggregates.filter(InferenceLog.user_id == user_id).first()

    total_trees = int(aggregates.total or 0)
    healthy = int(aggregates.healthy or 0)
    small = int(aggregates.small or 0)
    yellow = int(aggregates.yellow or 0)
    dead = int(aggregates.dead or 0)

    logs = base_query.order_by(InferenceLog.created_at.desc()).limit(4).all()

    recentHistory = [
        {
            "id": log.log_code,
            "date": log.created_at.strftime('%b %d, %Y'),
            "block": log.block_name,
            "trees": log.trees_count,
            "status": log.status,
            "confidence": f"{log.confidence_score}%",
            "thumb": log.image_url if log.image_url else 'https://images.unsplash.com/photo-1627883907153-61b453e00cc2?auto=format&fit=crop&w=100&q=80',
            "predictions": log.results_json
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

    stats_response = {
        "classDistribution": [
            { "name": 'Healthy', "value": healthy, "color": '#10b981' },
            { "name": 'Small', "value": small, "color": '#3b82f6' },
            { "name": 'Yellow', "value": yellow, "color": '#f59e0b' },
            { "name": 'Dead', "value": dead, "color": '#ef4444' }
        ],
        "priorityZones": priority_zones,
        "recentHistory": recentHistory,
        "kpiStats": [
            { "label": 'Total Trees', "val": f"{total_trees:,}", "trend": '+0.0%', "trendUp": True, "color": 'text-[#04211a]', "border": 'border-slate-200' },
            { "label": 'Healthy', "val": f"{healthy:,}", "trend": '+0.0%', "trendUp": True, "color": 'text-emerald-700', "border": 'border-emerald-200' },
            { "label": 'Small Canopy', "val": f"{small:,}", "trend": '+0.0%', "trendUp": False, "color": 'text-blue-700', "border": 'border-blue-200' },
            { "label": 'Yellowing', "val": f"{yellow:,}", "trend": '+0.0%', "trendUp": False, "color": 'text-amber-700', "border": 'border-amber-200' },
            { "label": 'Dead / Missing', "val": f"{dead:,}", "trend": '+0.0%', "trendUp": True, "color": 'text-red-700', "border": 'border-red-200' },
        ]
    }

    # Set cache for 1 hour
    redis_client.setex(cache_key, 3600, json.dumps(stats_response))

    return stats_response
