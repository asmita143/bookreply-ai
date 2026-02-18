from app.mcp.schemas import MCPContext
from app.services.ai_service import generate_ai_reply
from app.mcp.context_builder import build_context_from_email
from app.services.booking_service import create_booking, check_availability
from app.models.email import Email

def process_email(email: Email) -> MCPContext:
    context = build_context_from_email(email)

    if context.request_type == "booking":
        available = check_availability(context)

        if available:
            booking_data = {
                "customer_name": context.customer_name,
                "date": context.booking_date,
                "time": context.booking_time,
                "party_size": context.party_size,
                "email": context.customer_email,
                "source_email_id": email.gmail_id,
                "dietary_requirements": context.dietary_requirements,
                "customer_questions": context.customer_questions

            }
            create_booking(booking_data)

    ai_reply = generate_ai_reply(context)

    return context, ai_reply
