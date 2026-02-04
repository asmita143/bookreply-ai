from fastapi import APIRouter
from app.services.email_service import get_email_by_id
from app.mcp.context_builder import build_context_from_email
from app.services.ai_service import generate_rule_based_reply
from app.services.ai_service import generate_ai_reply

router = APIRouter(prefix="/ai", tags=["AI"])

@router.get("/draft/{email_id}")

def generate_draft(email_id: str):
    email = get_email_by_id(email_id)
    
    if not email:
        return {"error": "Email not found"}
    
    context = build_context_from_email(email)

    try:
        print("Calling AI...")
        draft = generate_ai_reply(context)
        print("AI success:", draft)

        if not draft or len(draft.strip()) < 5:
            raise ValueError("AI returned empty/short response")
    
    except Exception as e:
        print("Fallback triggered:", e)
        draft = generate_rule_based_reply(context)

    return {"draft_reply": draft}
