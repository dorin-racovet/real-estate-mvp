# 1. System Overview

## 1.1 High-Level Architecture

RealEstate Pro is a two-tier monolithic web application following a layered architecture pattern inspired by the [benavlabs/FastAPI-boilerplate](https://github.com/benavlabs/FastAPI-boilerplate).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React SPA)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Public    │  │    Agent    │  │    Admin    │  │  Shared Components  │ │
│  │   Views     │  │  Dashboard  │  │   Panel     │  │  (Layout, Auth)     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │ HTTP/REST (JSON)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (FastAPI)                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         API Layer (api/v1/)                          │   │
│  │   auth.py │ properties.py │ admin.py │ public.py │ health.py         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         CRUD Layer (crud/)                           │   │
│  │   crud_users.py │ crud_properties.py                                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                       Schemas Layer (schemas/)                       │   │
│  │   user.py │ property.py │ auth.py                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                       Models Layer (models/)                         │   │
│  │   user.py │ property.py                                              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                       Core Layer (core/)                             │   │
│  │   config.py │ security.py │ db/database.py │ exceptions.py           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │ SQLAlchemy 2.0 (async)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE (SQLite)                                  │
│                          data/realestate.db                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          FILE STORAGE (Local)                               │
│                           uploads/{property_id}/                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 1.2 Design Principles

Following the FastAPI boilerplate patterns:

1. **Layered Architecture**: Request flows through API → CRUD → Models → Database
2. **Single Responsibility**: Each module has one clear purpose
3. **Dependency Injection**: Database sessions and auth via FastAPI Depends
4. **Schema-Driven Validation**: Pydantic schemas for all input/output
5. **Async-First**: Full async/await support throughout

## 1.3 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend Framework | React | 18.x |
| Frontend Language | TypeScript | 5.x |
| Frontend Styling | Tailwind CSS | 3.x |
| Frontend Routing | React Router | 6.x |
| Frontend HTTP | Axios | 1.x |
| Backend Framework | FastAPI | 0.109+ |
| Backend Language | Python | 3.11+ |
| ORM | SQLAlchemy | 2.0 |
| Validation | Pydantic | 2.x |
| Database | SQLite | 3.x |
| Auth | python-jose (JWT) + passlib[bcrypt] | - |

---
