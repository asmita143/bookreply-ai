from fastapi import APIRouter
from mcp_server.services.gmail_services import fetch_emails
from mcp_server.services.email_service import save_email

router = APIRouter(prefix="/gmail", tags=["Gmail"])

@router.post("/sync")
def sync_gmail():
    emails = fetch_emails(max_results=20)

    saved = 0

    for email in emails:
        result = save_email(email)
        if result:
            saved += 1

    return {
        "fetched": len(emails),
        "saved_new": saved
    }
