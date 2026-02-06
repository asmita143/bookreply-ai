from fastapi import APIRouter, HTTPException
from app.models.email import Email
from app.services.email_service import (
    get_all_emails,
    save_email,
    get_email_by_id
)

router = APIRouter(prefix="/emails", tags=["Emails"])

@router.post("/")
def create_email(email: Email):
    email_id = save_email(email)
    return {"message": "Email saved", "id": email_id}


@router.get("/")
def list_emails():
    return get_all_emails()

@router.get("/emails/{email_id}")
def read_email(email_id: str):
    email = get_email_by_id(email_id)

    if not email:
        raise HTTPException(status_code=404, detail="Email not found")

    return email
