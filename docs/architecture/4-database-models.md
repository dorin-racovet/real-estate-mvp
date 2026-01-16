# 4. Database Models

## 4.1 SQLAlchemy Models

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

## 4.2 Database Schema Diagram

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
