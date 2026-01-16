from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.database import async_get_db
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.api.dependencies import get_current_user
from app.crud import crud_users

router = APIRouter()

@router.get('/me', response_model=UserRead)
async def read_current_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    return current_user

@router.patch('/me', response_model=UserRead)
async def update_current_user(
    user_in: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(async_get_db)]
):
    # If updating email, check uniqueness
    if user_in.email is not None and user_in.email != current_user.email:
        existing_user = await crud_users.get_user_by_email(session, user_in.email)
        if existing_user:
             raise HTTPException(status_code=400, detail='Email already registered')
             
    updated_user = await crud_users.update_user(session, current_user, user_in)
    return updated_user
