from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.base_class import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    report_code = Column(String(50), nullable=False, unique=True, index=True) # e.g. RPT-104
    name = Column(String(200), nullable=False)
    type = Column(String(20), default="PDF") # PDF, CSV, XLSX
    size = Column(String(20), nullable=True) # e.g. "2.4 MB"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
