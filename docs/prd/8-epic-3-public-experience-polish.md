# 8. Epic 3: Public Experience & Polish

**Goal:** Deliver the public-facing property browsing experience with listings, detail pages, favorites, and final polish. By the end of this epic, the full MVP is complete and ready for demonstration.

---

## Story 3.1: Public Properties API

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

## Story 3.2: Public Property Detail API

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

## Story 3.3: Public Listings Page

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

## Story 3.4: Property Detail Page

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

## Story 3.5: Favorites Feature

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

## Story 3.6: Navigation and Layout Polish

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

## Story 3.7: Error Handling and Validation Polish

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

## Story 3.8: Final Testing and Documentation

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
