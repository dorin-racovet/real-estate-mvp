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
async def test_create_property_success(client, db_session):
    # 1. Login as Agent
    email = "agent_prop@test.com"
    await create_user(db_session, email, "123", UserRole.AGENT)
    
    login_res = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "123"
    })
    token = login_res.json()["access_token"]
    
    # 2. Create Property
    new_prop = {
        "title": "Luxury Villa",
        "price": 1200000.00,
        "surface": 350.5,
        "city": "Beverly Hills",
        "street": "Palm Dr",
        "property_type": "house",
        "bedrooms": 5,
        "bathrooms": 4,
        "description": "Amazing place"
    }
    
    response = await client.post("/api/v1/properties", json=new_prop, headers={
        "Authorization": f"Bearer {token}"
    })
    
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == new_prop["title"]
    assert data["status"] == "draft"
    assert "id" in data
    assert data["images"] == []
