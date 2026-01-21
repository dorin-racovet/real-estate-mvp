import shutil
import uuid
from pathlib import Path
from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import flag_modified

from app.core.db.database import async_get_db
from app.models.user import User, UserRole
from app.schemas.property import PropertyCreate, PropertyRead, PropertyUpdate
from app.crud import crud_property
from app.api.dependencies import get_current_user, get_current_user_optional

router = APIRouter()

# Constants
UPLOAD_DIR = Path("uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("", response_model=PropertyRead, status_code=status.HTTP_201_CREATED)
async def create_property(
    property_in: PropertyCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(async_get_db)]
):
    return await crud_property.create_property(session, property_in, current_user.id)

@router.get("/mine", response_model=List[PropertyRead])
async def read_my_properties(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(async_get_db)],
    status: Annotated[Optional[str], Query()] = None,
    sort: Annotated[Optional[str], Query()] = None,
    skip: int = 0,
    limit: int = 100,
):
    """
    Get current user's properties.
    """
    return await crud_property.get_multi_by_owner(
        session, 
        owner_id=current_user.id, 
        status=status, 
        sort=sort,
        skip=skip,
        limit=limit
    )

@router.get("/published", response_model=List[PropertyRead])
async def read_published_properties(
    session: Annotated[AsyncSession, Depends(async_get_db)],
    city: Annotated[Optional[str], Query()] = None,
    sort: Annotated[Optional[str], Query()] = None,
    skip: int = 0,
    limit: int = 100,
):
    """
    Get all published properties (Public accessible).
    """
    return await crud_property.get_multi_published(
        session, 
        city=city,
        sort=sort,
        skip=skip,
        limit=limit
    )

@router.get("/{property_id}", response_model=PropertyRead)
async def read_property(
    property_id: int,
    session: Annotated[AsyncSession, Depends(async_get_db)],
    current_user: Annotated[User | None, Depends(get_current_user_optional)] = None
):
    property = await crud_property.get_property(session, property_id)
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
        
    # Check permissions
    is_owner = current_user and property.agent_id == current_user.id
    is_admin = current_user and current_user.role == UserRole.ADMIN
    is_published = property.status == "published"
    
    if not (is_published or is_owner or is_admin):
         raise HTTPException(status_code=404, detail="Property not found")
         
    return property

@router.patch("/{property_id}", response_model=PropertyRead)
async def update_property(
    property_id: int,
    property_in: PropertyUpdate,
    session: Annotated[AsyncSession, Depends(async_get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    property = await crud_property.get_property(session, property_id)
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
        
    # Check permissions (Owner or Admin)
    # Note: Simplistic check. Ideally, Admin can update anything, Owner only theirs.
    if property.agent_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to update this property")
        
    updated_property = await crud_property.update_property(session, property, property_in)
    return updated_property

@router.delete("/{property_id}", status_code=status.HTTP_200_OK)
async def delete_property(
    property_id: int,
    session: Annotated[AsyncSession, Depends(async_get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Delete a property.
    """
    property = await crud_property.get_property(session, property_id)
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
        
    # Check permissions (Owner or Admin)
    if property.agent_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to delete this property")
        
    await crud_property.delete_property(session, property_id)
    return {"detail": "Property deleted successfully"}

@router.post("/{property_id}/images", response_model=PropertyRead)
async def upload_property_images(
    property_id: int,
    files: List[UploadFile],
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(async_get_db)]
):
    # 1. Get Property
    property = await crud_property.get_property(session, property_id)
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
        
    # 2. Check Authorization (Owner or Admin)
    # Note: property.agent_id is an integer, current_user.id is an integer.
    if property.agent_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to update this property")
        
    # 3. Create upload directory
    prop_upload_dir = UPLOAD_DIR / str(property_id)
    prop_upload_dir.mkdir(parents=True, exist_ok=True)
    
    new_images = []
    
    for file in files:
        # Validate Extension
        ext = Path(file.filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            # Clean up what we might have saved? No, we just skip/fail this request.
            raise HTTPException(status_code=400, detail=f"File type not allowed: {file.filename}")
            
        # Generator unique filename
        filename = f"{uuid.uuid4()}{ext}"
        file_path = prop_upload_dir / filename
        
        # Save file
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
            
        # Verify size after save (simple MVP approach)
        if file_path.stat().st_size > MAX_FILE_SIZE:
            file_path.unlink() # Delete too large file
            raise HTTPException(status_code=400, detail=f"File too large: {file.filename}")
            
        new_images.append(f"uploads/{property_id}/{filename}")
        
    # 4. Update Database
    if property.images is None:
        property.images = []
        
    updated_images = list(property.images) + new_images
    property.images = updated_images
    flag_modified(property, "images")
    
    session.add(property)
    await session.commit()
    await session.refresh(property)
    
    return property