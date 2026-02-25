from app.mcp.schemas import MCPContext
from mcp_client.services.ai_service import generate_ai_reply
from mcp_client.context_builder import build_context_from_email
from models.email import Email

def process_email(email: Email) -> MCPContext:
    context = build_context_from_email(email)
    print("Context received from build context ")
    print("Context built: ")
    print(context)

    result = generate_ai_reply(context, email["sender"])

    ai_reply = result["draft"]
    booking_available = result["booking_available"]
    cancellation_status = result["cancellation_status"]
    
    booking_data = None
    if getattr(context, "request_type", None) in ["booking", "cancellation"]:
        booking_data = {
            "customer_name": getattr(context, "customer_name", ""),
            "date": getattr(context, "booking_date", ""),
            "time": getattr(context, "booking_time", ""),
            "party_size": getattr(context, "party_size", 0),
            "email": getattr(context, "customer_email", ""),
            "dietary_requirements": getattr(context, "dietary_requirements", ""),
            "customer_questions": getattr(context, "customer_questions", []),
        }
        
    return {
        "context": context,
        "ai_reply": ai_reply,
        "booking_available": booking_available,
        "booking_data": booking_data,
        "cancellation_status": cancellation_status
    }
