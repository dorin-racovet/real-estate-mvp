from datetime import datetime, timedelta
from typing import Dict
from collections import defaultdict
import asyncio

class RateLimiter:
    """In-memory rate limiter for tracking failed login attempts."""
    
    def __init__(self, max_attempts: int = 5, window_minutes: int = 15):
        self.max_attempts = max_attempts
        self.window_minutes = window_minutes
        self._attempts: Dict[str, list] = defaultdict(list)
        self._lock = asyncio.Lock()
    
    async def is_rate_limited(self, email: str) -> bool:
        """Check if an email is currently rate limited."""
        async with self._lock:
            now = datetime.utcnow()
            cutoff_time = now - timedelta(minutes=self.window_minutes)
            
            if email in self._attempts:
                self._attempts[email] = [
                    ts for ts in self._attempts[email] if ts > cutoff_time
                ]
            
            return len(self._attempts[email]) >= self.max_attempts
    
    async def record_failed_attempt(self, email: str) -> None:
        """Record a failed login attempt for an email."""
        async with self._lock:
            now = datetime.utcnow()
            self._attempts[email].append(now)
    
    async def reset_attempts(self, email: str) -> None:
        """Reset failed attempts for an email."""
        async with self._lock:
            if email in self._attempts:
                del self._attempts[email]
    
    async def get_attempt_count(self, email: str) -> int:
        """Get current attempt count for an email."""
        async with self._lock:
            now = datetime.utcnow()
            cutoff_time = now - timedelta(minutes=self.window_minutes)
            
            if email in self._attempts:
                self._attempts[email] = [
                    ts for ts in self._attempts[email] if ts > cutoff_time
                ]
                return len(self._attempts[email])
            return 0

login_rate_limiter = RateLimiter(max_attempts=5, window_minutes=1)
