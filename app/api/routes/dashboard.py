from fastapi import APIRouter, Depends
from app.core.security import get_current_user_token

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(current_user: dict = Depends(get_current_user_token)):
    return {
        "classDistribution": [
            { "name": 'Healthy', "value": 8420, "color": '#10b981' },
            { "name": 'Small', "value": 1240, "color": '#3b82f6' },
            { "name": 'Yellow', "value": 315, "color": '#f59e0b' },
            { "name": 'Dead', "value": 45, "color": '#ef4444' }
        ],
        "riskHeatmap": [
            { "id": 'N-01', "risk": 'low' }, { "id": 'N-02', "risk": 'low' }, { "id": 'N-03', "risk": 'medium' }, { "id": 'N-04', "risk": 'low' },
            { "id": 'S-01', "risk": 'medium' }, { "id": 'S-02', "risk": 'critical' }, { "id": 'S-03', "risk": 'medium' }, { "id": 'S-04', "risk": 'low' },
            { "id": 'E-01', "risk": 'low' }, { "id": 'E-02', "risk": 'medium' }, { "id": 'E-03', "risk": 'low' }, { "id": 'E-04', "risk": 'low' },
        ],
        "recentHistory": [
            { "id": 'ANL-2391', "date": 'Oct 24, 2026', "block": 'Block A - North', "trees": 2450, "status": 'Completed', "confidence": '94.2%', "thumb": 'https://images.unsplash.com/photo-1627883907153-61b453e00cc2?auto=format&fit=crop&w=100&q=80' },
            { "id": 'ANL-2390', "date": 'Oct 23, 2026', "block": 'Block C - East', "trees": 3150, "status": 'Completed', "confidence": '89.1%', "thumb": 'https://images.unsplash.com/photo-1589920153093-fa1199321fde?auto=format&fit=crop&w=100&q=80' },
            { "id": 'ANL-2389', "date": 'Oct 20, 2026', "block": 'Block B - South', "trees": 1840, "status": 'Completed', "confidence": '96.5%', "thumb": 'https://images.unsplash.com/photo-1611326490697-7c703b44bdf9?auto=format&fit=crop&w=100&q=80' },
            { "id": 'ANL-2388', "date": 'Oct 18, 2026', "block": 'Block D - West', "trees": 2580, "status": 'Reviewed', "confidence": '91.8%', "thumb": 'https://images.unsplash.com/photo-1590682121342-eb4c798725ee?auto=format&fit=crop&w=100&q=80' }
        ],
        "kpiStats": [
            { "label": 'Total Trees', "val": '10,020', "trend": '+1.2%', "trendUp": True, "color": 'text-[#04211a]', "border": 'border-slate-200' },
            { "label": 'Healthy', "val": '8,420', "trend": '+2.4%', "trendUp": True, "color": 'text-emerald-700', "border": 'border-emerald-200' },
            { "label": 'Small Canopy', "val": '1,240', "trend": '-0.5%', "trendUp": False, "color": 'text-blue-700', "border": 'border-blue-200' },
            { "label": 'Yellowing', "val": '315', "trend": '+12.4%', "trendUp": False, "color": 'text-amber-700', "border": 'border-amber-200' },
            { "label": 'Dead / Missing', "val": '45', "trend": '-2.1%', "trendUp": True, "color": 'text-red-700', "border": 'border-red-200' },
        ]
    }
