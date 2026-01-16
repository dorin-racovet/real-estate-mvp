# 9. Image Storage Strategy

## 9.1 Storage Architecture

```
backend/
└── uploads/                        # Root uploads directory
    ├── 1/                          # Property ID 1
    │   ├── main.jpg
    │   ├── kitchen.jpg
    │   └── bedroom.jpg
    ├── 2/                          # Property ID 2
    │   ├── exterior.png
    │   └── living_room.webp
    └── ...
```

## 9.2 Image Upload Flow

```
┌──────────┐     ┌───────────────┐     ┌──────────────┐     ┌──────────┐
│ Frontend │     │  API Endpoint │     │ File Handler │     │Filesystem│
└────┬─────┘     └───────┬───────┘     └──────┬───────┘     └────┬─────┘
     │                   │                    │                  │
     │ POST /properties/{id}/images           │                  │
     │ multipart/form-data                    │                  │
     │ [file1.jpg, file2.png]                 │                  │
     │──────────────────>│                    │                  │
     │                   │                    │                  │
     │                   │ Validate ownership │                  │
     │                   │ Validate file type │                  │
     │                   │ Validate file size │                  │
     │                   │                    │                  │
     │                   │ For each file:     │                  │
     │                   │────────────────────│                  │
     │                   │ generate_filename()│                  │
     │                   │<───────────────────│                  │
     │                   │                    │                  │
     │                   │ save_file()        │                  │
     │                   │────────────────────│─────────────────>│
     │                   │                    │   File saved     │
     │                   │<───────────────────│<─────────────────│
     │                   │                    │                  │
     │                   │ Update property.images                │
     │                   │                    │                  │
     │ 200 PropertyRead (with new images)     │                  │
     │<──────────────────│                    │                  │
```

## 9.3 Image Handler Implementation

```python
import os
import uuid
import aiofiles
from pathlib import Path
from fastapi import UploadFile, HTTPException

UPLOAD_DIR = Path("uploads")
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


async def save_property_image(
    property_id: int,
    file: UploadFile
) -> str:
    """Save an uploaded image and return the filename."""
    
    # Validate extension
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed: {ALLOWED_EXTENSIONS}"
        )
    
    # Validate size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // 1024 // 1024}MB"
        )
    
    # Create directory
    property_dir = UPLOAD_DIR / str(property_id)
    property_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    file_path = property_dir / filename
    
    # Save file
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)
    
    return filename


def delete_property_image(property_id: int, filename: str) -> bool:
    """Delete an image file."""
    file_path = UPLOAD_DIR / str(property_id) / filename
    if file_path.exists():
        file_path.unlink()
        return True
    return False


def get_image_url(property_id: int, filename: str) -> str:
    """Generate the URL for an image."""
    return f"/uploads/{property_id}/{filename}"
```

## 9.4 Serving Static Files

In `main.py`:
```python
from fastapi.staticfiles import StaticFiles

# Mount uploads directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```

---
