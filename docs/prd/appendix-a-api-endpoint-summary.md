# Appendix A: API Endpoint Summary

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
