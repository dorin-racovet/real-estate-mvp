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

# Schema for reading properties (API output)
class PropertyAgent(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class PropertyRead(PropertyBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    images: List[str]
    status: PropertyStatus
    agent_id: int
    created_at: datetime
    updated_at: datetime
    agent: PropertyAgent
# Schema for updating properties
class PropertyUpdate(BaseModel):
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
    status: Optional[PropertyStatus] = None
    images: Optional[List[str]] = None
