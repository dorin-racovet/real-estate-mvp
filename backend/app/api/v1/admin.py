from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.database import async_get_db
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.schemas.property import PropertyRead
from app.api.dependencies import get_current_admin
from app.crud import crud_users, crud_property

router = APIRouter()

@router.post("/agents", response_model=UserRead)
async def create_agent(
    user_in: UserCreate,
    session: Annotated[AsyncSession, Depends(async_get_db)],
    current_admin: Annotated[User, Depends(get_current_admin)]
):
    # Check if user exists
    user = await crud_users.get_user_by_email(session, user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create agent
    new_agent = await crud_users.create_user(session, user_in, role=UserRole.AGENT)
    return new_agent

@router.get("/agents", response_model=List[UserRead])
async def read_agents(
    session: Annotated[AsyncSession, Depends(async_get_db)],
    current_admin: Annotated[User, Depends(get_current_admin)]
):
    agents = await crud_users.get_all_agents(session)
    return agents

@router.get("/properties", response_model=List[PropertyRead])
async def read_all_properties(
    session: Annotated[AsyncSession, Depends(async_get_db)],
    current_admin: Annotated[User, Depends(get_current_admin)],
    skip: int = 0,
    limit: int = 100,
):
    return await crud_property.get_multi(session, skip=skip, limit=limit)

@router.put("/agents/{agent_id}", response_model=UserRead)
async def update_agent(
    agent_id: int,
    user_in: UserUpdate,
    session: Annotated[AsyncSession, Depends(async_get_db)],
    current_admin: Annotated[User, Depends(get_current_admin)]
):
    agent = await crud_users.get_user_by_id(session, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    if agent.role != UserRole.AGENT:
         raise HTTPException(status_code=400, detail="User is not an agent")

    # If email changed, check for conflicts
    if user_in.email is not None and user_in.email != agent.email:
         existing_user = await crud_users.get_user_by_email(session, user_in.email)
         if existing_user:
             raise HTTPException(status_code=400, detail="Email already registered")

    updated_agent = await crud_users.update_user(session, agent, user_in)
    return updated_agent

@router.delete("/agents/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(
    agent_id: int,
    session: Annotated[AsyncSession, Depends(async_get_db)],
    current_admin: Annotated[User, Depends(get_current_admin)]
):
    agent = await crud_users.get_user_by_id(session, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
        
    if agent.role != UserRole.AGENT:
          raise HTTPException(status_code=400, detail="User is not an agent")
          
    await crud_users.delete_user(session, agent)
