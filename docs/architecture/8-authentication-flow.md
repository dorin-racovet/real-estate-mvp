# 8. Authentication Flow

## 8.1 Sequence Diagram

```
┌────────┐     ┌────────────┐     ┌────────────┐     ┌──────────┐
│Frontend│     │  Backend   │     │  Security  │     │ Database │
└───┬────┘     └─────┬──────┘     └─────┬──────┘     └────┬─────┘
    │                │                  │                  │
    │ POST /auth/login                  │                  │
    │ {email, password}                 │                  │
    │───────────────>│                  │                  │
    │                │ get_by_email()   │                  │
    │                │──────────────────│─────────────────>│
    │                │                  │      User        │
    │                │<─────────────────│──────────────────│
    │                │                  │                  │
    │                │ verify_password()│                  │
    │                │─────────────────>│                  │
    │                │     True/False   │                  │
    │                │<─────────────────│                  │
    │                │                  │                  │
    │                │ create_access_token()               │
    │                │─────────────────>│                  │
    │                │     JWT Token    │                  │
    │                │<─────────────────│                  │
    │                │                  │                  │
    │ 200 {access_token, token_type}    │                  │
    │<───────────────│                  │                  │
    │                │                  │                  │
    │ Store in localStorage             │                  │
    │────────────────>                  │                  │
    │                │                  │                  │
    │ GET /properties/mine              │                  │
    │ Authorization: Bearer <token>     │                  │
    │───────────────>│                  │                  │
    │                │ verify_token()   │                  │
    │                │─────────────────>│                  │
    │                │   TokenData      │                  │
    │                │<─────────────────│                  │
    │                │                  │                  │
    │                │ get_current_user()                  │
    │                │──────────────────│─────────────────>│
    │                │                  │      User        │
    │                │<─────────────────│──────────────────│
    │                │                  │                  │
    │ 200 [properties]                  │                  │
    │<───────────────│                  │                  │
```

## 8.2 JWT Token Structure

```json
{
  "sub": "1",
  "email": "agent@realestate.pro",
  "role": "agent",
  "exp": 1736726400
}
```

## 8.3 Security Implementation (`app/core/security.py`)

```python
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from jose import JWTError, jwt
from pydantic import SecretStr

from app.core.config import settings

SECRET_KEY: SecretStr = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY.get_secret_value(), algorithm=ALGORITHM)


def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY.get_secret_value(), algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

## 8.4 Dependencies (`app/api/dependencies.py`)

```python
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.database import async_get_db
from app.core.security import verify_token
from app.crud.crud_users import crud_users
from app.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id = int(payload.get("sub"))
    user = await crud_users.get(db, id=user_id)
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_admin(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


async def get_current_agent(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    if current_user.role not in [UserRole.AGENT, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agent access required"
        )
    return current_user
```

---
