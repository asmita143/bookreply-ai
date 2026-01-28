from fastapi import APIRouter, HTTPException
from app.services.email_service import get_email_by_id
from app.mcp.context_builder import build_context_from_email

router = APIRouter(prefix="/context", tags=["MCP"])

@router.get("/{email_id}")
def get_context(email_id: str):
    email = get_email_by_id(email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")

    context = build_context_from_email(email)
    return context
