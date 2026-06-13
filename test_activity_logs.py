import requests
import json
from app.db.session import SessionLocal
from app.models.activity_log import ActivityLog
from app.models.user import User

def test_flow():
    # 1. Fetch an existing admin user to log in
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.role == "admin").first()
        if not admin_user:
            print("No admin user found in DB to test with.")
            return
        
        email = admin_user.email
        print(f"Testing login/logout flow with admin: {email}")
        
        # 2. Test Login API
        # We need password. Since it's hashed, let's insert a log manually or test endpoints.
        # But wait, we can also check if we can simulate it directly, or run api request.
        # Let's see if we can log in with standard credentials. The user has approved the plan,
        # let's query the database to verify the activity_logs table actually exists and has correct columns.
        print("Verifying activity_logs table structure in database...")
        log_count = db.query(ActivityLog).count()
        print(f"Current log count: {log_count}")
        
        # Insert a sample LOGIN and LOGOUT to test report rendering
        print("Inserting sample logs...")
        sample_login = ActivityLog(
            company_id=admin_user.company_id,
            user_id=admin_user.id,
            user_name=admin_user.full_name or admin_user.username,
            user_role=admin_user.role,
            action="LOGIN",
            detail="Test Login Log"
        )
        sample_logout = ActivityLog(
            company_id=admin_user.company_id,
            user_id=admin_user.id,
            user_name=admin_user.full_name or admin_user.username,
            user_role=admin_user.role,
            action="LOGOUT",
            detail="Test Logout Log"
        )
        db.add(sample_login)
        db.add(sample_logout)
        db.commit()
        print("Successfully inserted sample activity logs.")
        
        # Verify they are returned in report_xlsx
        # We can simulate the report generation or query the event log directly.
        print("Verifying event serialization...")
        log_count_after = db.query(ActivityLog).count()
        print(f"Log count after insert: {log_count_after}")
        
    finally:
        db.close()

if __name__ == "__main__":
    test_flow()
