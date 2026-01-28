from datetime import datetime
from app.models.email import Email
import uuid

EMAILS = []

def get_all_emails():
    return EMAILS

def get_email_by_id(email_id: str):
    return next((e for e in EMAILS if e.id == email_id), None)

def add_mock_email():
    email = Email(
        id=str(uuid.uuid4()),
        sender="customer@example.com",
        subject="Table reservation",
        body="Hi, I would like to book a table for 2 tomorrow at 7pm.",
        received_at=datetime.utcnow()
    )
    EMAILS.append(email)
    return email
