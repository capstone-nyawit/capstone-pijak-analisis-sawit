from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportBase(BaseModel):
    report_code: str
    name: str
    type: str
    size: Optional[str] = None

class ReportResponse(ReportBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime
    inference_log_id: Optional[int] = None
    log_code: Optional[str] = None
    image_url: Optional[str] = None
    results_json: Optional[list] = None
    healthy_count: int = 0
    small_count: int = 0
    yellow_count: int = 0
    dead_count: int = 0

    class Config:
        from_attributes = True
