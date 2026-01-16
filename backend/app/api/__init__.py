from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.admin import router as admin_router
from app.api.v1.properties import router as properties_router
from app.api.v1.users import router as users_router

router = APIRouter()

router.include_router(auth_router, prefix="/v1/auth", tags=["auth"])
router.include_router(admin_router, prefix="/v1/admin", tags=["admin"])
router.include_router(properties_router, prefix="/v1/properties", tags=["properties"])
router.include_router(users_router, prefix="/v1/users", tags=["users"])
