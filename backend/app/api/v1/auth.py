from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.database import async_get_db
from app.core.security import verify_password, create_access_token
from app.core.rate_limit import login_rate_limiter
from app.models.user import User
from app.schemas.auth import Login, Token
from app.schemas.user import UserRead
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    login_data: Login,
    session: Annotated[AsyncSession, Depends(async_get_db)]
):
    # Check rate limiting
    if await login_rate_limiter.is_rate_limited(login_data.email):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please try again later.",
        )
    
    # Find user
    result = await session.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        # Record failed attempt
        await login_rate_limiter.record_failed_attempt(login_data.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Reset attempts on successful login
    await login_rate_limiter.reset_attempts(login_data.email)
    
    # Generate token
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/access-token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[AsyncSession, Depends(async_get_db)]
):
    # Check rate limiting
    if await login_rate_limiter.is_rate_limited(form_data.username):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please try again later.",
        )
    
    # Find user (username field contains email in our case)
    result = await session.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        # Record failed attempt
        await login_rate_limiter.record_failed_attempt(form_data.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Reset attempts on successful login
    await login_rate_limiter.reset_attempts(form_data.username)
    
    # Generate token
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserRead)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)]
):
    return current_user