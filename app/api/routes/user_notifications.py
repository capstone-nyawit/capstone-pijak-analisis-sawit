from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.session import get_db
from app.models.user_notification import UserNotification
from app.schemas.user_notification import UserNotificationResponse
from app.api.routes.auth import get_current_user
from app.models.user import User

router = APIRouter()


def create_user_notification(db: Session, user_id: int, message: str, type: str = "info") -> UserNotification:
    """Helper to create and persist a user notification (for use in other routes)."""
    notif = UserNotification(user_id=user_id, message=message, type=type)
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


class NotifCreate(BaseModel):
    message: str
    type: str = "info"


@router.get("/", response_model=list[UserNotificationResponse])
def get_my_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get notifications only for the currently logged-in user."""
    return (
        db.query(UserNotification)
        .filter(UserNotification.user_id == current_user.id)
        .order_by(UserNotification.created_at.desc())
        .limit(50)
        .all()
    )


@router.post("/", response_model=UserNotificationResponse)
def create_notification(
    payload: NotifCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a notification for the current user (called from frontend after feature completes)."""
    notif = UserNotification(user_id=current_user.id, message=payload.message, type=payload.type)
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


@router.patch("/{notification_id}/read")
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notif = db.query(UserNotification).filter(
        UserNotification.id == notification_id,
        UserNotification.user_id == current_user.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notifikasi tidak ditemukan")
    notif.is_read = True
    db.commit()
    return {"message": "Ditandai dibaca"}


@router.post("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(UserNotification).filter(
        UserNotification.user_id == current_user.id,
        UserNotification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "Semua notifikasi ditandai dibaca"}
