from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect, BackgroundTasks, File, UploadFile
import jwt
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid
import os
import random
import string
from app.db.redis import redis_client

from app.db.session import get_db
from app.schemas.user import (
    RegisterIndividual, RegisterOrganization, JoinOrganization, 
    UserLogin, UserResponse, Token, InviteRequest,
    ForgotPasswordRequest, ResetPasswordRequest,
    ProfileUpdateRequest, PasswordUpdateRequest, EmailUpdateRequest,
    RequestEmailChange, ConfirmEmailChange
)
from app.models.user import User
from app.models.company import Company
from app.models.notification import Notification
from fastapi.responses import RedirectResponse
from app.crud import crud_user
from app.core.security import (
    verify_password, create_access_token, get_password_hash, 
    get_current_user_token, create_verification_token, verify_verification_token,
    create_reset_token, verify_reset_token
)
from app.services.email import (
    send_verification_email, send_invite_email,
    send_reset_password_email, send_approval_email
)

router = APIRouter()

def get_current_user(token_payload: dict = Depends(get_current_user_token), db: Session = Depends(get_db)) -> User:
    user = db.query(User).filter(User.id == token_payload["id"]).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User tidak ditemukan")
    return user

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak. Membutuhkan role admin.")
    return current_user

@router.post("/register/individual", response_model=UserResponse)
def register_individual(user_in: RegisterIndividual, db: Session = Depends(get_db)):
    if crud_user.get_user_by_email(db, email=user_in.email):
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")
    
    user = crud_user.create_user(
        db, 
        full_name=user_in.full_name,
        email=user_in.email,
        password=user_in.password,
        role="user",
        status="active"
    )
    return user

@router.post("/register/organization", response_model=UserResponse)
def register_organization(org_in: RegisterOrganization, db: Session = Depends(get_db)):
    if crud_user.get_user_by_email(db, email=org_in.email):
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")
    
    from sqlalchemy import func
    existing_company = db.query(Company).filter(func.lower(Company.name) == func.lower(org_in.company_name)).first()
    if existing_company:
        raise HTTPException(status_code=400, detail="Nama Organisasi sudah ada.")
        
    company = Company(name=org_in.company_name)
    db.add(company)
    db.commit()
    db.refresh(company)

    user = crud_user.create_user(
        db,
        full_name=org_in.full_name,
        email=org_in.email,
        password=org_in.password,
        role="admin",
        company_id=company.id,
        company_name=org_in.company_name,
        status="active"
    )
    return user

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    email = verify_verification_token(token)
    user = crud_user.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    user.status = "active"
    db.commit()
    
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip('/')
    return RedirectResponse(url=f"{frontend_url}/auth?verified=true")

@router.post("/join", response_model=UserResponse)
def join_organization(join_in: JoinOrganization, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    company_id_str = redis_client.get(f"invite_code:{join_in.invite_code}")
    if not company_id_str:
        raise HTTPException(status_code=400, detail="Kode undangan tidak valid atau kedaluwarsa")

    company_id = int(company_id_str)
    if crud_user.get_user_by_email(db, email=join_in.email):
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")
    
    company = db.query(Company).filter(Company.id == company_id).first()
    company_name = company.name if company else None

    user = crud_user.create_user(
        db,
        full_name=join_in.full_name,
        email=join_in.email,
        password=join_in.password,
        role="user",
        company_id=company_id,
        company_name=company_name,
        status="pending"
    )
    
    new_notif = Notification(
        company_id=company_id,
        message=f"Pengguna baru ({join_in.full_name}) meminta bergabung. Menunggu persetujuan.",
        type="info"
    )
    db.add(new_notif)
    db.commit()
    
    try:
        from app.core.websocket import manager
        background_tasks.add_task(manager.broadcast_to_company, company_id, {"type": "refresh_users"})
        # Only notify admins of this specific company
        background_tasks.add_task(manager.broadcast_to_admins, company_id, {"type": "new_notification"})
    except Exception:
        pass
        
    return user

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_email(db, email=user_in.identifier)
    if not user:
        user = crud_user.get_user_by_username(db, username=user_in.identifier)
        
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Username/Email atau Password salah.")
    
    if hasattr(user, 'status') and getattr(user, 'status') != "active":
        raise HTTPException(status_code=403, detail="Akun belum aktif. Cek email verifikasi.")
    
    access_token = create_access_token(subject=user.id, role=user.role)
    
    def update_presence(user_id):
        try:
            from app.db.redis import redis_client
            from datetime import datetime
            redis_client.setex(f"user_online:{user_id}", 120, "1")
            redis_client.set(f"user_last_active:{user_id}", datetime.now().isoformat())
        except Exception:
            pass
            
    background_tasks.add_task(update_presence, user.id)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.role
    }

@router.get("/invite/status")
def get_invite_status(current_user: User = Depends(get_current_user)):
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="Anda belum tergabung di organisasi")
    
    code = redis_client.get(f"company_invite:{current_user.company_id}")
    if not code:
        return {"code": None, "ttl_seconds": 0}
        
    ttl = redis_client.ttl(f"company_invite:{current_user.company_id}")
    if ttl < 0:
        ttl = 0
        
    return {"code": code, "ttl_seconds": ttl}

@router.post("/invite")
def invite_user(req: InviteRequest, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="Anda belum tergabung di organisasi")
    
    old_code = redis_client.get(f"company_invite:{current_user.company_id}")
    if old_code:
        redis_client.delete(f"invite_code:{old_code}")
    
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    code = suffix
    
    redis_client.setex(f"invite_code:{code}", 600, current_user.company_id)
    redis_client.setex(f"company_invite:{current_user.company_id}", 600, code)
    
    if req.email:
        company = db.query(Company).filter(Company.id == current_user.company_id).first()
        send_invite_email(req.email, code, company.name if company else "Organisasi")
        
    return {"message": "Invite code generated", "code": code, "ttl_seconds": 600}

@router.get("/users/status")
def get_user_status(email: str, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return {"status": user.status}

@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    if not current_user.company_id:
        return []
    users = db.query(User).filter(User.company_id == current_user.company_id).all()
    
    result = []
    from datetime import datetime
    for u in users:
        is_online = redis_client.get(f"user_online:{u.id}") is not None
        last_active_raw = redis_client.get(f"user_last_active:{u.id}")
        
        last_active_str = "Never"
        if last_active_raw:
            try:
                last_active_dt = datetime.fromisoformat(last_active_raw)
                diff = datetime.now() - last_active_dt
                if diff.total_seconds() < 60:
                    last_active_str = "Just now"
                elif diff.total_seconds() < 3600:
                    mins = int(diff.total_seconds() // 60)
                    last_active_str = f"{mins}m ago"
                elif diff.total_seconds() < 86400:
                    hours = int(diff.total_seconds() // 3600)
                    last_active_str = f"{hours}h ago"
                else:
                    last_active_str = last_active_dt.strftime("%d %b %Y")
            except Exception:
                last_active_str = "Just now"
                
        if is_online:
            last_active_str = "Just now"
            
        u_dict = {
            "id": u.id,
            "full_name": u.full_name,
            "company_name": u.company_name,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "status": u.status,
            "company_id": u.company_id,
            "is_online": is_online,
            "last_active": last_active_str
        }
        result.append(u_dict)
        
    return result

@router.delete("/users/{user_id}")
def delete_user(user_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    target_user = db.query(User).filter(User.id == user_id, User.company_id == current_user.company_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
        
    if target_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Tidak dapat menghapus akun Anda sendiri")
        
    db.delete(target_user)
    db.commit()
    
    try:
        from app.core.websocket import manager
        background_tasks.add_task(manager.broadcast_to_company, current_user.company_id, {"type": "refresh_users"})
    except Exception:
        pass
        
    return {"message": "User berhasil dihapus"}

@router.patch("/users/{user_id}/role")
def change_user_role(user_id: int, role: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    if role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Role tidak valid")
        
    target_user = db.query(User).filter(User.id == user_id, User.company_id == current_user.company_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
        
    if role == "user" and target_user.role == "admin":
        admin_count = db.query(User).filter(User.company_id == current_user.company_id, User.role == "admin").count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Tidak dapat menghapus admin terakhir")
            
    target_user.role = role
    db.commit()
    
    try:
        from app.core.websocket import manager
        background_tasks.add_task(manager.broadcast_to_company, current_user.company_id, {"type": "refresh_users"})
    except Exception:
        pass
        
    return {"message": f"Role berhasil diubah menjadi {role}"}

@router.post("/users/{user_id}/approve")
def approve_user(user_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    target_user = db.query(User).filter(User.id == user_id, User.company_id == current_user.company_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    if target_user.status == "active":
        return {"message": "User sudah aktif"}
        
    target_user.status = "active"
    db.commit()
    
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    company_name = company.name if company else "Organisasi"
    send_approval_email(target_user.email, company_name)
    
    try:
        from app.core.websocket import manager
        background_tasks.add_task(manager.broadcast_to_company, current_user.company_id, {"type": "refresh_users"})
    except Exception:
        pass
        
    return {"message": "User berhasil disetujui dan email notifikasi telah dikirim."}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_email(db, email=req.email)
    if not user:
        raise HTTPException(status_code=404, detail="Maaf email tidak terdaftar")
    
    token = create_reset_token(user.email)
    send_reset_password_email(user.email, token)
    return {"message": "Link reset password telah dikirim ke email Anda."}

@router.get("/heartbeat")
def heartbeat(current_user: User = Depends(get_current_user)):
    return {"status": "alive"}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_reset_token(req.token)
    user = crud_user.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    user.hashed_password = get_password_hash(req.password)
    db.commit()
    return {"message": "Password berhasil diubah."}

@router.get("/users/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/users/profile", response_model=UserResponse)
def update_profile(req: ProfileUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_user.full_name = req.full_name
    # Pydantic sends profile_photo as null if removePhotoSelected is true
    current_user.profile_photo = req.profile_photo
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/users/profile-photo")
def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    import cloudinary
    import cloudinary.uploader
    from app.core.config import get_settings
    
    settings = get_settings()
    cloudinary.config(
        cloud_name = settings.cloudinary_cloud_name,
        api_key = settings.cloudinary_api_key,
        api_secret = settings.cloudinary_api_secret,
        secure = True
    )
    
    try:
        upload_result = cloudinary.uploader.upload(
            file.file,
            folder="profile-pictures",
            transformation=[
                {"width": 150, "height": 150, "crop": "fill"}
            ]
        )
        secure_url = upload_result.get("secure_url")
        current_user.profile_photo = secure_url
        db.commit()
        db.refresh(current_user)
        return {"profile_photo": secure_url, "user": current_user}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengunggah foto: {str(e)}")

@router.put("/users/password")
def update_password(req: PasswordUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not verify_password(req.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Password lama tidak sesuai")
    
    current_user.hashed_password = get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password berhasil diperbarui"}

@router.post("/users/request-email-change")
def request_email_change(req: RequestEmailChange, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if req.old_email != current_user.email:
        raise HTTPException(status_code=400, detail="Email lama tidak sesuai dengan akun Anda")
    if not verify_password(req.password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Password salah")
    
    from app.core.security import create_email_change_token
    from app.services.email import send_email_change_link
    
    token = create_email_change_token(current_user.email)
    success = send_email_change_link(current_user.email, token)
    
    if not success:
        raise HTTPException(status_code=500, detail="Gagal mengirim email konfirmasi")
    
    return {"message": "Link konfirmasi telah dikirim ke email lama Anda"}

@router.post("/users/confirm-email-change")
def confirm_email_change(req: ConfirmEmailChange, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    from app.core.security import verify_email_change_token
    
    old_email = verify_email_change_token(req.token)
    
    # Check if new email is already used
    existing_user = db.query(User).filter(User.email == req.new_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email baru sudah terdaftar")
        
    user = db.query(User).filter(User.email == old_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
        
    user.email = req.new_email
    db.commit()
    
    if user.company_id:
        try:
            from app.core.websocket import manager
            background_tasks.add_task(manager.broadcast_to_company, user.company_id, {"type": "refresh_users"})
        except Exception:
            pass
    
    return {"message": "Email berhasil diperbarui"}




@router.websocket("/ws/presence")
async def websocket_presence(websocket: WebSocket, token: str = None):
    if not token:
        await websocket.close(code=1008)
        return

    try:
        from app.core.config import get_settings
        settings = get_settings()
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id_val = payload.get("sub")
        if user_id_val is None:
            await websocket.close(code=1008)
            return
        user_id = int(user_id_val)
    except Exception:
        await websocket.close(code=1008)
        return

    from app.db.session import SessionLocal
    from app.models.user import User

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.company_id:
            await websocket.close(code=1008)
            return
        company_id = user.company_id
        user_role = user.role  # "admin" or "user"
    finally:
        db.close()

    from app.core.websocket import manager
    await manager.connect(websocket, company_id, user_id, role=user_role)

    try:
        from app.db.redis import redis_client
        from datetime import datetime
        redis_client.setex(f"user_online:{user_id}", 86400, "1")
        redis_client.set(f"user_last_active:{user_id}", datetime.now().isoformat())
    except Exception:
        pass

    await manager.broadcast_to_company(company_id, {"type": "refresh_users"})

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(websocket, company_id, user_id)
        
        if not manager.is_user_online(company_id, user_id):
            try:
                from app.db.redis import redis_client
                from datetime import datetime
                redis_client.delete(f"user_online:{user_id}")
                redis_client.set(f"user_last_active:{user_id}", datetime.now().isoformat())
            except Exception:
                pass
            
            await manager.broadcast_to_company(company_id, {"type": "refresh_users"})
