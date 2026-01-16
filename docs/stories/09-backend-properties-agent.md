# Story 09: Agent Properties CRUD

**Story ID:** BACKEND-004 | **Points:** 8

## Acceptance Criteria
- [ ] POST /api/properties: multipart, title/description/price/city required, up to 10 images max 10MB each
- [ ] PUT /api/properties/:id: update own properties (ownership check)
- [ ] DELETE /api/properties/:id: delete own properties, cascade images
- [ ] GET /api/properties/my-listings: agent properties (draft + published)
- [ ] Image processing: MIME validation, thumbnails (300x225px), storage with display_order
- [ ] Validation: price >= 0, bedrooms/baths 0-10
- [ ] HTTP 403 if not owner
- [ ] Performance: <1000ms for create
- [ ] Tests: CRUD, validation, images, ownership

## Dependencies
- Depends: Stories 06, 07
- Next: Story 10