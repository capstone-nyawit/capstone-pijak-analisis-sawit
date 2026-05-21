from fastapi import APIRouter

from app.api.health import router as health_router
from app.api.routes.auth import router as auth_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.admin import router as admin_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["system"])
api_router.include_router(auth_router, prefix="/api", tags=["auth"])
api_router.include_router(dashboard_router, prefix="/api/dashboard", tags=["dashboard"])
api_router.include_router(admin_router, prefix="/api/admin", tags=["admin"])

