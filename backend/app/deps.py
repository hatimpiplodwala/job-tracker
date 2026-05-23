import hashlib
import time
from dataclasses import dataclass
from threading import Lock

from fastapi import Depends, Header, HTTPException, status

from app.supabase_client import get_user_client


@dataclass
class CurrentUser:
    id: str
    email: str | None
    access_token: str


# In-process cache for Supabase auth.get_user results. Avoids a network
# round-trip to Supabase Auth on every request. Bounded in size so memory
# can't grow unbounded; entries expire after CACHE_TTL_SECONDS so a logged-out
# token stops working within the TTL window.
CACHE_TTL_SECONDS = 60
CACHE_MAX_ENTRIES = 1024
_cache: dict[str, tuple[float, CurrentUser]] = {}
_cache_lock = Lock()


def _token_key(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _cache_get(token: str) -> CurrentUser | None:
    key = _token_key(token)
    with _cache_lock:
        entry = _cache.get(key)
        if entry is None:
            return None
        expires_at, user = entry
        if expires_at < time.monotonic():
            _cache.pop(key, None)
            return None
        return user


def _cache_put(token: str, user: CurrentUser) -> None:
    key = _token_key(token)
    with _cache_lock:
        if len(_cache) >= CACHE_MAX_ENTRIES:
            # Drop the oldest entry; simple bound, not strict LRU.
            oldest = min(_cache.items(), key=lambda kv: kv[1][0])
            _cache.pop(oldest[0], None)
        _cache[key] = (time.monotonic() + CACHE_TTL_SECONDS, user)


def get_current_user(
    authorization: str | None = Header(default=None),
) -> CurrentUser:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    token = authorization.split(" ", 1)[1].strip()

    cached = _cache_get(token)
    if cached is not None:
        return cached

    client = get_user_client(token)
    try:
        result = client.auth.get_user(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        ) from exc

    user = getattr(result, "user", None)
    if user is None or not getattr(user, "id", None):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    current = CurrentUser(
        id=user.id,
        email=getattr(user, "email", None),
        access_token=token,
    )
    _cache_put(token, current)
    return current


def get_db(user: CurrentUser = Depends(get_current_user)):
    return get_user_client(user.access_token), user
