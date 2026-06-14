from fastapi import APIRouter

from app.api.health import router as health_router
from app.api.routes.auth import router as auth_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.admin import router as admin_router
from app.api.routes.notifications import router as notifications_router
from app.api.routes.user_notifications import router as user_notifications_router
from app.api.routes.logs import router as logs_router
from app.api.routes.reports import router as reports_router
from app.api.routes.vra import router as vra_router
from app.api.routes.report_xlsx import router as report_xlsx_router
from app.api.routes.predict import router as predict_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["system"])
api_router.include_router(auth_router, prefix="/api", tags=["auth"])
api_router.include_router(dashboard_router, prefix="/api/dashboard", tags=["dashboard"])
api_router.include_router(admin_router, prefix="/api/admin", tags=["admin"])
api_router.include_router(report_xlsx_router, prefix="/api/admin", tags=["admin-xlsx"])
api_router.include_router(notifications_router, prefix="/api/notifications", tags=["notifications"])
api_router.include_router(user_notifications_router, prefix="/api/user-notifications", tags=["user-notifications"])
api_router.include_router(logs_router, prefix="/api/logs", tags=["logs"])
api_router.include_router(reports_router, prefix="/api/reports", tags=["reports"])
api_router.include_router(vra_router, prefix="/api/vra", tags=["vra"])
api_router.include_router(predict_router, prefix="/api/predict", tags=["predict"])

