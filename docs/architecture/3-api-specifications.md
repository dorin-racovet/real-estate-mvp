# 3. API Specifications

## 3.1 Authentication Endpoints

### POST /api/v1/auth/login
```yaml
Summary: User login
Auth: None
Request Body:
  - email: string (required)
  - password: string (required)
Response 200:
  - access_token: string
  - token_type: "bearer"
Response 401:
  - detail: "Invalid credentials"
```

### GET /api/v1/auth/me
```yaml
Summary: Get current user
Auth: JWT Bearer Token
Response 200: UserRead schema
Response 401: Unauthorized
```

## 3.2 Property Endpoints (Agent)

### POST /api/v1/properties
```yaml
Summary: Create property
Auth: Agent or Admin
Request Body: PropertyCreate schema
Response 201: PropertyRead schema
Response 400: Validation errors
Response 401: Unauthorized
```

### GET /api/v1/properties/mine
```yaml
Summary: Get agent's own properties
Auth: Agent
Query Params:
  - status: string (optional) - "draft" | "published"
  - sort: string (optional) - "created_at" | "price"
Response 200: List[PropertyRead]
```

### PUT /api/v1/properties/{id}
```yaml
Summary: Update property
Auth: Owner or Admin
Path Params:
  - id: integer
Request Body: PropertyUpdate schema
Response 200: PropertyRead schema
Response 403: Not owner
Response 404: Not found
```

### PATCH /api/v1/properties/{id}/status
```yaml
Summary: Update property status
Auth: Owner or Admin
Path Params:
  - id: integer
Request Body:
  - status: "draft" | "published"
Response 200: PropertyRead schema
```

### POST /api/v1/properties/{id}/images
```yaml
Summary: Upload property images
Auth: Owner or Admin
Path Params:
  - id: integer
Request Body: multipart/form-data
  - files: List[UploadFile] (max 10 files, max 10MB each)
Response 200: PropertyRead schema (with updated images)
Response 400: Invalid file type/size
```

### DELETE /api/v1/properties/{id}/images/{filename}
```yaml
Summary: Delete property image
Auth: Owner or Admin
Path Params:
  - id: integer
  - filename: string
Response 200: PropertyRead schema
Response 404: Image not found
```

## 3.3 Admin Endpoints

### POST /api/v1/admin/agents
```yaml
Summary: Create agent account
Auth: Admin only
Request Body: UserCreate schema
Response 201: UserRead schema
Response 400: Email already exists
Response 403: Not admin
```

### GET /api/v1/admin/agents
```yaml
Summary: List all agents
Auth: Admin only
Response 200: List[UserRead]
```

### GET /api/v1/admin/properties
```yaml
Summary: Get all properties (paginated)
Auth: Admin only
Query Params:
  - page: integer (default: 1)
  - limit: integer (default: 20)
  - status: string (optional)
  - agent_id: integer (optional)
  - city: string (optional)
  - sort: string (optional) - "created_at" | "price" | "agent_name"
Response 200:
  - data: List[PropertyReadWithAgent]
  - total: integer
  - page: integer
  - limit: integer
```

## 3.4 Public Endpoints

### GET /api/v1/public/properties
```yaml
Summary: Get published properties
Auth: None
Query Params:
  - page: integer (default: 1)
  - limit: integer (default: 12)
  - city: string (optional)
  - sort: string (optional) - "price_asc" | "price_desc" | "newest"
Response 200:
  - data: List[PropertyPublicRead]
  - total: integer
  - page: integer
  - limit: integer
```

### GET /api/v1/public/properties/{id}
```yaml
Summary: Get property detail
Auth: None
Path Params:
  - id: integer
Response 200: PropertyDetailRead (includes agent contact info)
Response 404: Not found or not published
```

## 3.5 Health Endpoint

### GET /api/v1/health
```yaml
Summary: Health check
Auth: None
Response 200:
  - status: "ok"
  - timestamp: string (ISO format)
```

---
