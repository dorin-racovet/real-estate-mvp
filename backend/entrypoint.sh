#!/bin/bash
set -e

echo "Waiting for database to be ready..."
python -c "
import asyncio
import asyncpg
import time
import sys

async def wait_for_db():
    for i in range(30):
        try:
            conn = await asyncpg.connect('postgresql://postgres:postgres@db/realestate')
            await conn.close()
            print('Database is ready!')
            return True
        except Exception as e:
            print(f'Waiting for database... ({i+1}/30)')
            time.sleep(1)
    print('Database connection timeout!')
    sys.exit(1)

asyncio.run(wait_for_db())
"

echo "Running database migrations..."
alembic upgrade head

echo "Seeding database..."
python scripts/seed.py

echo "Starting application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
