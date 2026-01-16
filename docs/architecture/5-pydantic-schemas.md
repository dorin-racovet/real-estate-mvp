# 5. Pydantic Schemas

Following the boilerplate pattern: **Base, Create, Read, Update, UpdateInternal**

## 5.1 User Schemas (`app/schemas/user.py`)

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

## 5.2 Property Schemas (`app/schemas/property.py`)

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

## 5.3 Auth Schemas (`app/schemas/auth.py`)

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

## 5.4 Pagination Schema

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
