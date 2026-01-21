from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyUpdate

async def create_property(session: AsyncSession, property_in: PropertyCreate, agent_id: int) -> Property:
    db_obj = Property(
        **property_in.model_dump(),
        agent_id=agent_id,
        images=[]  # Initialize with empty list
    )
    session.add(db_obj)
    await session.commit()
    
    # Re-fetch the property with the agent eagerly loaded to ensure it's available for the response model
    query = select(Property).options(joinedload(Property.agent)).where(Property.id == db_obj.id)
    result = await session.execute(query)
    created_prop = result.scalar_one()
    
    return created_prop

async def get_property(session: AsyncSession, property_id: int) -> Property | None:
    result = await session.execute(
        select(Property).options(selectinload(Property.agent)).where(Property.id == property_id)
    )
    return result.scalar_one_or_none()

async def get_multi(
    session: AsyncSession,
    skip: int = 0,
    limit: int = 100,
) -> list[Property]:
    query = select(Property).options(selectinload(Property.agent)).offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()

async def get_multi_by_owner(
    session: AsyncSession, 
    owner_id: int, 
    status: str | None = None, 
    sort: str | None = None,
    skip: int = 0,
    limit: int = 100
) -> list[Property]:
    stmt = select(Property).options(selectinload(Property.agent)).where(Property.agent_id == owner_id)
    
    if status:
        stmt = stmt.where(Property.status == status)
        
    if sort == "price":
        stmt = stmt.order_by(Property.price.desc())
    else:
        # Default to created_at descending
        stmt = stmt.order_by(Property.created_at.desc())
        
    stmt = stmt.offset(skip).limit(limit)
    result = await session.execute(stmt)
    return list(result.scalars().all())

async def get_multi_published(
    session: AsyncSession,
    city: str | None = None,
    sort: str | None = None,
    skip: int = 0,
    limit: int = 100
) -> list[Property]:
    stmt = select(Property).options(joinedload(Property.agent)).where(Property.status == "published")
    
    if city:
        stmt = stmt.where(Property.city == city)

    if sort == "price_asc":
        stmt = stmt.order_by(Property.price.asc())
    elif sort == "price_desc":
        stmt = stmt.order_by(Property.price.desc())
    else:
        # Default to created_at descending
        stmt = stmt.order_by(Property.created_at.desc())
        
    stmt = stmt.offset(skip).limit(limit)
    result = await session.execute(stmt)
    return list(result.scalars().all())


async def update_property(
    session: AsyncSession,
    db_obj: Property,
    obj_in: PropertyUpdate | dict
) -> Property:
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.model_dump(exclude_unset=True)
        
    for field in update_data:
        if hasattr(db_obj, field):
            setattr(db_obj, field, update_data[field])
            
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    
    # Ensure agent is loaded
    q = select(Property).options(joinedload(Property.agent)).where(Property.id == db_obj.id)
    result = await session.execute(q)
    return result.scalar_one()

async def delete_property(session: AsyncSession, property_id: int) -> Property | None:
    db_obj = await get_property(session, property_id)
    if db_obj:
        await session.delete(db_obj)
        await session.commit()
    return db_obj
