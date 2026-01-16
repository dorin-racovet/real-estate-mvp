import pytest
from app.models.user import User, UserRole
from app.models.property import Property, PropertyStatus, PropertyType
from app.core.security import get_password_hash

async def create_user(db_session, email, password, role):
    user = User(
        email=email,
        password_hash=get_password_hash(password),
        name=f"Test {role}",
        role=role
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user

async def create_property(db_session, agent_id, status):
    prop = Property(
        title=f"Test Property {status}",
        price=100000,
        surface=100,
        city="Test City",
        street="Test Street",
        property_type=PropertyType.APARTMENT,
        description="Test Desc",
        agent_id=agent_id,
        status=status
    )
    db_session.add(prop)
    await db_session.commit()
    await db_session.refresh(prop)
    return prop

@pytest.mark.asyncio
async def test_public_details_logic(client, db_session):
    # Setup: Create Agent
    agent = await create_user(db_session, "agent@test.com", "pass", UserRole.AGENT)
    
    # Setup: Create Published Property
    pub_prop = await create_property(db_session, agent.id, PropertyStatus.PUBLISHED)
    
    # Setup: Create Draft Property
    draft_prop = await create_property(db_session, agent.id, PropertyStatus.DRAFT)
    
    # 1. Public Access to PUBLISHED -> 200
    res = await client.get(f"/api/v1/properties/{pub_prop.id}")
    assert res.status_code == 200, "Public should see published property"
    assert res.json()["title"] == pub_prop.title

    # 2. Public Access to DRAFT -> 404 (Security check)
    res = await client.get(f"/api/v1/properties/{draft_prop.id}")
    assert res.status_code == 404, "Public should NOT see draft property"

    # 3. Owner Access to DRAFT -> 200
    # Login
    login_res = await client.post("/api/v1/auth/login", json={"email": "agent@test.com", "password": "pass"})
    token = login_res.json()["access_token"]
    
    res = await client.get(f"/api/v1/properties/{draft_prop.id}", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200, "Owner should see draft"

    # 4. Other Agent Access to DRAFT -> 404
    other_agent = await create_user(db_session, "other@test.com", "pass", UserRole.AGENT)
    login_res2 = await client.post("/api/v1/auth/login", json={"email": "other@test.com", "password": "pass"})
    token2 = login_res2.json()["access_token"]
    
    res = await client.get(f"/api/v1/properties/{draft_prop.id}", headers={"Authorization": f"Bearer {token2}"})
    assert res.status_code == 404, "Other agent should NOT see draft"
