import sys
from app.db.session import SessionLocal
from app.models.inference_log import InferenceLog
from app.schemas.inference_log import InferenceLogResponse

db = SessionLocal()
logs = db.query(InferenceLog).filter(InferenceLog.user_id == 3).all()

for log in logs:
    try:
        resp = InferenceLogResponse.from_orm(log)
        print(f"Log {log.id} OK")
    except Exception as e:
        print(f"Log {log.id} FAILED: {e}")
