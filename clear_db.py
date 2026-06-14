import argparse
import sys
from sqlalchemy import text
from app.db.session import engine
from app.db.base_class import Base
import app.models  # Required to register all models to Base.metadata
from app.db.redis import redis_client

def main():
    parser = argparse.ArgumentParser(description="Clear all database tables and Redis cache.")
    parser.add_argument(
        "-f", "--force",
        action="store_true",
        help="Skip confirmation prompt and clear data immediately."
    )
    args = parser.parse_args()

    if not args.force:
        print("WARNING: This script will delete ALL data from all database tables and clear the Redis cache.")
        print("This action is DESTRUCTIVE and cannot be undone.")
        confirm = input("Are you sure you want to proceed? (y/N): ").strip().lower()
        if confirm not in ("y", "yes"):
            print("Aborted.")
            sys.exit(0)

    print("\n--- Clearing SQL Database Tables ---")
    try:
        with engine.connect() as connection:
            trans = connection.begin()
            try:
                # Disable foreign key checks for MySQL
                connection.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
                
                # Retrieve all registered tables
                tables = list(Base.metadata.tables.keys())
                
                for table_name in tables:
                    if table_name == "alembic_version":
                        continue
                    print(f"Truncating table: {table_name}")
                    connection.execute(text(f"TRUNCATE TABLE `{table_name}`;"))
                
                # Re-enable foreign key checks
                connection.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
                trans.commit()
                print("Successfully cleared all database tables and reset auto-increment counters.")
            except Exception as e:
                trans.rollback()
                print(f"Error during database execution: {e}")
                sys.exit(1)
    except Exception as e:
        print(f"Connection error to database: {e}")
        sys.exit(1)

    print("\n--- Clearing Redis Cache ---")
    try:
        # Flush the current Redis database
        redis_client.flushdb()
        print("Successfully flushed Redis database.")
    except Exception as e:
        print(f"Error flushing Redis: {e}")
        sys.exit(1)

    print("\nAll database tables and Redis cache have been successfully cleared!")

if __name__ == "__main__":
    main()
