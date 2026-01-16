from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate

async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    result = await session.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def create_user(session: AsyncSession, user_in: UserCreate, role: UserRole = UserRole.AGENT) -> User:
    db_user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        name=user_in.name,
        phone=user_in.phone,
        role=role
    )
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user

async def get_all_agents(session: AsyncSession) -> Sequence[User]:
    result = await session.execute(select(User).where(User.role == UserRole.AGENT))
    return result.scalars().all()
async def update_user(session: AsyncSession, db_user: User, user_in: UserUpdate) -> User:
    update_data = user_in.model_dump(exclude_unset=True)
    if not update_data:
        return db_user
        
    if "password" in update_data and update_data["password"]:
        hashed_password = get_password_hash(update_data["password"])
        del update_data["password"]
        db_user.password_hash = hashed_password
        
    for field, value in update_data.items():
        if hasattr(db_user, field):
            setattr(db_user, field, value)
            
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user

async def delete_user(session: AsyncSession, db_user: User) -> None:
    await session.delete(db_user)
    await session.commit()

async def get_user_by_id(session: AsyncSession, user_id: int) -> User | None:
    result = await session.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()
