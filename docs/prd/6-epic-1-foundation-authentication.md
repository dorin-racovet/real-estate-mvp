# 6. Epic 1: Foundation & Authentication

**Goal:** Establish the project infrastructure with working authentication, basic database models, and the ability for agents to create their first property. By the end of this epic, an admin can create agent accounts, agents can log in and create a property with images, and the API is documented and testable.

---

## Story 1.1: Project Setup and Configuration

**As a** developer,  
**I want** a properly configured monorepo with backend and frontend scaffolding,  
**so that** development can begin with consistent tooling and structure.

**Acceptance Criteria:**
1. Monorepo structure created with `/backend`, `/frontend`, `/docs` folders
2. Backend: FastAPI project initialized with Python 3.11+, virtual environment, requirements.txt
3. Frontend: React 18 + TypeScript project created with Vite
4. Tailwind CSS configured in frontend
5. ESLint and Prettier configured for frontend
6. Backend runs on port 8000, frontend on port 5173
7. README.md with setup instructions for both services
8. .gitignore configured for Python and Node artifacts
9. Basic health check endpoint (`GET /api/health`) returns `{"status": "ok"}`
10. Frontend displays "RealEstate Pro" placeholder page

---

## Story 1.2: Database Models and Configuration

**As a** developer,  
**I want** SQLAlchemy models for User and Property entities,  
**so that** the application has a data persistence layer.

**Acceptance Criteria:**
1. SQLAlchemy 2.0 configured with SQLite database
2. User model with fields: id, email (unique), password_hash, name, phone, role (enum: agent/admin), created_at
3. Property model with fields: id, title, price, surface, city, street, address, property_type, bedrooms, bathrooms, description, images (JSON array), status (enum: draft/published), agent_id (FK), created_at, updated_at
4. Database migrations strategy documented (Alembic optional for MVP)
5. Database file created at `backend/data/realestate.db`
6. Seed script creates initial admin user (email: admin@realestate.pro, password: admin123)
7. Models include proper relationships (User has many Properties)

---

## Story 1.3: Authentication System

**As an** agent or admin,  
**I want** to log in with email and password,  
**so that** I can access protected features.

**Acceptance Criteria:**
1. `POST /api/auth/login` accepts email and password, returns JWT token
2. JWT token includes user_id, email, role, and expiration (24h)
3. Passwords verified using bcrypt
4. Invalid credentials return 401 with error message
5. `GET /api/auth/me` returns current user info (requires valid token)
6. Protected routes return 401 if no token or invalid token
7. Token refresh not required for MVP (24h expiry sufficient)
8. CORS configured to allow frontend origin

---

## Story 1.4: Agent Registration by Admin

**As an** admin,  
**I want** to create agent accounts,  
**so that** agents can access the platform.

**Acceptance Criteria:**
1. `POST /api/admin/agents` creates new agent user (admin only)
2. Request body: email, password, name, phone (optional)
3. Email uniqueness enforced, returns 400 if duplicate
4. Password hashed before storage
5. Returns created agent (without password_hash)
6. `GET /api/admin/agents` lists all agents (admin only)
7. Non-admin requests return 403 Forbidden

---

## Story 1.5: Property Creation API

**As an** agent,  
**I want** to create a property listing via API,  
**so that** I can add properties to the platform.

**Acceptance Criteria:**
1. `POST /api/properties` creates property (agent/admin only)
2. Required fields: title, price, surface, city, property_type
3. Optional fields: street, address, bedrooms, bathrooms, description
4. Property automatically assigned to authenticated agent
5. Initial status is "draft"
6. Returns created property with generated ID
7. Validation errors return 400 with field-specific messages
8. Property types: house, apartment, condo, land, commercial

---

## Story 1.6: Image Upload for Properties

**As an** agent,  
**I want** to upload images for my property,  
**so that** buyers can see photos of the listing.

**Acceptance Criteria:**
1. `POST /api/properties/{id}/images` uploads images (multipart/form-data)
2. Accepts multiple files in single request (up to 10)
3. Validates file types: jpg, jpeg, png, webp
4. Validates file size: max 10MB per file
5. Images saved to `backend/uploads/{property_id}/`
6. Property images array updated with file paths
7. Only property owner or admin can upload
8. `GET /api/uploads/{property_id}/{filename}` serves images
9. Returns updated property with image URLs

---

## Story 1.7: Frontend Authentication Flow

**As an** agent,  
**I want** to log in via the web interface,  
**so that** I can access my dashboard.

**Acceptance Criteria:**
1. Login page at `/login` with email and password fields
2. Form validation: required fields, email format
3. Submit calls `POST /api/auth/login`
4. Success: stores JWT in localStorage, redirects to dashboard
5. Failure: displays error message
6. Auth context provides current user to all components
7. Protected routes redirect to login if not authenticated
8. Logout clears token and redirects to home

---

## Story 1.8: Agent Property Creation Form

**As an** agent,  
**I want** to create a property through a web form,  
**so that** I can list properties without using the API directly.

**Acceptance Criteria:**
1. Agent dashboard at `/dashboard` (protected route)
2. Property creation form with all fields (title, price, surface, city, street, address, property_type dropdown, bedrooms, bathrooms, description)
3. Image upload with drag-and-drop and file picker
4. Image preview before submission
5. Form validation with inline error messages
6. "Save as Draft" button saves with status=draft
7. "Publish" button saves with status=published
8. Success: shows confirmation, clears form
9. Failure: displays error message, preserves form data

---
