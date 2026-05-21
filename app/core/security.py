from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Any

from app.core.config import get_settings
from app.db.session import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # bcrypt expects bytes
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    return hashed_bytes.decode('utf-8')

def create_access_token(subject: str | Any, role: str) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode = {"exp": expire, "sub": str(subject), "role": role}
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt

def get_current_user_token(token: str = Depends(oauth2_scheme)):
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"id": int(user_id), "role": role}

def create_verification_token(email: str) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(hours=24)
    to_encode = {"exp": expire, "sub": email, "type": "verification"}
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt

def verify_verification_token(token: str) -> str:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if email is None or token_type != "verification":
            raise HTTPException(status_code=400, detail="Token tidak valid")
        return email
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token telah kedaluwarsa")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Token tidak valid")

def create_reset_token(email: str) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(hours=1)
    to_encode = {"exp": expire, "sub": email, "type": "reset"}
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt

def verify_reset_token(token: str) -> str:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if email is None or token_type != "reset":
            raise HTTPException(status_code=400, detail="Token reset tidak valid")
        return email
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token reset telah kedaluwarsa")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Token reset tidak valid")
