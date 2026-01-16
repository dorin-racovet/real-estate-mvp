from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.database import async_get_db
from app.core.security import verify_token
from app.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/access-token")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/access-token", auto_error=False)

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[AsyncSession, Depends(async_get_db)]
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user_id_str = verify_token(token)
    if user_id_str is None:
        raise credentials_exception
    
    try:
        user_id = int(user_id_str)
    except ValueError:
        raise credentials_exception
    
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
        
    return user

async def get_current_user_optional(
    token: Annotated[str | None, Depends(oauth2_scheme_optional)],
    session: Annotated[AsyncSession, Depends(async_get_db)]
) -> User | None:
    if not token:
        return None
    
    try:
        user_id_str = verify_token(token)
        if user_id_str is None:
            return None
        
        try:
            user_id = int(user_id_str)
        except ValueError:
            return None
        
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        return user
    except Exception:
        return None
async def get_current_admin(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user