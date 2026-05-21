import logging

from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()

    logging.basicConfig(
        level=logging.DEBUG if settings.debug else logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )

    application = FastAPI(title=settings.app_name)
    application.include_router(api_router)
    return application


app = create_app()
