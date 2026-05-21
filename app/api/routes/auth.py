from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid
import os

from app.db.session import get_db
from app.schemas.user import (
    RegisterIndividual, RegisterOrganization, JoinOrganization, 
    UserLogin, UserResponse, Token, InviteRequest,
    ForgotPasswordRequest, ResetPasswordRequest
)
from app.models.user import User
from app.models.company import Company
from app.models.invitation import Invitation
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
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    user.status = "active"
    db.commit()
    
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip('/')
    return RedirectResponse(url=f"{frontend_url}/auth?verified=true")

@router.post("/join", response_model=UserResponse)
def join_organization(join_in: JoinOrganization, db: Session = Depends(get_db)):
    invitation = db.query(Invitation).filter(Invitation.code == join_in.invite_code, Invitation.is_active == True).first()
    if not invitation or datetime.utcnow() > invitation.expired_at:
        raise HTTPException(status_code=400, detail="Kode undangan tidak valid atau kedaluwarsa")

    if crud_user.get_user_by_email(db, email=join_in.email):
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")
    
    company = db.query(Company).filter(Company.id == invitation.company_id).first()
    company_name = company.name if company else None

    user = crud_user.create_user(
        db,
        full_name=join_in.full_name,
        email=join_in.email,
        password=join_in.password,
        role="user",
        company_id=invitation.company_id,
        company_name=company_name,
        status="pending"
    )
    return user

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_email(db, email=user_in.identifier)
    if not user:
        user = crud_user.get_user_by_username(db, username=user_in.identifier)
        
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Username/Email atau Password salah.")
    
    if hasattr(user, 'status') and getattr(user, 'status') != "active":
        raise HTTPException(status_code=403, detail="Akun belum aktif. Cek email verifikasi.")
    
    access_token = create_access_token(subject=user.id, role=user.role)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.role
    }

@router.post("/invite")
def invite_user(req: InviteRequest, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="Anda belum tergabung di organisasi")
    
    code = str(uuid.uuid4().hex)[:6].upper()
    expires = datetime.utcnow() + timedelta(minutes=10)
    
    invitation = Invitation(code=code, company_id=current_user.company_id, expired_at=expires)
    db.add(invitation)
    db.commit()
    
    if req.email:
        company = db.query(Company).filter(Company.id == current_user.company_id).first()
        send_invite_email(req.email, code, company.name if company else "Organisasi")
        
    return {"message": "Invite code generated", "code": code}

@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    if not current_user.company_id:
        return []
    users = db.query(User).filter(User.company_id == current_user.company_id).all()
    return users

@router.patch("/users/{user_id}/role")
def change_user_role(user_id: int, role: str, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
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
    return {"message": f"Role berhasil diubah menjadi {role}"}

@router.post("/users/{user_id}/approve")
def approve_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
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
    
    return {"message": "User berhasil disetujui dan email notifikasi telah dikirim."}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_email(db, email=req.email)
    if not user:
        raise HTTPException(status_code=404, detail="Maaf email tidak terdaftar")
    
    token = create_reset_token(user.email)
    send_reset_password_email(user.email, token)
    return {"message": "Link reset password telah dikirim ke email Anda."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_reset_token(req.token)
    user = crud_user.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    user.hashed_password = get_password_hash(req.password)
    db.commit()
    return {"message": "Password berhasil diubah."}
