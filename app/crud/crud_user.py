from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash

from sqlalchemy import func

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(func.lower(User.email) == func.lower(email)).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def generate_username(db: Session, email: str) -> str:
    base_username = email.split("@")[0]
    username = base_username
    counter = 1
    while get_user_by_username(db, username):
        username = f"{base_username}{counter}"
        counter += 1
    return username

def create_user(db: Session, **kwargs):
    hashed_password = get_password_hash(kwargs.pop("password"))
    username = generate_username(db, kwargs.get("email"))
    
    db_user = User(
        username=username,
        hashed_password=hashed_password,
        **kwargs
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
