# Story 10: Admin Properties Management

**Story ID:** BACKEND-005 | **Points:** 3

## Acceptance Criteria
- [ ] GET /api/admin/properties: all properties with filters (agent_id, status, city, search)
- [ ] PUT /api/admin/properties/:id: edit any property
- [ ] DELETE /api/admin/properties/:id: delete any property
- [ ] 403 Forbidden if not admin
- [ ] Pagination: page, limit (default 20)
- [ ] Tests: list all, filters by agent/status/city, edit/delete checks

## Dependencies
- Depends: Stories 06, 07, 08, 09
- Next: Story 11 (Error Handling Middleware)

## Points
- List endpoint: 1pt
- Edit endpoint: 1pt
- Delete endpoint: 0.5pt
- Testing: 0.5pt