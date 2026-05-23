from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Status = Literal[
    "Applied",
    "Phone Screen",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn",
]


class ApplicationBase(BaseModel):
    company: str = Field(min_length=1, max_length=200)
    role: str = Field(min_length=1, max_length=200)
    location: str | None = None
    status: Status = "Applied"
    date_applied: date
    job_url: str | None = None
    salary_range: str | None = None
    contact_name: str | None = None
    notes: str | None = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company: str | None = Field(default=None, min_length=1, max_length=200)
    role: str | None = Field(default=None, min_length=1, max_length=200)
    location: str | None = None
    status: Status | None = None
    date_applied: date | None = None
    job_url: str | None = None
    salary_range: str | None = None
    contact_name: str | None = None
    notes: str | None = None


class Application(ApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime


class DuplicateCheck(BaseModel):
    exists: bool
