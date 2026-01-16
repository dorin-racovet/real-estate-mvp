import asyncio
import sys
import os

# Add backend directory to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select
from app.core.db.database import async_session_maker, create_tables
from app.core.config import settings
from app.models.user import User, UserRole
from app.models.property import Property, PropertyType, PropertyStatus
import bcrypt
import shutil
import httpx
import random

def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

async def download_image(client: httpx.AsyncClient, path: str, type_str: str):
    # Use loremflickr or similar for real-looking images
    # keywords: house, architecture, apartment, modern home
    keywords = ["house", "apartment", "home", "modern architecture", "villa"]
    keyword = type_str if type_str in ["house", "apartment"] else random.choice(keywords)
    
    url = f"https://loremflickr.com/800/600/{keyword}"
    try:
        # Add random parameter to prevent caching identical images
        resp = await client.get(url, follow_redirects=True, params={"random": random.random()})
        if resp.status_code == 200:
            with open(path, "wb") as f:
                f.write(resp.content)
        else:
            # Fallback to creating a dummy if download fails
            print(f"Failed download {url}, creating dummy.")
            with open(path, "wb") as f:
                 f.write(b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x03\xff\xda\x00\x08\x01\x01\x00\x00\x00?\x00\xff\xd9')
    except Exception as e:
        print(f"Error downloading {url}: {e}")

# Removed create_dummy_images as logic is moved inside seed()

async def seed():
    print("Creating tables...")
    await create_tables()
    
    async with async_session_maker() as session:
        # 1. Admin User
        print(f"Checking for admin user {settings.ADMIN_EMAIL}...")
        result = await session.execute(select(User).where(User.email == settings.ADMIN_EMAIL))
        admin = result.scalar_one_or_none()
        
        if not admin:
            print("Creating admin user...")
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                password_hash=hash_password(settings.ADMIN_PASSWORD),
                name=settings.ADMIN_NAME,
                role=UserRole.ADMIN
            )
            session.add(admin_user)
            await session.commit()
            print("Admin user created successfully.")
        else:
            print("Admin user already exists.")

        # 2. Agent User
        agent_email = "agent@realestate.pro"
        print(f"Checking for agent user {agent_email}...")
        result = await session.execute(select(User).where(User.email == agent_email))
        agent = result.scalar_one_or_none()
        
        if not agent:
            print("Creating agent user...")
            agent = User(
                email=agent_email,
                password_hash=hash_password("agent123"),
                name="Best Agent",
                role=UserRole.AGENT,
                phone="555-0199"
            )
            session.add(agent)
            await session.commit()
            print("Agent user created successfully.")
        else:
            print("Agent user already exists.")

        # 3. Properties
        print("Checking for properties...")
        result = await session.execute(select(Property).limit(1))
        existing_property = result.scalar_one_or_none()
        
        if not existing_property:
            print("Creating 10 properties...")
            base_upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
            
            for i in range(1, 11):
                prop_type = PropertyType.APARTMENT if i % 2 == 0 else PropertyType.HOUSE
                
                # Create property without images first
                prop = Property(
                    title=f"Beautiful {prop_type.value.capitalize()} in City Center {i}",
                    price=150000 + (i * 25000),
                    surface=80 + (i * 10),
                    city="New York" if i % 2 == 0 else "Los Angeles",
                    address=f"{i}00 Main St, Apt {i}",
                    property_type=prop_type,
                    bedrooms=2 + (i % 3),
                    bathrooms=1 + (i % 2),
                    description=f"This is a dummy description for property {i}. It features wonderful views and modern amenities.",
                    status=PropertyStatus.PUBLISHED,
                    agent_id=agent.id,
                    images=[]
                )
                session.add(prop)
                await session.flush()
                await session.refresh(prop)
                
                # Create images for this property
                prop_dir = os.path.join(base_upload_dir, str(prop.id))
                os.makedirs(prop_dir, exist_ok=True)
                
                img_paths = []
                async with httpx.AsyncClient() as client:
                    for j in range(1, 4):
                        img_filename = f"image_{j}.jpg"
                        img_real_path = os.path.join(prop_dir, img_filename)
                        print(f"Downloading image {j} for property {i}...")
                        await download_image(client, img_real_path, prop_type.value)
                        img_paths.append(f"uploads/{prop.id}/{img_filename}")
                
                prop.images = img_paths
                session.add(prop)
            
            await session.commit()
            print("10 Properties created successfully.")
        else:
            print("Properties already exist.")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed())