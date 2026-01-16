# Appendix B: Data Models Summary

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
