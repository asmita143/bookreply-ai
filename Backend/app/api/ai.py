from fastapi import APIRouter
from app.services.email_service import get_email_by_id
from app.services.ai_service import generate_rule_based_reply
from app.services.mcp_agent import process_email

router = APIRouter(prefix="/ai", tags=["AI"])

@router.get("/draft/{email_id}")

def generate_draft(email_id: str):
    email = get_email_by_id(email_id)
    
    if not email:
        return {"error": "Email not found"}

    try:
        context, draft = process_email(email)
        print("AI success:", draft)

        if not draft or len(draft.strip()) < 5:
            raise ValueError("AI returned empty/short response")
    
    except Exception as e:
        print("Fallback triggered:", e)
        draft = generate_rule_based_reply(context)

    return {"draft_reply": draft}
