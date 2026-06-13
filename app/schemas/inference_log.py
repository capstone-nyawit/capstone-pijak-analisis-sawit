from pydantic import BaseModel
from typing import Optional
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

class InferenceLogResponse(InferenceLogBase):
    id: int
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True
