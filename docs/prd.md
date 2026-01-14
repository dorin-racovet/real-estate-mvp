# RealEstate Pro - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** January 12, 2026  
**Author:** John (Product Manager) 📋  
**Status:** Draft

---

## 1. Goals and Background Context

### 1.1 Goals

- Deliver a fully functional real estate listing MVP within 1 week
- Enable agents to create, manage, and publish property listings with images
- Provide property seekers a frictionless browsing experience without registration
- Demonstrate clear role separation (Agent, Admin, Public)
- Validate the BMAD method for AI-assisted rapid development
- Establish foundation for future enhancements (Phase 2+)

### 1.2 Background Context

RealEstate Pro addresses the gap between complex, expensive MLS systems and overly simple DIY solutions. Independent real estate agents and small agencies need a lightweight platform to manage property listings without the overhead of enterprise systems. Simultaneously, property seekers demand frictionless browsing without forced account creation.

This MVP serves dual purposes: delivering a functional product and proving that the BMAD methodology can produce working software in a compressed timeline. The platform's role-based architecture (Agent → Admin → Public) establishes clear boundaries while maintaining simplicity.

### 1.3 Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-01-12 | 1.0 | Initial PRD creation | PM Agent |

---

## 2. Requirements

### 2.1 Functional Requirements

**Authentication & Authorization**
- FR1: The system shall provide JWT-based authentication for agents and admins
- FR2: The system shall enforce role-based access control (agent, admin roles)
- FR3: Agents shall only access and modify their own properties
- FR4: Admins shall have read/write access to all properties
- FR5: Public users shall browse without authentication

**Property Management**
- FR6: Agents shall create properties with: title, price, surface, location (city, street, address), property type, bedrooms, bathrooms, description
- FR7: Agents shall upload multiple images per property (up to 10 images, max 10MB each)
- FR8: Properties shall have draft/published status controlled by the owning agent
- FR9: Agents shall view a table of their own properties with status indicators
- FR10: Agents shall edit and update their own properties
- FR11: Admins shall view a paginated table of all properties from all agents
- FR12: Admins shall edit any property regardless of ownership

**Public Listings**
- FR13: The public listings page shall display published properties in a card grid layout
- FR14: The listings page shall include a hero section with featured imagery
- FR15: Users shall filter listings by price (sort low-to-high, high-to-low)
- FR16: Users shall filter listings by location (city)
- FR17: Each property card shall display: thumbnail image, title, price, location, bedrooms, bathrooms
- FR18: Users shall click a property card to view the full detail page

**Property Detail Page**
- FR19: The detail page shall display all property information
- FR20: The detail page shall include a photo gallery with all uploaded images
- FR21: The detail page shall display agent contact information (name, email, phone)

**Favorites**
- FR22: Users shall add/remove properties from favorites via heart icon
- FR23: Favorites shall persist in browser localStorage (no login required)
- FR24: Users shall access a dedicated Favorites page showing saved properties
- FR25: Favorites page shall indicate if a favorited property is no longer available

### 2.2 Non-Functional Requirements

- NFR1: Page load time shall be under 2 seconds for listings page
- NFR2: The application shall support 50 concurrent users minimum
- NFR3: All API endpoints shall return responses within 500ms under normal load
- NFR4: The application shall be responsive across desktop and mobile browsers
- NFR5: Passwords shall be hashed using bcrypt with appropriate salt rounds
- NFR6: JWT tokens shall expire after 24 hours
- NFR7: The system shall use SQLite for MVP (with documented PostgreSQL migration path)
- NFR8: All forms shall provide client-side validation with clear error messages
- NFR9: The application shall work on modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- NFR10: Image uploads shall be validated for file type (jpg, png, webp) and size

---

## 3. User Interface Design Goals

### 3.1 Overall UX Vision

Clean, modern, and professional interface that instills trust in property seekers while providing agents with an efficient workflow. The design should feel lightweight and fast, avoiding the cluttered appearance of traditional real estate portals. Emphasis on property imagery and essential information.

### 3.2 Key Interaction Paradigms

- **Card-based browsing**: Properties displayed as visual cards with key info at a glance
- **Progressive disclosure**: Summary on cards, full details on dedicated pages
- **Inline actions**: Favorite heart icon directly on cards without page navigation
- **Form-centric agent experience**: Dashboard prioritizes property creation form
- **Table-based management**: Agents and admins manage listings via sortable tables

### 3.3 Core Screens and Views

**Public Views:**
1. **Home/Listings Page** - Hero section + filterable property grid
2. **Property Detail Page** - Photo gallery + full details + agent contact
3. **Favorites Page** - Grid of saved properties

**Agent Views:**
4. **Login Page** - Email/password authentication
5. **Agent Dashboard** - Property creation form + own listings table
6. **Property Edit Page** - Pre-filled form for editing existing property

**Admin Views:**
7. **Admin Dashboard** - All properties table with pagination
8. **Property Edit Page** - Same as agent but for any property

### 3.4 Accessibility

**Level:** WCAG AA compliance target

- Sufficient color contrast ratios
- Keyboard navigation support
- Alt text for all property images
- Form labels and error announcements
- Focus indicators on interactive elements

### 3.5 Branding

- **Style:** Modern, clean, professional
- **Colors:** To be defined (suggest neutral palette with accent color for CTAs)
- **Typography:** System fonts for performance, clear hierarchy
- **Imagery:** Property photos are the hero; UI should not compete

### 3.6 Target Platforms

**Web Responsive** - Desktop-first design with mobile breakpoints

- Desktop: Full feature set, multi-column layouts
- Tablet: Adapted grid layouts, touch-friendly targets
- Mobile: Single-column, hamburger menu, optimized image loading

---

## 4. Technical Assumptions

### 4.1 Repository Structure

**Monorepo** with the following structure:
```
/
├── backend/          # FastAPI application
├── frontend/         # React application
├── docs/            # Documentation
└── README.md
```

**Rationale:** Simplifies development workflow for MVP, single PR for full-stack changes, easier local development setup.

### 4.2 Service Architecture

**Two-tier monolith:**
- Frontend: React SPA served statically
- Backend: FastAPI serving REST API + static files (images)
- Database: SQLite file

**Rationale:** Minimal infrastructure complexity for 1-week MVP. Clear separation of concerns while avoiding microservices overhead.

### 4.3 Testing Requirements

**Unit + Integration testing:**
- Backend: pytest for API endpoint testing
- Frontend: Jest + React Testing Library for component tests
- Manual testing: Core user flows before deployment

**Rationale:** Balance between quality assurance and timeline constraints. Focus testing on critical paths (auth, property CRUD, public display).

### 4.4 Additional Technical Assumptions

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

## 5. Epic List

Based on the PRD requirements and 1-week timeline, I recommend **3 Epics**:

| Epic | Title | Goal |
|------|-------|------|
| **Epic 1** | Foundation & Authentication | Establish project infrastructure, implement auth system, and deliver basic agent property creation |
| **Epic 2** | Property Management & Admin | Complete agent dashboard with listings management and admin oversight capabilities |
| **Epic 3** | Public Experience & Polish | Deliver public listings, detail pages, favorites, and final polish |

**Rationale for 3 Epics:**
- Each epic delivers deployable, testable functionality
- Epic 1 establishes foundation + delivers first user value (agents can create properties)
- Epic 2 completes the "backend" user journeys (agent management + admin)
- Epic 3 delivers the "frontend" public experience
- Cross-cutting concerns (error handling, validation) are woven into each epic

---

## 6. Epic 1: Foundation & Authentication

**Goal:** Establish the project infrastructure with working authentication, basic database models, and the ability for agents to create their first property. By the end of this epic, an admin can create agent accounts, agents can log in and create a property with images, and the API is documented and testable.

---

### Story 1.1: Project Setup and Configuration

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

### Story 1.2: Database Models and Configuration

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

### Story 1.3: Authentication System

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

### Story 1.4: Agent Registration by Admin

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

### Story 1.5: Property Creation API

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

### Story 1.6: Image Upload for Properties

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

### Story 1.7: Frontend Authentication Flow

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

### Story 1.8: Agent Property Creation Form

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

## 7. Epic 2: Property Management & Admin

**Goal:** Complete the agent experience with property listing management (view, edit, status changes) and deliver admin oversight capabilities. By the end of this epic, agents can fully manage their portfolios and admins can oversee all listings.

---

### Story 2.1: Agent Properties List API

**As an** agent,  
**I want** to retrieve my property listings,  
**so that** I can see what I've created.

**Acceptance Criteria:**
1. `GET /api/properties/mine` returns agent's own properties
2. Returns array with all property fields including images
3. Supports query params: status (draft/published), sort (created_at, price)
4. Ordered by created_at descending by default
5. Only returns properties where agent_id matches authenticated user
6. Empty array if agent has no properties

---

### Story 2.2: Property Update and Status Management

**As an** agent,  
**I want** to edit my properties and change their status,  
**so that** I can update listings and control visibility.

**Acceptance Criteria:**
1. `PUT /api/properties/{id}` updates property fields
2. `PATCH /api/properties/{id}/status` updates only status (draft/published)
3. Only owner can update (except admin)
4. 404 if property not found
5. 403 if not owner and not admin
6. Updated_at timestamp refreshed on changes
7. Partial updates supported (only changed fields required)

---

### Story 2.3: Property Image Management

**As an** agent,  
**I want** to manage images on my properties,  
**so that** I can add, remove, or reorder photos.

**Acceptance Criteria:**
1. `DELETE /api/properties/{id}/images/{filename}` removes image
2. File deleted from filesystem
3. Property images array updated
4. `PUT /api/properties/{id}/images/order` reorders images (accepts array of filenames)
5. Only owner or admin can manage images
6. Returns updated property after changes

---

### Story 2.4: Agent Dashboard Properties Table

**As an** agent,  
**I want** to see a table of my properties on the dashboard,  
**so that** I can manage my listings.

**Acceptance Criteria:**
1. Dashboard displays table below creation form
2. Table columns: Thumbnail, Title, Price, City, Status, Actions
3. Status shown as badge (Draft=yellow, Published=green)
4. Actions: Edit, Toggle Status, Delete
5. Toggle status switches draft↔published with confirmation
6. Delete removes property with confirmation dialog
7. Table updates after any action without page reload
8. Empty state message if no properties

---

### Story 2.5: Agent Property Edit Page

**As an** agent,  
**I want** to edit an existing property,  
**so that** I can update listing details.

**Acceptance Criteria:**
1. Edit page at `/dashboard/properties/{id}/edit`
2. Form pre-populated with existing property data
3. Existing images displayed with remove option
4. Add new images to existing set
5. Save updates property via PUT API
6. Cancel returns to dashboard
7. 404 page if property not found or not owned
8. Success: shows confirmation, returns to dashboard

---

### Story 2.6: Admin Properties API

**As an** admin,  
**I want** to view and manage all properties,  
**so that** I can oversee the platform.

**Acceptance Criteria:**
1. `GET /api/admin/properties` returns all properties (admin only)
2. Includes agent info (name, email) for each property
3. Supports pagination: page, limit params (default limit=20)
4. Supports filters: status, agent_id, city
5. Supports sort: created_at, price, agent_name
6. Returns total count for pagination UI
7. Admin can use existing PUT/PATCH endpoints on any property

---

### Story 2.7: Admin Dashboard

**As an** admin,  
**I want** an admin panel to view all properties,  
**so that** I can monitor and manage the platform.

**Acceptance Criteria:**
1. Admin dashboard at `/admin` (admin role required)
2. Table with all properties: Thumbnail, Title, Agent, Price, City, Status, Created
3. Pagination controls (previous/next, page numbers)
4. Filter dropdowns: Status, Agent
5. Sort by clicking column headers
6. Click row to open property detail/edit
7. Edit saves changes via admin API
8. Access by non-admin redirects to home

---

## 8. Epic 3: Public Experience & Polish

**Goal:** Deliver the public-facing property browsing experience with listings, detail pages, favorites, and final polish. By the end of this epic, the full MVP is complete and ready for demonstration.

---

### Story 3.1: Public Properties API

**As a** public user,  
**I want** to retrieve published property listings,  
**so that** I can browse available properties.

**Acceptance Criteria:**
1. `GET /api/public/properties` returns published properties only
2. No authentication required
3. Supports pagination: page, limit (default limit=12)
4. Supports sort: price_asc, price_desc, newest
5. Supports filter: city
6. Returns property with agent name (not email/phone for list view)
7. Returns total count for pagination

---

### Story 3.2: Public Property Detail API

**As a** public user,  
**I want** to view full details of a property,  
**so that** I can learn more about a listing.

**Acceptance Criteria:**
1. `GET /api/public/properties/{id}` returns full property details
2. No authentication required
3. Includes all property fields
4. Includes agent contact info: name, email, phone
5. 404 if property not found or not published
6. Increments view_count (optional for MVP)

---

### Story 3.3: Public Listings Page

**As a** property seeker,  
**I want** to browse property listings,  
**so that** I can find properties of interest.

**Acceptance Criteria:**
1. Home page at `/` displays listings
2. Hero section with background image and tagline
3. Filter bar: City dropdown, Sort dropdown (Price Low-High, Price High-Low, Newest)
4. Property grid: 3 columns desktop, 2 tablet, 1 mobile
5. Property cards show: Main image, Title, Price, City, Beds, Baths, Heart icon
6. Cards link to detail page
7. Pagination at bottom (Load More or page numbers)
8. Loading state while fetching
9. Empty state if no properties match filters

---

### Story 3.4: Property Detail Page

**As a** property seeker,  
**I want** to view full property details,  
**so that** I can evaluate the listing.

**Acceptance Criteria:**
1. Detail page at `/properties/{id}`
2. Image gallery: main image + thumbnails, click to enlarge
3. Property info: Title, Price, Address, Type, Beds, Baths, Surface
4. Description section (formatted text)
5. Agent card: Name, Email, Phone with click-to-contact links
6. Favorite button (heart icon) toggles favorite status
7. Back to listings link
8. 404 page if property not found
9. Loading state while fetching

---

### Story 3.5: Favorites Feature

**As a** property seeker,  
**I want** to save properties to favorites,  
**so that** I can compare them later.

**Acceptance Criteria:**
1. Heart icon on property cards and detail page
2. Click toggles favorite status (filled=favorited, outline=not)
3. Favorites stored in localStorage (array of property IDs)
4. Favorites persist across browser sessions
5. Favorites page at `/favorites`
6. Favorites page shows saved properties in grid format
7. Remove from favorites via heart icon
8. Handle removed/unpublished properties gracefully (show "no longer available")
9. Empty state on favorites page if none saved

---

### Story 3.6: Navigation and Layout Polish

**As a** user,  
**I want** consistent navigation across the application,  
**so that** I can easily move between sections.

**Acceptance Criteria:**
1. Header with logo/title, navigation links
2. Public nav: Home, Favorites
3. Authenticated nav: Dashboard (agents), Admin (admins), Logout
4. Mobile hamburger menu
5. Footer with basic info
6. 404 page for unknown routes
7. Consistent styling across all pages
8. Loading spinners for async operations
9. Toast notifications for success/error feedback

---

### Story 3.7: Error Handling and Validation Polish

**As a** user,  
**I want** clear feedback when errors occur,  
**so that** I can understand and resolve issues.

**Acceptance Criteria:**
1. API errors display user-friendly messages (not raw errors)
2. Form validation shows inline errors per field
3. Network errors show retry option
4. Session expiry redirects to login with message
5. Image upload errors (size, type) show specific guidance
6. 500 errors show generic "something went wrong" with retry
7. Console logs detailed errors for debugging (dev mode)

---

### Story 3.8: Final Testing and Documentation

**As a** developer,  
**I want** documented testing and deployment instructions,  
**so that** the MVP can be verified and deployed.

**Acceptance Criteria:**
1. Backend API tests cover: auth, property CRUD, admin endpoints
2. Frontend component tests for: Login, PropertyCard, PropertyForm
3. Manual test script documenting all user flows
4. README updated with: setup, testing, deployment instructions
5. API documentation accessible at `/docs` (FastAPI auto-generated)
6. Seed script for demo data (admin + sample agent + properties)
7. Environment variable documentation

---

## 9. Checklist Results Report

*To be completed after PRD review*

---

## 10. Next Steps

### 10.1 Architect Handoff Prompt

**For the Architect Agent:**

Please review this PRD for RealEstate Pro and create the technical architecture document. Key areas requiring specification:

- Detailed API endpoint specifications with request/response schemas
- Database schema with indexes and constraints
- Frontend component hierarchy and state management approach
- File/folder structure for both backend and frontend
- Authentication flow diagrams
- Image upload and storage strategy
- Error handling patterns
- Testing strategy and coverage requirements

Reference documents:
- [Project Brief](docs/brief.md)
- This PRD

---

## Appendix A: API Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/health | None | Health check |
| POST | /api/auth/login | None | User login |
| GET | /api/auth/me | JWT | Current user info |
| POST | /api/admin/agents | Admin | Create agent |
| GET | /api/admin/agents | Admin | List agents |
| GET | /api/admin/properties | Admin | All properties (paginated) |
| POST | /api/properties | Agent/Admin | Create property |
| GET | /api/properties/mine | Agent | Agent's properties |
| PUT | /api/properties/{id} | Owner/Admin | Update property |
| PATCH | /api/properties/{id}/status | Owner/Admin | Update status |
| POST | /api/properties/{id}/images | Owner/Admin | Upload images |
| DELETE | /api/properties/{id}/images/{file} | Owner/Admin | Delete image |
| GET | /api/public/properties | None | Published listings |
| GET | /api/public/properties/{id} | None | Property detail |
| GET | /api/uploads/{property_id}/{file} | None | Serve image |

---

## Appendix B: Data Models Summary

**User**
```
id: int (PK)
email: string (unique)
password_hash: string
name: string
phone: string (nullable)
role: enum (agent, admin)
created_at: datetime
```

**Property**
```
id: int (PK)
title: string
price: decimal
surface: decimal
city: string
street: string (nullable)
address: string (nullable)
property_type: enum (house, apartment, condo, land, commercial)
bedrooms: int (nullable)
bathrooms: int (nullable)
description: text (nullable)
images: json (array of strings)
status: enum (draft, published)
agent_id: int (FK -> User)
created_at: datetime
updated_at: datetime
```

---

*PRD created using the BMAD-METHOD™ framework*
