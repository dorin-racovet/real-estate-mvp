# Story 07: Authentication Endpoint & JWT

**Story ID:** BACKEND-002 | **Points:** 5

## Acceptance Criteria
- [ ] POST /api/auth/login endpoint
- [ ] JWT generation: 24hr expiration, HS256 algorithm
- [ ] Bcrypt password validation (10 salt rounds)
- [ ] Response: token, role, userId, email, name
- [ ] Error codes: 400, 401, 404
- [ ] No password/token logging
- [ ] Tests: valid/invalid login, token expiration

## Dependencies
- Depends: Story 06
- Next: Stories 08, 09, 10