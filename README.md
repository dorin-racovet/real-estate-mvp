# Real Estate MVP

This project is an MVP developed using the BMAD (Build More, Architect Dreams) method.

It is a full-stack real estate application.

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Node.js (for frontend development)
- Python 3.11+ (for backend development)

### First Time Setup (Fresh Database)

1. **Create the Alembic versions directory:**
   ```bash
   mkdir -p backend/alembic/versions
   ```

2. **Start the containers:**
   ```bash
   docker-compose up -d
   ```

3. **Create the versions directory inside the backend container:**
   ```bash
   docker-compose exec backend mkdir -p /app/alembic/versions
   ```

4. **Generate the initial database migration:**
   ```bash
   docker-compose exec backend alembic revision --autogenerate -m "Initial migration"
   ```

5. **Apply the migration to create database tables:**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

6. **Create admin user and seed sample data:**
   ```bash
   ./backend/scripts/create-admin.sh
   ```
   
   This will create:
   - Admin user: `admin@realestate.pro` / `admin123`
   - Agent user: `agent@realestate.pro` / `agent123`
   - 10 sample properties with images

### Running the Application

Start all services:
```bash
docker-compose up
```

Or run in detached mode:
```bash
docker-compose up -d
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Stopping the Application

```bash
docker-compose down
```

### Database Migrations

After making changes to database models, generate and apply migrations:

```bash
# Generate a new migration
docker-compose exec backend alembic revision --autogenerate -m "Description of changes"

# Apply migrations
docker-compose exec backend alembic upgrade head
```
