# 14. API Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/health | - | Health check |
| POST | /api/v1/auth/login | - | Login |
| GET | /api/v1/auth/me | JWT | Current user |
| POST | /api/v1/admin/agents | Admin | Create agent |
| GET | /api/v1/admin/agents | Admin | List agents |
| GET | /api/v1/admin/properties | Admin | All properties |
| POST | /api/v1/properties | Agent | Create property |
| GET | /api/v1/properties/mine | Agent | My properties |
| PUT | /api/v1/properties/{id} | Owner | Update property |
| PATCH | /api/v1/properties/{id}/status | Owner | Update status |
| POST | /api/v1/properties/{id}/images | Owner | Upload images |
| DELETE | /api/v1/properties/{id}/images/{file} | Owner | Delete image |
| GET | /api/v1/public/properties | - | Published listings |
| GET | /api/v1/public/properties/{id} | - | Property detail |

---

*Architecture document created using the BMAD-METHOD™ framework*
