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
    properties = relationship("Property", back_populates="agent")