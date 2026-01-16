# Story 01: Agent & Admin Login

**Story ID:** AUTH-001  
**Epic:** Authentication & Authorization  
**Priority:** P0 - Critical Path  
**Estimate:** 5 points  

---

## User Story

As an **agent or administrator**  
I want to **log in with email and password**  
So that **I can access my dashboard and manage properties**

---

## Description

Implement a secure login page that authenticates both agents and administrators. The system shall use JWT tokens for session management and enforce proper password security. Users should experience clear feedback on login success or failure with appropriate error messages.

---

## Acceptance Criteria

### Frontend - Login Page Display
- [ ] Login page displays at `/login` route
- [ ] Form contains email input field with placeholder "Enter your email"
- [ ] Form contains password input field with placeholder "Enter your password"
- [ ] Password field masks input (bullets/asterisks, not plain text)
- [ ] "Login" button is visible and clickable
- [ ] Login page has clean, professional design with company branding
- [ ] Page is fully responsive on mobile (320px) and desktop (1920px+)

### Frontend - Form Validation
- [ ] Email field validates on blur and shows error if invalid format
- [ ] Email validation follows RFC 5322 standards (basic: user@domain.com)
- [ ] Password field requires minimum 8 characters
- [ ] Client-side validation errors display below respective fields in red text
- [ ] "Login" button remains disabled until both fields are valid
- [ ] Form clears error messages when user starts correcting input

### Frontend - Login Flow
- [ ] On successful login, JWT token is stored in localStorage as `authToken`
- [ ] On successful login, user is redirected to appropriate dashboard based on role:
  - Agents → `/agent/dashboard`
  - Admins → `/admin/dashboard`
- [ ] On failed login, error message displays: "Invalid email or password"
- [ ] Failed login does NOT redirect; user remains on login page
- [ ] Login button shows loading state during request (spinner/disabled state)
- [ ] Logout clears localStorage and redirects to public home page

### Backend - Authentication Endpoint
- [ ] POST `/api/auth/login` accepts JSON: `{ email: string, password: string }`
- [ ] Endpoint validates email format server-side
- [ ] Endpoint retrieves agent/admin record from database by email
- [ ] Passwords are hashed using bcrypt (salt rounds: 10)
- [ ] Endpoint compares submitted password against bcrypt hash
- [ ] On successful authentication, endpoint returns:
  ```json
  {
    "token": "jwt.token.here",
    "role": "agent|admin",
    "userId": 123,
    "email": "user@example.com"
  }
  ```
- [ ] On failed authentication, endpoint returns 401 status with message: `{ error: "Invalid credentials" }`
- [ ] Token expiration is 24 hours from login
- [ ] Endpoint enforces rate limiting (max 5 failed attempts per email per 15 minutes)

### Backend - Database Schema
- [ ] Agents table includes: `id`, `email` (unique), `password_hash`, `name`, `phone`, `created_at`, `updated_at`
- [ ] Admin table includes: `id`, `email` (unique), `password_hash`, `name`, `created_at`, `updated_at`
- [ ] Both tables have indexes on `email` for fast lookup

### Security & Best Practices
- [ ] Passwords are never logged or displayed in any response
- [ ] Login endpoint uses HTTPS only (enforced in production)
- [ ] JWT token includes: `userId`, `role`, `iat`, `exp` claims
- [ ] Expired tokens are rejected with 401 status
- [ ] CORS is configured to only allow frontend origin
- [ ] Sensitive errors (password incorrect vs. user not found) are not disclosed to client

### Testing Requirements
- [ ] Login succeeds with valid agent credentials
- [ ] Login succeeds with valid admin credentials
- [ ] Login fails with non-existent email
- [ ] Login fails with incorrect password
- [ ] Login fails with invalid email format
- [ ] Login fails with empty email or password
- [ ] Token is correctly decoded and contains expected claims
- [ ] Rate limiting blocks requests after 5 failed attempts
- [ ] Expired tokens are rejected on subsequent requests

---

## Technical Details

### Frontend Stack
- React component for login form
- Client-side validation using form library (e.g., React Hook Form)
- localStorage for token persistence
- Protected route wrapper to check auth token before rendering dashboards

### Backend Stack
- FastAPI endpoint: `POST /api/auth/login`
- bcrypt for password hashing
- PyJWT for token generation and validation
- SQLite database with agents/admins tables

### Dependencies
- bcrypt (password hashing)
- PyJWT (JWT token handling)
- SQLAlchemy (ORM for database)
- Pydantic (request validation)

---

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All acceptance criteria tested and passing
- [ ] Unit tests cover auth endpoint and token validation
- [ ] Integration tests verify login flow end-to-end
- [ ] No security vulnerabilities identified in review
- [ ] Documentation updated with login flow diagram
- [ ] Manual testing completed on desktop and mobile
- [ ] Performance: login response time < 500ms under normal load
