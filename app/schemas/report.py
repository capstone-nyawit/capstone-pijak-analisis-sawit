from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportBase(BaseModel):
    report_code: str
    name: str
    type: str
    size: str

class ReportResponse(ReportBase):
    id: int
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True
