import os

import uvicorn

from app.main import app


if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "true").lower() in {"1", "true", "yes", "y", "on"}
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)
