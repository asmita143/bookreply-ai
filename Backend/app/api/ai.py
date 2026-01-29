from fastapi import APIRouter
from app.services.email_service import get_email_by_id
from app.mcp.context_builder import build_context_from_email
from app.services.ai_service import generate_draft_reply

router = APIRouter(prefix="/ai", tags=["AI"])

@router.get("/draft/{email_id}")
def generate_draft(email_id: str):
    email = get_email_by_id(email_id)
    context = build_context_from_email(email)
    draft = generate_draft_reply(context)
    return {"draft_reply": draft}
