# 4. Technical Assumptions

## 4.1 Repository Structure

**Monorepo** with the following structure:
```
/
├── backend/          # FastAPI application
├── frontend/         # React application
├── docs/            # Documentation
└── README.md
```

**Rationale:** Simplifies development workflow for MVP, single PR for full-stack changes, easier local development setup.

## 4.2 Service Architecture

**Two-tier monolith:**
- Frontend: React SPA served statically
- Backend: FastAPI serving REST API + static files (images)
- Database: SQLite file

**Rationale:** Minimal infrastructure complexity for 1-week MVP. Clear separation of concerns while avoiding microservices overhead.

## 4.3 Testing Requirements

**Unit + Integration testing:**
- Backend: pytest for API endpoint testing
- Frontend: Jest + React Testing Library for component tests
- Manual testing: Core user flows before deployment

**Rationale:** Balance between quality assurance and timeline constraints. Focus testing on critical paths (auth, property CRUD, public display).

## 4.4 Additional Technical Assumptions

- **Frontend Framework:** React 18+ with TypeScript
- **Frontend Routing:** React Router v6
- **Frontend Styling:** Tailwind CSS
- **Frontend State:** React Context API (no Redux)
- **Frontend HTTP:** Axios
- **Backend Framework:** FastAPI (Python 3.11+)
- **Backend ORM:** SQLAlchemy 2.0
- **Backend Validation:** Pydantic v2
- **Backend Auth:** python-jose for JWT, passlib[bcrypt] for passwords
- **Database:** SQLite for MVP (aiosqlite for async)
- **Image Storage:** Local filesystem (`/backend/uploads/`)
- **CORS:** Configured for frontend origin
- **API Documentation:** Auto-generated OpenAPI/Swagger via FastAPI

---
