from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=True)
    company_name = Column(String(100), nullable=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="user")
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    status = Column(String(20), default="active") # active, pending
    is_active = Column(Boolean, default=True)
