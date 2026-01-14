# RealEstate Pro - Architecture Document

**Version:** 1.0  
**Date:** January 12, 2026  
**Author:** Winston (Architect) 🏗️  
**Status:** Final

---

## 1. System Overview

### 1.1 High-Level Architecture

RealEstate Pro is a two-tier monolithic web application following a layered architecture pattern inspired by the [benavlabs/FastAPI-boilerplate](https://github.com/benavlabs/FastAPI-boilerplate).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React SPA)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Public    │  │    Agent    │  │    Admin    │  │  Shared Components  │ │
│  │   Views     │  │  Dashboard  │  │   Panel     │  │  (Layout, Auth)     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │ HTTP/REST (JSON)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (FastAPI)                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         API Layer (api/v1/)                          │   │
│  │   auth.py │ properties.py │ admin.py │ public.py │ health.py         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         CRUD Layer (crud/)                           │   │
│  │   crud_users.py │ crud_properties.py                                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                       Schemas Layer (schemas/)                       │   │
│  │   user.py │ property.py │ auth.py                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                       Models Layer (models/)                         │   │
│  │   user.py │ property.py                                              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                       Core Layer (core/)                             │   │
│  │   config.py │ security.py │ db/database.py │ exceptions.py           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │ SQLAlchemy 2.0 (async)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE (SQLite)                                  │
│                          data/realestate.db                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          FILE STORAGE (Local)                               │
│                           uploads/{property_id}/                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Design Principles

Following the FastAPI boilerplate patterns:

1. **Layered Architecture**: Request flows through API → CRUD → Models → Database
2. **Single Responsibility**: Each module has one clear purpose
3. **Dependency Injection**: Database sessions and auth via FastAPI Depends
4. **Schema-Driven Validation**: Pydantic schemas for all input/output
5. **Async-First**: Full async/await support throughout

### 1.3 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend Framework | React | 18.x |
| Frontend Language | TypeScript | 5.x |
| Frontend Styling | Tailwind CSS | 3.x |
| Frontend Routing | React Router | 6.x |
| Frontend HTTP | Axios | 1.x |
| Backend Framework | FastAPI | 0.109+ |
| Backend Language | Python | 3.11+ |
| ORM | SQLAlchemy | 2.0 |
| Validation | Pydantic | 2.x |
| Database | SQLite | 3.x |
| Auth | python-jose (JWT) + passlib[bcrypt] | - |

---

## 2. Backend Folder Structure

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

### 2.1 Key Files Explained

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

## 3. API Specifications

### 3.1 Authentication Endpoints

#### POST /api/v1/auth/login
```yaml
Summary: User login
Auth: None
Request Body:
  - email: string (required)
  - password: string (required)
Response 200:
  - access_token: string
  - token_type: "bearer"
Response 401:
  - detail: "Invalid credentials"
```

#### GET /api/v1/auth/me
```yaml
Summary: Get current user
Auth: JWT Bearer Token
Response 200: UserRead schema
Response 401: Unauthorized
```

### 3.2 Property Endpoints (Agent)

#### POST /api/v1/properties
```yaml
Summary: Create property
Auth: Agent or Admin
Request Body: PropertyCreate schema
Response 201: PropertyRead schema
Response 400: Validation errors
Response 401: Unauthorized
```

#### GET /api/v1/properties/mine
```yaml
Summary: Get agent's own properties
Auth: Agent
Query Params:
  - status: string (optional) - "draft" | "published"
  - sort: string (optional) - "created_at" | "price"
Response 200: List[PropertyRead]
```

#### PUT /api/v1/properties/{id}
```yaml
Summary: Update property
Auth: Owner or Admin
Path Params:
  - id: integer
Request Body: PropertyUpdate schema
Response 200: PropertyRead schema
Response 403: Not owner
Response 404: Not found
```

#### PATCH /api/v1/properties/{id}/status
```yaml
Summary: Update property status
Auth: Owner or Admin
Path Params:
  - id: integer
Request Body:
  - status: "draft" | "published"
Response 200: PropertyRead schema
```

#### POST /api/v1/properties/{id}/images
```yaml
Summary: Upload property images
Auth: Owner or Admin
Path Params:
  - id: integer
Request Body: multipart/form-data
  - files: List[UploadFile] (max 10 files, max 10MB each)
Response 200: PropertyRead schema (with updated images)
Response 400: Invalid file type/size
```

#### DELETE /api/v1/properties/{id}/images/{filename}
```yaml
Summary: Delete property image
Auth: Owner or Admin
Path Params:
  - id: integer
  - filename: string
Response 200: PropertyRead schema
Response 404: Image not found
```

### 3.3 Admin Endpoints

#### POST /api/v1/admin/agents
```yaml
Summary: Create agent account
Auth: Admin only
Request Body: UserCreate schema
Response 201: UserRead schema
Response 400: Email already exists
Response 403: Not admin
```

#### GET /api/v1/admin/agents
```yaml
Summary: List all agents
Auth: Admin only
Response 200: List[UserRead]
```

#### GET /api/v1/admin/properties
```yaml
Summary: Get all properties (paginated)
Auth: Admin only
Query Params:
  - page: integer (default: 1)
  - limit: integer (default: 20)
  - status: string (optional)
  - agent_id: integer (optional)
  - city: string (optional)
  - sort: string (optional) - "created_at" | "price" | "agent_name"
Response 200:
  - data: List[PropertyReadWithAgent]
  - total: integer
  - page: integer
  - limit: integer
```

### 3.4 Public Endpoints

#### GET /api/v1/public/properties
```yaml
Summary: Get published properties
Auth: None
Query Params:
  - page: integer (default: 1)
  - limit: integer (default: 12)
  - city: string (optional)
  - sort: string (optional) - "price_asc" | "price_desc" | "newest"
Response 200:
  - data: List[PropertyPublicRead]
  - total: integer
  - page: integer
  - limit: integer
```

#### GET /api/v1/public/properties/{id}
```yaml
Summary: Get property detail
Auth: None
Path Params:
  - id: integer
Response 200: PropertyDetailRead (includes agent contact info)
Response 404: Not found or not published
```

### 3.5 Health Endpoint

#### GET /api/v1/health
```yaml
Summary: Health check
Auth: None
Response 200:
  - status: "ok"
  - timestamp: string (ISO format)
```

---

## 4. Database Models

### 4.1 SQLAlchemy Models

Following the boilerplate pattern with SQLAlchemy 2.0:

**`app/models/user.py`**
```python
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship

from app.core.db.database import Base


class UserRole(str, PyEnum):
    AGENT = "agent"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.AGENT, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship (no SQLAlchemy lazy loading - use explicit joins)
    properties = relationship("Property", back_populates="agent", lazy="noload")
```

**`app/models/property.py`**
```python
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.core.db.database import Base


class PropertyType(str, PyEnum):
    HOUSE = "house"
    APARTMENT = "apartment"
    CONDO = "condo"
    LAND = "land"
    COMMERCIAL = "commercial"


class PropertyStatus(str, PyEnum):
    DRAFT = "draft"
    PUBLISHED = "published"


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    price = Column(Float, nullable=False, index=True)
    surface = Column(Float, nullable=False)
    city = Column(String(100), nullable=False, index=True)
    street = Column(String(200), nullable=True)
    address = Column(String(200), nullable=True)
    property_type = Column(Enum(PropertyType), nullable=False)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    images = Column(JSON, default=list)  # List of image filenames
    status = Column(Enum(PropertyStatus), default=PropertyStatus.DRAFT, index=True)
    agent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    agent = relationship("User", back_populates="properties", lazy="noload")
```

### 4.2 Database Schema Diagram

```
┌─────────────────────────────────┐       ┌─────────────────────────────────────┐
│            users                │       │            properties               │
├─────────────────────────────────┤       ├─────────────────────────────────────┤
│ id          INTEGER PK          │       │ id          INTEGER PK              │
│ email       VARCHAR(255) UNIQUE │       │ title       VARCHAR(200)            │
│ password_hash VARCHAR(255)      │       │ price       FLOAT                   │
│ name        VARCHAR(100)        │       │ surface     FLOAT                   │
│ phone       VARCHAR(20) NULL    │       │ city        VARCHAR(100)            │
│ role        ENUM(agent,admin)   │       │ street      VARCHAR(200) NULL       │
│ created_at  DATETIME            │       │ address     VARCHAR(200) NULL       │
└────────────────┬────────────────┘       │ property_type ENUM                  │
                 │                        │ bedrooms    INTEGER NULL            │
                 │ 1                      │ bathrooms   INTEGER NULL            │
                 │                        │ description TEXT NULL               │
                 │                        │ images      JSON                    │
                 │                        │ status      ENUM(draft,published)   │
                 │                        │ agent_id    INTEGER FK ─────────────┤
                 └────────────────────────│ created_at  DATETIME                │
                           *              │ updated_at  DATETIME                │
                                          └─────────────────────────────────────┘

Indexes:
  - users.email (unique)
  - properties.price
  - properties.city
  - properties.status
  - properties.agent_id
```

---

## 5. Pydantic Schemas

Following the boilerplate pattern: **Base, Create, Read, Update, UpdateInternal**

### 5.1 User Schemas (`app/schemas/user.py`)

```python
from datetime import datetime
from typing import Annotated, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.user import UserRole


# Base schema with shared fields
class UserBase(BaseModel):
    email: Annotated[EmailStr, Field(examples=["agent@realestate.pro"])]
    name: Annotated[str, Field(min_length=2, max_length=100, examples=["John Agent"])]
    phone: Annotated[Optional[str], Field(max_length=20, examples=["+1234567890"])] = None


# Schema for creating users (API input)
class UserCreate(UserBase):
    model_config = ConfigDict(extra="forbid")
    password: Annotated[str, Field(min_length=8, max_length=100)]


# Internal creation with hashed password
class UserCreateInternal(UserBase):
    password_hash: str
    role: UserRole = UserRole.AGENT


# Schema for reading users (API output)
class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    role: UserRole
    created_at: datetime


# Schema for updating users
class UserUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: Optional[str] = None
    phone: Optional[str] = None


# Schema for updating password
class UserPasswordUpdate(BaseModel):
    password: Annotated[str, Field(min_length=8, max_length=100)]
```

### 5.2 Property Schemas (`app/schemas/property.py`)

```python
from datetime import datetime
from typing import Annotated, Optional, List
from pydantic import BaseModel, ConfigDict, Field

from app.models.property import PropertyType, PropertyStatus


# Base schema with shared fields
class PropertyBase(BaseModel):
    title: Annotated[str, Field(min_length=5, max_length=200, examples=["Beautiful Family Home"])]
    price: Annotated[float, Field(gt=0, examples=[450000.00])]
    surface: Annotated[float, Field(gt=0, examples=[150.5])]
    city: Annotated[str, Field(min_length=2, max_length=100, examples=["Austin"])]
    street: Annotated[Optional[str], Field(max_length=200, examples=["Oak Lane"])] = None
    address: Annotated[Optional[str], Field(max_length=200, examples=["123 Oak Lane"])] = None
    property_type: PropertyType
    bedrooms: Annotated[Optional[int], Field(ge=0, le=20, examples=[3])] = None
    bathrooms: Annotated[Optional[int], Field(ge=0, le=10, examples=[2])] = None
    description: Annotated[Optional[str], Field(max_length=5000)] = None


# Schema for creating properties (API input)
class PropertyCreate(PropertyBase):
    model_config = ConfigDict(extra="forbid")
    status: PropertyStatus = PropertyStatus.DRAFT


# Internal creation with agent_id
class PropertyCreateInternal(PropertyBase):
    agent_id: int
    status: PropertyStatus = PropertyStatus.DRAFT
    images: List[str] = []


# Schema for reading properties (API output)
class PropertyRead(PropertyBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    images: List[str]
    status: PropertyStatus
    agent_id: int
    created_at: datetime
    updated_at: datetime


# Schema for property list with agent name
class PropertyReadWithAgent(PropertyRead):
    agent_name: str
    agent_email: str


# Schema for updating properties
class PropertyUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: Optional[str] = None
    price: Optional[float] = None
    surface: Optional[float] = None
    city: Optional[str] = None
    street: Optional[str] = None
    address: Optional[str] = None
    property_type: Optional[PropertyType] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    description: Optional[str] = None


# Schema for internal updates (includes images)
class PropertyUpdateInternal(PropertyUpdate):
    images: Optional[List[str]] = None
    status: Optional[PropertyStatus] = None


# Schema for status update
class PropertyStatusUpdate(BaseModel):
    status: PropertyStatus


# Public list view (minimal agent info)
class PropertyPublicRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    price: float
    surface: float
    city: str
    property_type: PropertyType
    bedrooms: Optional[int]
    bathrooms: Optional[int]
    images: List[str]
    agent_name: str


# Public detail view (full agent contact)
class PropertyDetailRead(PropertyPublicRead):
    street: Optional[str]
    address: Optional[str]
    description: Optional[str]
    agent_email: str
    agent_phone: Optional[str]
    created_at: datetime
```

### 5.3 Auth Schemas (`app/schemas/auth.py`)

```python
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int
    email: str
    role: str
```

### 5.4 Pagination Schema

```python
from typing import Generic, TypeVar, List
from pydantic import BaseModel

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    total: int
    page: int
    limit: int
    has_more: bool
```

---

## 6. CRUD Layer Design

Following the FastCRUD wrapper pattern from the boilerplate:

### 6.1 CRUD Users (`app/crud/crud_users.py`)

```python
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole
from app.schemas.user import UserCreateInternal, UserUpdate


class CRUDUser:
    """CRUD operations for User model"""

    async def get(self, db: AsyncSession, id: int) -> Optional[User]:
        result = await db.execute(select(User).where(User.id == id))
        return result.scalar_one_or_none()

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_multi(
        self,
        db: AsyncSession,
        role: Optional[UserRole] = None,
        skip: int = 0,
        limit: int = 100
    ) -> list[User]:
        query = select(User)
        if role:
            query = query.where(User.role == role)
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, obj_in: UserCreateInternal) -> User:
        db_obj = User(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, db_obj: User, obj_in: UserUpdate) -> User:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def exists(self, db: AsyncSession, email: str) -> bool:
        result = await db.execute(select(User.id).where(User.email == email))
        return result.scalar_one_or_none() is not None


crud_users = CRUDUser()
```

### 6.2 CRUD Properties (`app/crud/crud_properties.py`)

```python
from typing import Optional, List, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.property import Property, PropertyStatus
from app.models.user import User
from app.schemas.property import PropertyCreateInternal, PropertyUpdate, PropertyUpdateInternal


class CRUDProperty:
    """CRUD operations for Property model"""

    async def get(self, db: AsyncSession, id: int) -> Optional[Property]:
        result = await db.execute(select(Property).where(Property.id == id))
        return result.scalar_one_or_none()

    async def get_with_agent(self, db: AsyncSession, id: int) -> Optional[Tuple[Property, User]]:
        query = (
            select(Property, User)
            .join(User, Property.agent_id == User.id)
            .where(Property.id == id)
        )
        result = await db.execute(query)
        return result.first()

    async def get_multi_by_agent(
        self,
        db: AsyncSession,
        agent_id: int,
        status: Optional[PropertyStatus] = None,
        sort_by: str = "created_at",
        skip: int = 0,
        limit: int = 100
    ) -> List[Property]:
        query = select(Property).where(Property.agent_id == agent_id)
        if status:
            query = query.where(Property.status == status)
        
        # Sorting
        if sort_by == "price":
            query = query.order_by(Property.price.desc())
        else:
            query = query.order_by(Property.created_at.desc())
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_multi_published(
        self,
        db: AsyncSession,
        city: Optional[str] = None,
        sort: str = "newest",
        skip: int = 0,
        limit: int = 12
    ) -> Tuple[List[Tuple[Property, User]], int]:
        # Base query for published properties
        query = (
            select(Property, User)
            .join(User, Property.agent_id == User.id)
            .where(Property.status == PropertyStatus.PUBLISHED)
        )
        count_query = (
            select(func.count(Property.id))
            .where(Property.status == PropertyStatus.PUBLISHED)
        )

        if city:
            query = query.where(Property.city.ilike(f"%{city}%"))
            count_query = count_query.where(Property.city.ilike(f"%{city}%"))

        # Sorting
        if sort == "price_asc":
            query = query.order_by(Property.price.asc())
        elif sort == "price_desc":
            query = query.order_by(Property.price.desc())
        else:  # newest
            query = query.order_by(Property.created_at.desc())

        # Get total count
        total_result = await db.execute(count_query)
        total = total_result.scalar()

        # Get paginated results
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        
        return list(result.all()), total

    async def get_multi_admin(
        self,
        db: AsyncSession,
        status: Optional[PropertyStatus] = None,
        agent_id: Optional[int] = None,
        city: Optional[str] = None,
        sort_by: str = "created_at",
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[Tuple[Property, User]], int]:
        query = (
            select(Property, User)
            .join(User, Property.agent_id == User.id)
        )
        count_query = select(func.count(Property.id))

        if status:
            query = query.where(Property.status == status)
            count_query = count_query.where(Property.status == status)
        if agent_id:
            query = query.where(Property.agent_id == agent_id)
            count_query = count_query.where(Property.agent_id == agent_id)
        if city:
            query = query.where(Property.city.ilike(f"%{city}%"))
            count_query = count_query.where(Property.city.ilike(f"%{city}%"))

        # Sorting
        if sort_by == "price":
            query = query.order_by(Property.price.desc())
        elif sort_by == "agent_name":
            query = query.order_by(User.name)
        else:
            query = query.order_by(Property.created_at.desc())

        total_result = await db.execute(count_query)
        total = total_result.scalar()

        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        
        return list(result.all()), total

    async def create(self, db: AsyncSession, obj_in: PropertyCreateInternal) -> Property:
        db_obj = Property(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        db: AsyncSession,
        db_obj: Property,
        obj_in: PropertyUpdateInternal
    ) -> Property:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, db_obj: Property) -> None:
        await db.delete(db_obj)
        await db.commit()


crud_properties = CRUDProperty()
```

---

## 7. Frontend Component Architecture

### 7.1 Folder Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Root component with routing
│   ├── index.css                   # Tailwind imports
│   ├── vite-env.d.ts
│   │
│   ├── api/                        # API layer
│   │   ├── client.ts               # Axios instance with interceptors
│   │   ├── auth.ts                 # Auth API calls
│   │   ├── properties.ts           # Property API calls
│   │   └── types.ts                # API response types
│   │
│   ├── components/                 # Reusable components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Pagination.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── MobileMenu.tsx
│   │   │
│   │   ├── property/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyGrid.tsx
│   │   │   ├── PropertyForm.tsx
│   │   │   ├── PropertyTable.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   └── AgentContact.tsx
│   │   │
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── contexts/                   # React contexts
│   │   ├── AuthContext.tsx         # Auth state management
│   │   ├── ToastContext.tsx        # Toast notifications
│   │   └── FavoritesContext.tsx    # Favorites (localStorage)
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useFavorites.ts
│   │   ├── useProperties.ts
│   │   └── useToast.ts
│   │
│   ├── pages/                      # Page components
│   │   ├── public/
│   │   │   ├── HomePage.tsx
│   │   │   ├── PropertyDetailPage.tsx
│   │   │   └── FavoritesPage.tsx
│   │   │
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   │
│   │   ├── agent/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── EditPropertyPage.tsx
│   │   │
│   │   ├── admin/
│   │   │   └── AdminDashboardPage.tsx
│   │   │
│   │   └── NotFoundPage.tsx
│   │
│   ├── types/                      # TypeScript types
│   │   ├── user.ts
│   │   ├── property.ts
│   │   └── common.ts
│   │
│   └── utils/                      # Utility functions
│       ├── formatters.ts           # Price, date formatting
│       ├── validators.ts           # Form validation
│       └── storage.ts              # localStorage helpers
│
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
└── .env
```

### 7.2 Component Hierarchy

```
<App>
├── <AuthProvider>
├── <FavoritesProvider>
├── <ToastProvider>
└── <Router>
    ├── <Layout>
    │   ├── <Header />
    │   ├── <main>
    │   │   └── {page content}
    │   └── <Footer />
    │
    └── Routes:
        │
        ├── "/" → <HomePage>
        │   ├── <Hero />
        │   ├── <FilterBar />
        │   ├── <PropertyGrid>
        │   │   └── <PropertyCard /> (multiple)
        │   └── <Pagination />
        │
        ├── "/properties/:id" → <PropertyDetailPage>
        │   ├── <ImageGallery />
        │   ├── <PropertyInfo />
        │   └── <AgentContact />
        │
        ├── "/favorites" → <FavoritesPage>
        │   └── <PropertyGrid>
        │       └── <PropertyCard /> (multiple)
        │
        ├── "/login" → <LoginPage>
        │   └── <LoginForm />
        │
        ├── "/dashboard" → <ProtectedRoute role="agent">
        │   └── <DashboardPage>
        │       ├── <PropertyForm />
        │       └── <PropertyTable />
        │
        ├── "/dashboard/properties/:id/edit" → <ProtectedRoute role="agent">
        │   └── <EditPropertyPage>
        │       ├── <PropertyForm />
        │       └── <ImageUploader />
        │
        ├── "/admin" → <ProtectedRoute role="admin">
        │   └── <AdminDashboardPage>
        │       ├── <FilterBar />
        │       ├── <PropertyTable />
        │       └── <Pagination />
        │
        └── "*" → <NotFoundPage />
```

### 7.3 State Management

Using React Context API for simplicity:

**AuthContext:**
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

**FavoritesContext:**
```typescript
interface FavoritesContextType {
  favorites: number[];  // Property IDs
  addFavorite: (propertyId: number) => void;
  removeFavorite: (propertyId: number) => void;
  isFavorite: (propertyId: number) => boolean;
}
```

**ToastContext:**
```typescript
interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}
```

---

## 8. Authentication Flow

### 8.1 Sequence Diagram

```
┌────────┐     ┌────────────┐     ┌────────────┐     ┌──────────┐
│Frontend│     │  Backend   │     │  Security  │     │ Database │
└───┬────┘     └─────┬──────┘     └─────┬──────┘     └────┬─────┘
    │                │                  │                  │
    │ POST /auth/login                  │                  │
    │ {email, password}                 │                  │
    │───────────────>│                  │                  │
    │                │ get_by_email()   │                  │
    │                │──────────────────│─────────────────>│
    │                │                  │      User        │
    │                │<─────────────────│──────────────────│
    │                │                  │                  │
    │                │ verify_password()│                  │
    │                │─────────────────>│                  │
    │                │     True/False   │                  │
    │                │<─────────────────│                  │
    │                │                  │                  │
    │                │ create_access_token()               │
    │                │─────────────────>│                  │
    │                │     JWT Token    │                  │
    │                │<─────────────────│                  │
    │                │                  │                  │
    │ 200 {access_token, token_type}    │                  │
    │<───────────────│                  │                  │
    │                │                  │                  │
    │ Store in localStorage             │                  │
    │────────────────>                  │                  │
    │                │                  │                  │
    │ GET /properties/mine              │                  │
    │ Authorization: Bearer <token>     │                  │
    │───────────────>│                  │                  │
    │                │ verify_token()   │                  │
    │                │─────────────────>│                  │
    │                │   TokenData      │                  │
    │                │<─────────────────│                  │
    │                │                  │                  │
    │                │ get_current_user()                  │
    │                │──────────────────│─────────────────>│
    │                │                  │      User        │
    │                │<─────────────────│──────────────────│
    │                │                  │                  │
    │ 200 [properties]                  │                  │
    │<───────────────│                  │                  │
```

### 8.2 JWT Token Structure

```json
{
  "sub": "1",
  "email": "agent@realestate.pro",
  "role": "agent",
  "exp": 1736726400
}
```

### 8.3 Security Implementation (`app/core/security.py`)

```python
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from jose import JWTError, jwt
from pydantic import SecretStr

from app.core.config import settings

SECRET_KEY: SecretStr = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY.get_secret_value(), algorithm=ALGORITHM)


def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY.get_secret_value(), algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

### 8.4 Dependencies (`app/api/dependencies.py`)

```python
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.database import async_get_db
from app.core.security import verify_token
from app.crud.crud_users import crud_users
from app.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id = int(payload.get("sub"))
    user = await crud_users.get(db, id=user_id)
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_admin(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


async def get_current_agent(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    if current_user.role not in [UserRole.AGENT, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agent access required"
        )
    return current_user
```

---

## 9. Image Storage Strategy

### 9.1 Storage Architecture

```
backend/
└── uploads/                        # Root uploads directory
    ├── 1/                          # Property ID 1
    │   ├── main.jpg
    │   ├── kitchen.jpg
    │   └── bedroom.jpg
    ├── 2/                          # Property ID 2
    │   ├── exterior.png
    │   └── living_room.webp
    └── ...
```

### 9.2 Image Upload Flow

```
┌──────────┐     ┌───────────────┐     ┌──────────────┐     ┌──────────┐
│ Frontend │     │  API Endpoint │     │ File Handler │     │Filesystem│
└────┬─────┘     └───────┬───────┘     └──────┬───────┘     └────┬─────┘
     │                   │                    │                  │
     │ POST /properties/{id}/images           │                  │
     │ multipart/form-data                    │                  │
     │ [file1.jpg, file2.png]                 │                  │
     │──────────────────>│                    │                  │
     │                   │                    │                  │
     │                   │ Validate ownership │                  │
     │                   │ Validate file type │                  │
     │                   │ Validate file size │                  │
     │                   │                    │                  │
     │                   │ For each file:     │                  │
     │                   │────────────────────│                  │
     │                   │ generate_filename()│                  │
     │                   │<───────────────────│                  │
     │                   │                    │                  │
     │                   │ save_file()        │                  │
     │                   │────────────────────│─────────────────>│
     │                   │                    │   File saved     │
     │                   │<───────────────────│<─────────────────│
     │                   │                    │                  │
     │                   │ Update property.images                │
     │                   │                    │                  │
     │ 200 PropertyRead (with new images)     │                  │
     │<──────────────────│                    │                  │
```

### 9.3 Image Handler Implementation

```python
import os
import uuid
import aiofiles
from pathlib import Path
from fastapi import UploadFile, HTTPException

UPLOAD_DIR = Path("uploads")
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


async def save_property_image(
    property_id: int,
    file: UploadFile
) -> str:
    """Save an uploaded image and return the filename."""
    
    # Validate extension
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed: {ALLOWED_EXTENSIONS}"
        )
    
    # Validate size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // 1024 // 1024}MB"
        )
    
    # Create directory
    property_dir = UPLOAD_DIR / str(property_id)
    property_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    file_path = property_dir / filename
    
    # Save file
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)
    
    return filename


def delete_property_image(property_id: int, filename: str) -> bool:
    """Delete an image file."""
    file_path = UPLOAD_DIR / str(property_id) / filename
    if file_path.exists():
        file_path.unlink()
        return True
    return False


def get_image_url(property_id: int, filename: str) -> str:
    """Generate the URL for an image."""
    return f"/uploads/{property_id}/{filename}"
```

### 9.4 Serving Static Files

In `main.py`:
```python
from fastapi.staticfiles import StaticFiles

# Mount uploads directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```

---

## 10. Core Configuration

### 10.1 Config Settings (`app/core/config.py`)

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

### 10.2 Database Setup (`app/core/db/database.py`)

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

### 10.3 Environment Variables (`.env.example`)

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

## 11. Error Handling

### 11.1 Custom Exceptions (`app/core/exceptions.py`)

```python
from fastapi import HTTPException, status


class NotFoundException(HTTPException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class ForbiddenException(HTTPException):
    def __init__(self, detail: str = "Access denied"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class UnauthorizedException(HTTPException):
    def __init__(self, detail: str = "Not authenticated"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"}
        )


class DuplicateValueException(HTTPException):
    def __init__(self, detail: str = "Value already exists"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class ValidationException(HTTPException):
    def __init__(self, detail: str = "Validation error"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
```

### 11.2 Frontend Error Handling

```typescript
// api/client.ts
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
```

---

## 12. Testing Strategy

### 12.1 Backend Tests

```
tests/
├── conftest.py              # Fixtures: test DB, client, auth
├── test_auth.py             # Auth endpoint tests
├── test_properties.py       # Property CRUD tests
├── test_admin.py            # Admin endpoint tests
└── test_public.py           # Public endpoint tests
```

**Example Test (`tests/test_auth.py`):**
```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, test_agent):
    response = await client.post("/api/v1/auth/login", data={
        "username": test_agent.email,
        "password": "testpassword"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient):
    response = await client.post("/api/v1/auth/login", data={
        "username": "wrong@email.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
```

### 12.2 Frontend Tests

```
src/
├── components/
│   └── property/
│       └── PropertyCard.test.tsx
├── pages/
│   └── auth/
│       └── LoginPage.test.tsx
└── setupTests.ts
```

---

## 13. Deployment Considerations

### 13.1 Production Checklist

- [ ] Set `DEBUG=false`
- [ ] Generate strong `SECRET_KEY`
- [ ] Change admin password from default
- [ ] Configure proper CORS origins
- [ ] Set up HTTPS
- [ ] Consider PostgreSQL migration for production scale

### 13.2 Docker Configuration (Future)

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 14. API Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/health | - | Health check |
| POST | /api/v1/auth/login | - | Login |
| GET | /api/v1/auth/me | JWT | Current user |
| POST | /api/v1/admin/agents | Admin | Create agent |
| GET | /api/v1/admin/agents | Admin | List agents |
| GET | /api/v1/admin/properties | Admin | All properties |
| POST | /api/v1/properties | Agent | Create property |
| GET | /api/v1/properties/mine | Agent | My properties |
| PUT | /api/v1/properties/{id} | Owner | Update property |
| PATCH | /api/v1/properties/{id}/status | Owner | Update status |
| POST | /api/v1/properties/{id}/images | Owner | Upload images |
| DELETE | /api/v1/properties/{id}/images/{file} | Owner | Delete image |
| GET | /api/v1/public/properties | - | Published listings |
| GET | /api/v1/public/properties/{id} | - | Property detail |

---

*Architecture document created using the BMAD-METHOD™ framework*
