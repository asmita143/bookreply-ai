from fastapi import APIRouter
from app.services.email_service import get_email_by_id
from app.services.ai_service import generate_rule_based_reply
from app.services.mcp_agent import process_email
from app.mcp.context_builder import build_context_from_email

router = APIRouter(prefix="/ai", tags=["AI"])

@router.get("/draft/{email_id}")

def generate_draft(email_id: str):
    email= get_email_by_id(email_id)

    print(email["gmail_id"])
    
    if not email:
        return {"error": "Email not found"}
    
    context = None
    draft = None 

    try:
        result = process_email(email)
        print("AI success:", result)

        context = result.get("context")
        draft = result.get("ai_reply")
        booking_available = result.get("booking_available", False)
        booking_data = result.get("booking_data", None)

        if not draft or len(draft.strip()) < 5:
            raise ValueError("AI returned empty/short response")
    
    except Exception as e:
        print("Fallback triggered:", e)

        try:
            context = build_context_from_email(email)
        except:
            context = None

        if context:
            draft = generate_rule_based_reply(context)
        else:
            draft = "Thank you for your email. We will get back to you shortly."

        booking_available = False
        booking_data = None

    return {
        "draft_reply": draft,
        "booking_available": booking_available,
        "booking_data": booking_data
    }
