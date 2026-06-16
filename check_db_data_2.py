from app.db.session import engine
from sqlalchemy import text

with engine.connect() as conn:
    print("--- USERS ---")
    res = conn.execute(text("SELECT id, full_name, email, role, company_id FROM users"))
    for row in res:
        print(row)
    
    print("\n--- INFERENCE LOGS ---")
    res = conn.execute(text("SELECT id, log_code, user_id, company_id, block_name FROM inference_logs"))
    for row in res:
        print(row)
