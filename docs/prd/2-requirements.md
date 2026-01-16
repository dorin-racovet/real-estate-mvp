# 2. Requirements

## 2.1 Functional Requirements

**Authentication & Authorization**
- FR1: The system shall provide JWT-based authentication for agents and admins
- FR2: The system shall enforce role-based access control (agent, admin roles)
- FR3: Agents shall only access and modify their own properties
- FR4: Admins shall have read/write access to all properties
- FR5: Public users shall browse without authentication

**Property Management**
- FR6: Agents shall create properties with: title, price, surface, location (city, street, address), property type, bedrooms, bathrooms, description
- FR7: Agents shall upload multiple images per property (up to 10 images, max 10MB each)
- FR8: Properties shall have draft/published status controlled by the owning agent
- FR9: Agents shall view a table of their own properties with status indicators
- FR10: Agents shall edit and update their own properties
- FR11: Admins shall view a paginated table of all properties from all agents
- FR12: Admins shall edit any property regardless of ownership

**Public Listings**
- FR13: The public listings page shall display published properties in a card grid layout
- FR14: The listings page shall include a hero section with featured imagery
- FR15: Users shall filter listings by price (sort low-to-high, high-to-low)
- FR16: Users shall filter listings by location (city)
- FR17: Each property card shall display: thumbnail image, title, price, location, bedrooms, bathrooms
- FR18: Users shall click a property card to view the full detail page

**Property Detail Page**
- FR19: The detail page shall display all property information
- FR20: The detail page shall include a photo gallery with all uploaded images
- FR21: The detail page shall display agent contact information (name, email, phone)

**Favorites**
- FR22: Users shall add/remove properties from favorites via heart icon
- FR23: Favorites shall persist in browser localStorage (no login required)
- FR24: Users shall access a dedicated Favorites page showing saved properties
- FR25: Favorites page shall indicate if a favorited property is no longer available

## 2.2 Non-Functional Requirements

- NFR1: Page load time shall be under 2 seconds for listings page
- NFR2: The application shall support 50 concurrent users minimum
- NFR3: All API endpoints shall return responses within 500ms under normal load
- NFR4: The application shall be responsive across desktop and mobile browsers
- NFR5: Passwords shall be hashed using bcrypt with appropriate salt rounds
- NFR6: JWT tokens shall expire after 24 hours
- NFR7: The system shall use SQLite for MVP (with documented PostgreSQL migration path)
- NFR8: All forms shall provide client-side validation with clear error messages
- NFR9: The application shall work on modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- NFR10: Image uploads shall be validated for file type (jpg, png, webp) and size

---
