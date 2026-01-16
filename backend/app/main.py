from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import router as api_router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME, 
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
# Using settings.CORS_ORIGINS directly if it matches the format, or converting if needed.
# Converting list of strings to list of strings is fine.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads (creating directory if not exists is good practice)
import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Health Check
@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "ok"}

# API Routes
app.include_router(api_router, prefix="/api")