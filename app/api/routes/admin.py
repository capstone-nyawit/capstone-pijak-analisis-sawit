from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user_token

router = APIRouter()

@router.get("/system")
def get_admin_system_stats(current_user: dict = Depends(get_current_user_token)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return {
        "activeNodes": [
            { "node": 'Node-SEA-01', "load": '42%', "status": 'Online' },
            { "node": 'Node-SEA-02', "load": '18%', "status": 'Online' },
            { "node": 'Node-AUS-01', "load": '94%', "status": 'High Load' },
        ],
        "uptime": "99.99"
    }
