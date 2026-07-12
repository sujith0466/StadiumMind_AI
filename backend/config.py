import os
from dotenv import load_dotenv

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(dotenv_path=env_path, override=True)


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")

    # Handle Supabase connection strings (convert postgres:// to postgresql:// for SQLAlchemy)
    db_url = os.environ.get(
        "DATABASE_URL", "postgresql://stadium_admin:stadium_password@localhost:5432/stadium_mind"
    )
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Engine options for Supabase / connection pooling
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": 10,
        "max_overflow": 20,
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-jwt-secret")
    REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
    ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
