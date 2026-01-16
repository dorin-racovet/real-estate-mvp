# 13. Deployment Considerations

## 13.1 Production Checklist

- [ ] Set `DEBUG=false`
- [ ] Generate strong `SECRET_KEY`
- [ ] Change admin password from default
- [ ] Configure proper CORS origins
- [ ] Set up HTTPS
- [ ] Consider PostgreSQL migration for production scale

## 13.2 Docker Configuration (Future)

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---
