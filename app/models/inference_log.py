from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.base_class import Base

class InferenceLog(Base):
    __tablename__ = "inference_logs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    log_code = Column(String(50), nullable=False, unique=True, index=True) # e.g. ANL-8422
    user_name = Column(String(100), nullable=False)
    user_role = Column(String(50), nullable=False)
    block_name = Column(String(100), nullable=False)
    trees_count = Column(Integer, default=0)
    confidence_score = Column(Float, default=0.0)
    status = Column(String(50), default="Completed") # Completed, Flagged
    image_url = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
