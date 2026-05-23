from dataclasses import dataclass

import jwt
from fastapi import Depends, Header, HTTPException, status

from app.config import get_settings
from app.supabase_client import get_user_client


@dataclass
class CurrentUser:
    id: str
    email: str | None
    access_token: str


def get_current_user(
    authorization: str | None = Header(default=None),
) -> CurrentUser:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    token = authorization.split(" ", 1)[1].strip()
    settings = get_settings()

    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        ) from exc

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject",
        )

    return CurrentUser(id=user_id, email=payload.get("email"), access_token=token)


def get_db(user: CurrentUser = Depends(get_current_user)):
    return get_user_client(user.access_token), user
