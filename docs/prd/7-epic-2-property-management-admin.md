# 7. Epic 2: Property Management & Admin

**Goal:** Complete the agent experience with property listing management (view, edit, status changes) and deliver admin oversight capabilities. By the end of this epic, agents can fully manage their portfolios and admins can oversee all listings.

---

## Story 2.1: Agent Properties List API

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

## Story 2.2: Property Update and Status Management

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

## Story 2.3: Property Image Management

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

## Story 2.4: Agent Dashboard Properties Table

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

## Story 2.5: Agent Property Edit Page

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

## Story 2.6: Admin Properties API

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

## Story 2.7: Admin Dashboard

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
