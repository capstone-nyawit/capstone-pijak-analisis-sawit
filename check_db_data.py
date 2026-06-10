from app.db.session import engine
from sqlalchemy import text

with engine.connect() as conn:
    print("--- INFERENCE LOGS ---")
    res = conn.execute(text("SELECT id, log_code, block_name, created_at FROM inference_logs"))
    for row in res:
        print(row)
        
    print("\n--- REPORTS ---")
    res = conn.execute(text("SELECT id, report_code, name, created_at FROM reports"))
    for row in res:
        print(row)
