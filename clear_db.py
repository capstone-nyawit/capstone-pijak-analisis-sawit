import sys
from app.db.session import engine
from sqlalchemy import text

def main():
    print("Clearing database tables (users, companies, invitations)...")
    try:
        with engine.connect() as connection:
            trans = connection.begin()
            try:
                connection.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
                connection.execute(text("TRUNCATE TABLE invitations;"))
                connection.execute(text("TRUNCATE TABLE users;"))
                connection.execute(text("TRUNCATE TABLE companies;"))
                connection.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
                trans.commit()
                print("Successfully cleared tables and reset AUTO_INCREMENT to 1.")
            except Exception as e:
                trans.rollback()
                print(f"Error during execution: {e}")
                sys.exit(1)
    except Exception as e:
        print(f"Connection error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
