from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse
from app.api.routes.auth import get_current_user, require_admin
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=list[NotificationResponse])
def get_notifications(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    """Only admins of a specific company can see their company's notifications."""
    if not current_user.company_id:
        return []
    notifications = db.query(Notification).filter(
        Notification.company_id == current_user.company_id
    ).order_by(Notification.created_at.desc()).all()
    return notifications

@router.patch("/{notification_id}/read")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="Anda belum tergabung di organisasi")
        
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.company_id == current_user.company_id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notifikasi tidak ditemukan")
        
    notification.is_read = True
    db.commit()
    return {"message": "Notifikasi ditandai dibaca"}

@router.post("/read-all")
def mark_all_read(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="Anda belum tergabung di organisasi")
        
    db.query(Notification).filter(
        Notification.company_id == current_user.company_id,
        Notification.is_read == False
    ).update({"is_read": True})
    
    db.commit()
    return {"message": "Semua notifikasi ditandai dibaca"}


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="Anda belum tergabung di organisasi")

    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.company_id == current_user.company_id
    ).first()
    
    if not notif:
        raise HTTPException(status_code=404, detail="Notifikasi tidak ditemukan")
        
    db.delete(notif)
    db.commit()
    return {"message": "Notifikasi dihapus"}


@router.delete("/all/clear")
def clear_all_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="Anda belum tergabung di organisasi")

    db.query(Notification).filter(
        Notification.company_id == current_user.company_id
    ).delete()
    
    db.commit()
    return {"message": "Semua notifikasi dihapus"}
