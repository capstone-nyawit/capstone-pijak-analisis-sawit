from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.base_class import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_name = Column(String(100), nullable=False)
    user_role = Column(String(50), nullable=False)
    action = Column(String(50), nullable=False) # e.g. "LOGIN", "LOGOUT"
    detail = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
