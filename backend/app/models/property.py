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
    agent = relationship("User", back_populates="properties")