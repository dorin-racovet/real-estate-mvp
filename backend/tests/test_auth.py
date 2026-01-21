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

@pytest.mark.asyncio
async def test_rate_limiting_blocks_after_5_failed_attempts(client, db_session):
    """Test that rate limiting blocks after 5 failed login attempts."""
    from app.core.rate_limit import login_rate_limiter
    
    # Create a user
    email = "ratelimit@example.com"
    password = "password123"
    await create_user(db_session, email, password)
    
    # Reset rate limiter for this email
    await login_rate_limiter.reset_attempts(email)
    
    # Make 5 failed login attempts
    for i in range(5):
        response = await client.post("/api/v1/auth/login", json={
            "email": email,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
    
    # 6th attempt should be rate limited
    response = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "wrongpassword"
    })
    assert response.status_code == 429
    assert "too many" in response.json()["detail"].lower()
    
    # Even correct password should be blocked
    response = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": password
    })
    assert response.status_code == 429

@pytest.mark.asyncio
async def test_rate_limiting_resets_on_successful_login(client, db_session):
    """Test that rate limiting resets after successful login."""
    from app.core.rate_limit import login_rate_limiter
    
    # Create a user
    email = "reset@example.com"
    password = "password123"
    await create_user(db_session, email, password)
    
    # Reset rate limiter for this email
    await login_rate_limiter.reset_attempts(email)
    
    # Make 3 failed attempts
    for i in range(3):
        await client.post("/api/v1/auth/login", json={
            "email": email,
            "password": "wrongpassword"
        })
    
    # Verify attempts recorded
    count = await login_rate_limiter.get_attempt_count(email)
    assert count == 3
    
    # Successful login should reset
    response = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": password
    })
    assert response.status_code == 200
    
    # Verify attempts reset
    count = await login_rate_limiter.get_attempt_count(email)
    assert count == 0

@pytest.mark.asyncio
async def test_rate_limiting_oauth2_endpoint(client, db_session):
    """Test that rate limiting applies to OAuth2 access-token endpoint."""
    from app.core.rate_limit import login_rate_limiter
    
    # Create a user
    email = "oauth@example.com"
    password = "password123"
    await create_user(db_session, email, password)
    
    # Reset rate limiter
    await login_rate_limiter.reset_attempts(email)
    
    # Make 5 failed attempts using OAuth2 endpoint
    for i in range(5):
        response = await client.post("/api/v1/auth/access-token", data={
            "username": email,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
    
    # 6th attempt should be rate limited
    response = await client.post("/api/v1/auth/access-token", data={
        "username": email,
        "password": "wrongpassword"
    })
    assert response.status_code == 429