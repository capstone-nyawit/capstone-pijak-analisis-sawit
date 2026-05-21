from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from app.db.base_class import Base

class Invitation(Base):
    __tablename__ = "invitations"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    expired_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
