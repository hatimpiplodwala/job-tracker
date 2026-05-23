from dataclasses import dataclass

from fastapi import Depends, Header, HTTPException, status

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

    return CurrentUser(
        id=user.id,
        email=getattr(user, "email", None),
        access_token=token,
    )


def get_db(user: CurrentUser = Depends(get_current_user)):
    return get_user_client(user.access_token), user
