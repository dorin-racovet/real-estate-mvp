# RealEstate Pro Backend Specification

**Version:** 1.0 | **Date:** January 14, 2026

---

## Tech Stack

- **Framework:** FastAPI (Python)
- **Database:** SQLite (MVP), PostgreSQL path
- **Auth:** JWT tokens
- **ORM:** SQLAlchemy

---

## API Endpoints

### Authentication
- POST /api/auth/login
  - Request: {email, password}
  - Response: {token, role, userId}
  - JWT 24hr, HS256

### Properties (Public)
- GET /api/properties - List published
  - Query: city, min_price, max_price, page, limit, sort
  - No auth required

- GET /api/properties/:id - Details
  - Returns: full property + images + agent contact
  - 404 if unpublished

### Properties (Agent Auth)
- POST /api/properties - Create
  - Multipart: fields + images (10 max, 10MB each)
  - Validation: price >= 0, beds/baths 0-10
  - Returns: draft status

- PUT /api/properties/:id - Update own
  - Agent ownership validated

- DELETE /api/properties/:id - Delete own
  - Cascades delete images

- GET /api/properties/my-listings - Agent properties
  - page, limit, sort, status params

### Properties (Admin Auth)
- GET /api/admin/properties - All properties
  - agent_id, status, city, search filters
  - 403 if not admin

- PUT /api/admin/properties/:id - Edit any
  - 403 if not admin

- DELETE /api/admin/properties/:id - Delete any
  - 403 if not admin

---

## Database Schema

### agents
- id, email (UNIQUE), password_hash (bcrypt), name, phone
- created_at, updated_at
- Index: email

### admins  
- id, email (UNIQUE), password_hash, name
- created_at, updated_at
- Index: email

### properties
- id, agent_id (FK), title, description
- price (DECIMAL), surface (DECIMAL), city, street, address
- type, bedrooms, bathrooms, status (draft|published)
- created_at, updated_at
- Indexes: agent_id, status, city, (status, agent_id)

### property_images
- id, property_id (FK CASCADE), image_url, thumbnail_url
- display_order, created_at
- Index: property_id

---

## Authentication & Security

### JWT Token
- Payload: {sub: "user:ID:role", user_id, role, iat, exp}
- 24-hour expiration, HS256
- Secret from environment

### Password
- Min 8 chars, Bcrypt (10 rounds), Never log

### Authorization
- Agent: Read/write own properties
- Admin: Read/write all properties
- Public: Read published only
- 401 Unauthorized, 403 Forbidden

### Headers
- CORS: FRONTEND_URL only
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Strict-Transport-Security

---

## File Uploads

### Directory Structure
/uploads/properties/:id/:filename
- 001.jpg (original), thumb_001.jpg (thumbnail)
- Max 10 files per property

### Validation
- Accept: JPG, PNG, WebP
- Max: 10MB per file, 10MB total
- MIME type check (magic bytes)

### Processing
- Pillow/PIL: Thumbnail 300x225px quality 85, original quality 80

---

## Error Handling

### Status Codes
- 200: OK, 201: Created, 204: No Content
- 400: Bad Request, 401: Unauthorized, 403: Forbidden
- 404: Not Found, 409: Conflict, 413: Payload Too Large
- 422: Unprocessable Entity, 429: Too Many Requests
- 500: Internal Error

### Response Format
```json
{
  "error": "Error type",
  "message": "User message",
  "status": 400,
  "timestamp": "ISO8601",
  "details": [{"field": "name", "message": "Required"}]
}
```

---

## Performance Targets

- Login: < 500ms
- List properties: < 200ms
- Property detail: < 150ms
- Create property: < 1000ms
- Update: < 1000ms, Delete: < 500ms

### Optimization
- Indexes on FK and filters
- Pagination required
- gzip compression
- Connection pooling: pool_size=10, max_overflow=20
- N+1 query prevention

---

## Logging & Monitoring

### Levels
- ERROR: Auth failures, DB errors, file failures
- WARNING: Rate limiting, invalid input
- INFO: API requests (method, path, status, duration)
- DEBUG: Queries, auth (dev only)

### Never Log
- Passwords, hashes, tokens, sensitive data, full file paths

### Monitor
- Response times by endpoint
- Error rates
- DB query performance
- Upload success rates
- Auth failures

---

## Deployment

### Environment Variables
```
ENVIRONMENT=production|development
DEBUG=false
SECRET_KEY=<32+ chars>
DATABASE_URL=sqlite:///./app.db
FRONTEND_URL=https://example.com
UPLOAD_DIR=/var/uploads
MAX_UPLOAD_SIZE=10485760
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

### Database
- Alembic migrations
- alembic revision --autogenerate
- alembic upgrade head

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Testing

### Unit Tests (>80% coverage)
- Authentication (valid/invalid/expired)
- CRUD operations
- Authorization by role
- Image processing
- Error codes

### Integration Tests
- Agent: login → create → publish → browse
- Public: filters (city, price)
- Admin: edit/delete any property
- Image uploads (valid/invalid)

### Load Testing
- JMeter/locust
- 50 concurrent browsers, 20 agents creating, Admin filtering 1000+
- Target: < 2 second response

---

## Phase 2+ Enhancements

- PostgreSQL migration
- AWS S3 storage
- Redis caching
- Celery async tasks
- Elasticsearch search
- GraphQL
- User accounts with favorites sync
- Email notifications
- Admin analytics

---

**Status:** ✅ COMPLETE - READY FOR STORY REFINEMENT
