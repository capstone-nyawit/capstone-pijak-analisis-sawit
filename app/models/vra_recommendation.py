from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class VraRecommendation(Base):
    __tablename__ = "vra_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    inference_log_id = Column(Integer, ForeignKey("inference_logs.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    healthy_count = Column(Integer, default=0)
    yellowing_count = Column(Integer, default=0)
    small_canopy_count = Column(Integer, default=0)
    dead_count = Column(Integer, default=0)
    
    overall_priority = Column(String(50), nullable=False) # Low, Medium, High, Critical
    primary_concern = Column(String(255), nullable=True)
    secondary_concern = Column(String(255), nullable=True)
    recommended_programs = Column(String(1000), nullable=True) # Serialized comma-separated string
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
