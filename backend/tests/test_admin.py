import pytest
from app.models.user import User, UserRole
from app.core.security import get_password_hash

# Helper
async def create_user(db_session, email, password, role):
    user = User(
        email=email,
        password_hash=get_password_hash(password),
        name="Test User",
        role=role
    )
    db_session.add(user)
    await db_session.commit()
    return user

@pytest.mark.asyncio
async def test_create_agent_success(client, db_session):
    # 1. Login as Admin
    admin_email = "admin@test.com"
    await create_user(db_session, admin_email, "admin123", UserRole.ADMIN)
    
    login_res = await client.post("/api/v1/auth/login", json={
        "email": admin_email,
        "password": "admin123"
    })
    token = login_res.json()["access_token"]
    
    # 2. Create Agent
    new_agent_data = {
        "email": "agent@test.com",
        "password": "agent123",
        "name": "James Agent",
        "phone": "1234567890"
    }
    
    response = await client.post("/api/v1/admin/agents", json=new_agent_data, headers={
        "Authorization": f"Bearer {token}"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == new_agent_data["email"]
    assert data["role"] == "agent"
    assert "id" in data

@pytest.mark.asyncio
async def test_create_agent_forbidden_as_agent(client, db_session):
    # 1. Login as Agent
    agent_email = "existing_agent@test.com"
    await create_user(db_session, agent_email, "agent123", UserRole.AGENT)
    
    login_res = await client.post("/api/v1/auth/login", json={
        "email": agent_email,
        "password": "agent123"
    })
    token = login_res.json()["access_token"]
    
    # 2. Try to Create Agent
    new_agent_data = {
        "email": "agent2@test.com",
        "password": "agent123",
        "name": "James Agent",
        "phone": "1234567890"
    }
    
    response = await client.post("/api/v1/admin/agents", json=new_agent_data, headers={
        "Authorization": f"Bearer {token}"
    })
    
    assert response.status_code == 403

@pytest.mark.asyncio
async def test_get_agents(client, db_session):
    # 1. Login as Admin
    admin_email = "admin2@test.com"
    await create_user(db_session, admin_email, "admin123", UserRole.ADMIN)
    
    login_res = await client.post("/api/v1/auth/login", json={
        "email": admin_email,
        "password": "admin123"
    })
    token = login_res.json()["access_token"]
    
    # 2. Create some agents manually
    await create_user(db_session, "agent_a@test.com", "123", UserRole.AGENT)
    await create_user(db_session, "agent_b@test.com", "123", UserRole.AGENT)
    
    # 3. Get Agents
    response = await client.get("/api/v1/admin/agents", headers={
        "Authorization": f"Bearer {token}"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    # Ensure all are agents
    for agent in data:
        assert agent["role"] == "agent"