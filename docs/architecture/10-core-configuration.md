# 10. Core Configuration

## 10.1 Config Settings (`app/core/config.py`)

```python
import os
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    # Application
    APP_NAME: str = "RealEstate Pro"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/realestate.db"
    
    # Security
    SECRET_KEY: SecretStr
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]
    
    # Admin user (seed)
    ADMIN_EMAIL: str = "admin@realestate.pro"
    ADMIN_PASSWORD: str = "admin123"
    ADMIN_NAME: str = "Platform Admin"


settings = Settings()
```

## 10.2 Database Setup (`app/core/db/database.py`)

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True
)

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


class Base(DeclarativeBase):
    pass


async def create_tables():
    """Create all tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def async_get_db():
    """Dependency for getting database session."""
    async with async_session_maker() as session:
        yield session
```

## 10.3 Environment Variables (`.env.example`)

```env
# Application
APP_NAME=RealEstate Pro
APP_VERSION=1.0.0
DEBUG=true

# Database
DATABASE_URL=sqlite+aiosqlite:///./data/realestate.db

# Security (generate with: openssl rand -hex 32)
SECRET_KEY=your-super-secret-key-change-in-production

# CORS
CORS_ORIGINS=["http://localhost:5173"]

# Admin seed user
ADMIN_EMAIL=admin@realestate.pro
ADMIN_PASSWORD=admin123
ADMIN_NAME=Platform Admin
```

---
