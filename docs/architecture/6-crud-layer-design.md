# 6. CRUD Layer Design

Following the FastCRUD wrapper pattern from the boilerplate:

## 6.1 CRUD Users (`app/crud/crud_users.py`)

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

## 6.2 CRUD Properties (`app/crud/crud_properties.py`)

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
