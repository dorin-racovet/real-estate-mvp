# 2. Backend Folder Structure

Following the [benavlabs/FastAPI-boilerplate](https://github.com/benavlabs/FastAPI-boilerplate) structure:

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   │
│   ├── api/                    # API Layer
│   │   ├── __init__.py         # Router aggregation
│   │   ├── dependencies.py     # Shared dependencies (auth, db)
│   │   └── v1/                 # API Version 1
│   │       ├── __init__.py     # v1 router aggregation
│   │       ├── auth.py         # Authentication endpoints
│   │       ├── properties.py   # Property CRUD endpoints (agent)
│   │       ├── admin.py        # Admin endpoints
│   │       ├── public.py       # Public listing endpoints
│   │       └── health.py       # Health check endpoint
│   │
│   ├── core/                   # Core utilities
│   │   ├── __init__.py
│   │   ├── config.py           # Settings and environment config
│   │   ├── security.py         # JWT, password hashing
│   │   ├── exceptions.py       # Custom HTTP exceptions
│   │   └── db/
│   │       ├── __init__.py
│   │       └── database.py     # Database connection & session
│   │
│   ├── crud/                   # CRUD operations (FastCRUD pattern)
│   │   ├── __init__.py
│   │   ├── crud_users.py       # User CRUD operations
│   │   └── crud_properties.py  # Property CRUD operations
│   │
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py             # User model
│   │   └── property.py         # Property model
│   │
│   └── schemas/                # Pydantic schemas
│       ├── __init__.py
│       ├── user.py             # User schemas
│       ├── property.py         # Property schemas
│       └── auth.py             # Auth schemas (Token, etc.)
│
├── data/                       # SQLite database location
│   └── realestate.db
│
├── uploads/                    # Image storage
│   └── {property_id}/
│       └── {filename}.jpg
│
├── tests/                      # Test files
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   └── test_properties.py
│
├── scripts/                    # Utility scripts
│   └── seed.py                 # Seed database with demo data
│
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
└── .env.example                # Environment template
```

## 2.1 Key Files Explained

**`app/main.py`** - Application factory and startup:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import router as api_router
from app.core.config import settings
from app.core.db.database import create_tables

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for image uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# API routes
app.include_router(api_router, prefix="/api")

@app.on_event("startup")
async def startup():
    await create_tables()
```

**`app/api/__init__.py`** - Router aggregation:
```python
from fastapi import APIRouter
from app.api.v1 import router as v1_router

router = APIRouter()
router.include_router(v1_router, prefix="/v1")
```

**`app/api/v1/__init__.py`** - v1 router aggregation:
```python
from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.properties import router as properties_router
from app.api.v1.admin import router as admin_router
from app.api.v1.public import router as public_router

router = APIRouter()
router.include_router(health_router, tags=["health"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(properties_router, prefix="/properties", tags=["properties"])
router.include_router(admin_router, prefix="/admin", tags=["admin"])
router.include_router(public_router, prefix="/public", tags=["public"])
```

---
