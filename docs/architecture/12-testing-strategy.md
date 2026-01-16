# 12. Testing Strategy

## 12.1 Backend Tests

```
tests/
├── conftest.py              # Fixtures: test DB, client, auth
├── test_auth.py             # Auth endpoint tests
├── test_properties.py       # Property CRUD tests
├── test_admin.py            # Admin endpoint tests
└── test_public.py           # Public endpoint tests
```

**Example Test (`tests/test_auth.py`):**
```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, test_agent):
    response = await client.post("/api/v1/auth/login", data={
        "username": test_agent.email,
        "password": "testpassword"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient):
    response = await client.post("/api/v1/auth/login", data={
        "username": "wrong@email.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
```

## 12.2 Frontend Tests

```
src/
├── components/
│   └── property/
│       └── PropertyCard.test.tsx
├── pages/
│   └── auth/
│       └── LoginPage.test.tsx
└── setupTests.ts
```

---
