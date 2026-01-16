# Story 08: Public Properties List & Detail

**Story ID:** BACKEND-003 | **Points:** 5

## Acceptance Criteria
- [ ] GET /api/properties: published properties only with pagination (limit 12)
- [ ] Filters: city, min_price, max_price
- [ ] Sorting: created_at (default), price, title with asc/desc
- [ ] GET /api/properties/:id: full details, images, agent contact
- [ ] 404 if unpublished or not found
- [ ] No authentication required
- [ ] Performance: <200ms list, <150ms detail
- [ ] Tests: filters, sorting, pagination, 404 cases

## Dependencies
- Depends: Stories 06, 07
- Next: Story 09