from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class InferenceLogBase(BaseModel):
    log_code: str
    user_name: str
    user_role: str
    block_name: str
    trees_count: int
    confidence_score: float
    status: str
    image_url: Optional[str] = None
    results_json: Optional[Any] = None
    healthy_count: Optional[int] = 0
    small_count: Optional[int] = 0
    yellow_count: Optional[int] = 0
    dead_count: Optional[int] = 0

class InferenceLogResponse(InferenceLogBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
