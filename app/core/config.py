from functools import lru_cache
from urllib.parse import quote_plus

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    mysql_host: str = Field(default="localhost", validation_alias="MYSQL_HOST")
    mysql_port: int = Field(default=3306, validation_alias="MYSQL_PORT")
    mysql_user: str = Field(default="root", validation_alias="MYSQL_USER")
    mysql_password: str = Field(default="root", validation_alias="MYSQL_PASSWORD")
    mysql_db: str = Field(default="nyawit_ai", validation_alias="MYSQL_DB")

    app_name: str = Field(default="Nyawit AI Backend", validation_alias="APP_NAME")
    debug: bool = Field(default=False, validation_alias="DEBUG")

    jwt_secret_key: str = Field(default="super-secret-key-change-this-in-production", validation_alias="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=60 * 24 * 7) # 7 days

    redis_host: str = Field(default="localhost", validation_alias="REDIS_HOST")
    redis_port: int = Field(default=6379, validation_alias="REDIS_PORT")
    redis_db: int = Field(default=0, validation_alias="REDIS_DB")
    redis_password: str | None = Field(default=None, validation_alias="REDIS_PASSWORD")

    cloudinary_cloud_name: str = Field(default="dkrxyn8i5", validation_alias="CLOUDINARY_CLOUD_NAME")
    cloudinary_api_key: str = Field(default="531426464174435", validation_alias="CLOUDINARY_API_KEY")
    cloudinary_api_secret: str = Field(default="_5Gz60qB3OCQ62ONDcvUaVIWy8g", validation_alias="CLOUDINARY_API_SECRET")

    @property
    def database_url(self) -> str:
        user = quote_plus(self.mysql_user)
        password = quote_plus(self.mysql_password)
        host = self.mysql_host
        port = self.mysql_port
        db = self.mysql_db
        if self.mysql_password == "":
            return f"mysql+pymysql://{user}@{host}:{port}/{db}"
        return f"mysql+pymysql://{user}:{password}@{host}:{port}/{db}"


@lru_cache
def get_settings() -> Settings:
    return Settings()
