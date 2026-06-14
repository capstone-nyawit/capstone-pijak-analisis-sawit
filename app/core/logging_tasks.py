import asyncio
from typing import Optional
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.activity_log import ActivityLog
from app.models.notification import Notification
from app.core.websocket import manager

async def log_activity_async(
    company_id: Optional[int],
    user_id: int,
    user_name: str,
    user_role: str,
    action: str,
    detail: str
):
    """
    Background task to insert ActivityLog safely and broadcast it over WebSocket.
    """
    db: Session = SessionLocal()
    try:
        db_log = ActivityLog(
            company_id=company_id,
            user_id=user_id,
            user_name=user_name,
            user_role=user_role,
            action=action,
            detail=detail
        )
        db.add(db_log)
        db.commit()
        db.refresh(db_log)
        
        # Broadcast over WebSocket if company_id exists
        if company_id:
            message = {
                "type": "new_activity",
                "data": {
                    "id": db_log.id,
                    "action": action,
                    "user_name": user_name,
                    "detail": detail
                }
            }
            # Depending on privacy rules, broadcast to admins or company
            await manager.broadcast_to_admins(company_id, message)
            
    except Exception as e:
        print(f"Failed to log activity asynchronously: {e}")
    finally:
        db.close()

async def create_notification_async(
    company_id: int,
    message: str,
    notif_type: str = "info"
):
    """
    Background task to insert a Notification and broadcast over WebSocket.
    """
    db: Session = SessionLocal()
    try:
        new_notif = Notification(
            company_id=company_id,
            message=message,
            type=notif_type
        )
        db.add(new_notif)
        db.commit()
        db.refresh(new_notif)
        
        # Broadcast to admins for org-level notifications
        ws_msg = {
            "type": "new_notification",
            "data": {
                "id": new_notif.id,
                "message": message,
                "type": notif_type
            }
        }
        await manager.broadcast_to_admins(company_id, ws_msg)
        
    except Exception as e:
        print(f"Failed to create notification asynchronously: {e}")
    finally:
        db.close()
