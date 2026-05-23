from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.deps import get_db
from app.schemas import (
    Application,
    ApplicationCreate,
    ApplicationUpdate,
    DuplicateCheck,
)

router = APIRouter(prefix="/applications", tags=["applications"])

TABLE = "applications"


@router.get("", response_model=list[Application])
def list_applications(db=Depends(get_db)):
    client, user = db
    res = (
        client.table(TABLE)
        .select("*")
        .eq("user_id", user.id)
        .order("date_applied", desc=True)
        .execute()
    )
    return res.data or []


@router.post("", response_model=Application, status_code=status.HTTP_201_CREATED)
def create_application(payload: ApplicationCreate, db=Depends(get_db)):
    client, user = db
    body = payload.model_dump(mode="json")
    body["user_id"] = user.id
    res = client.table(TABLE).insert(body).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create application")
    return res.data[0]


@router.patch("/{app_id}", response_model=Application)
def update_application(
    app_id: str, payload: ApplicationUpdate, db=Depends(get_db)
):
    client, user = db
    body = payload.model_dump(mode="json", exclude_unset=True)
    if not body:
        raise HTTPException(status_code=400, detail="No fields to update")

    res = (
        client.table(TABLE)
        .update(body)
        .eq("id", app_id)
        .eq("user_id", user.id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=404, detail="Application not found")
    return res.data[0]


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(app_id: str, db=Depends(get_db)):
    client, user = db
    res = (
        client.table(TABLE)
        .delete()
        .eq("id", app_id)
        .eq("user_id", user.id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=404, detail="Application not found")
    return None


@router.get("/duplicate-check", response_model=DuplicateCheck)
def duplicate_check(
    company: str = Query(min_length=1),
    role: str = Query(min_length=1),
    exclude_id: str | None = Query(default=None),
    db=Depends(get_db),
):
    client, user = db
    query = (
        client.table(TABLE)
        .select("id", count="exact")
        .eq("user_id", user.id)
        .ilike("company", company)
        .ilike("role", role)
    )
    if exclude_id:
        query = query.neq("id", exclude_id)
    res = query.execute()
    return DuplicateCheck(exists=bool(res.data))
