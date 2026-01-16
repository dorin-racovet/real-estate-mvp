import pytest
from app.core.security import get_password_hash
from app.models.user import User, UserRole

# Helper to create a user
async def create_user(db_session, email, password, role=UserRole.AGENT):
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
async def test_login_success(client, db_session):
    email = "test@example.com"
    password = "password123"
    await create_user(db_session, email, password)

    response = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": password
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_invalid_password(client, db_session):
    email = "wrong@example.com"
    password = "password123"
    await create_user(db_session, email, password)

    response = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "wrongpassword"
    })
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

@pytest.mark.asyncio
async def test_get_me_success(client, db_session):
    # 1. Login
    email = "me@example.com"
    password = "password123"
    await create_user(db_session, email, password)
    
    login_res = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": password
    })
    token = login_res.json()["access_token"]
    
    # 2. Get Me
    response = await client.get("/api/v1/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["email"] == email
    assert user_data["role"] == "agent"

@pytest.mark.asyncio
async def test_get_me_unauthorized(client):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401