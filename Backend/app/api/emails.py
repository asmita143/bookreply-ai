from fastapi import APIRouter, HTTPException
from app.services.email_service import (
    get_all_emails,
    get_email_by_id,
    add_mock_email
)

router = APIRouter(prefix="/emails", tags=["Emails"])

@router.get("/")
def list_emails():
    return get_all_emails()

@router.get("/{email_id}")
def get_email(email_id: str):
    email = get_email_by_id(email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    return email

@router.post("/mock")
def create_mock_email():
    email = add_mock_email()
    return {
        "message": "Mock email added",
        "id": email.id
    }
