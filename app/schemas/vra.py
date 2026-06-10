from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VraAnalyzeRequest(BaseModel):
    block_name: str
    healthy_count: int
    yellowing_count: int
    small_canopy_count: int
    dead_count: int
    confidence_score: float

class VraRecommendationResponse(BaseModel):
    id: int
    inference_log_id: int
    healthy_count: int
    yellowing_count: int
    small_canopy_count: int
    dead_count: int
    overall_priority: str
    primary_concern: Optional[str]
    secondary_concern: Optional[str]
    recommended_programs: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
