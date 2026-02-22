from app.mcp.schemas import MCPContext
from app.services.ai_service import generate_ai_reply
from app.mcp.context_builder import build_context_from_email
from app.services.booking_service import create_booking, check_availability
from app.models.email import Email

def process_email(email: Email) -> MCPContext:
    print(email)
    context = build_context_from_email(email)

    booking_available = False
    booking_data = None

    if context.request_type == "booking":
        booking_available = check_availability(context)

        if booking_available:
            booking_data = {
                "customer_name": context.customer_name,
                "date": context.booking_date,
                "time": context.booking_time,
                "party_size": context.party_size,
                "email": context.customer_email,
                "source_email_id": email["gmail_id"],
                "dietary_requirements": context.dietary_requirements,
                "customer_questions": context.customer_questions

            }

    ai_reply = generate_ai_reply(context)

    return {
        "context": context,
        "ai_reply": ai_reply,
        "booking_available": booking_available,
        "booking_data": booking_data
    }
