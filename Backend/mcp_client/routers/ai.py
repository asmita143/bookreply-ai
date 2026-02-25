from fastapi import APIRouter
from mcp_client.services.ai_service import generate_rule_based_reply
from mcp_client.services.mcp_agent import process_email
from mcp_client.context_builder import build_context_from_email
import os
import requests

router = APIRouter(prefix="/ai", tags=["AI"])

MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "http://localhost:8001")

@router.get("/draft/{email_id}")
def generate_draft(email_id: str):
    try:
        response = requests.get(f"{MCP_SERVER_URL}/emails/{email_id}")
        response.raise_for_status()
        email_data = response.json()
        
    except requests.HTTPError:
        return {"error": "Email not found"}
    except Exception as e:
        return {"error": f"Failed to fetch email: {e}"}
    
    context = None
    draft = None 

    try:
        result = process_email(email_data)

        context = result.get("context")
        draft = result.get("ai_reply")
        booking_available = result.get("booking_available", False)
        booking_data = result.get("booking_data", None)
        cancellation_status = result.get("cancellation_status")

        if not draft or len(draft.strip()) < 5:
            raise ValueError("AI returned empty/short response")
    
    except Exception as e:
        print("Fallback triggered:", e)

        try:
            context = build_context_from_email(email_data)
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
        "booking_data": booking_data,
        "cancellation_status": cancellation_status
    }
