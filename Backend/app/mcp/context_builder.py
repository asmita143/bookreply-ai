from app.mcp.schemas import MCPContext
from app.models.email import Email
from app.services.booking_service import get_bookings_by_slot
from datetime import datetime
from app.services.ai_service import ai_extract

RESTAURANT_CAPACITY = 20

def build_context_from_email(email: Email) -> MCPContext:
    email_data = Email(**email)
    text = email_data.body
    request_type = email_data.intent

    ai_data = ai_extract(text) 

    booking_date = ai_data.get("booking_date")
    booking_time = ai_data.get("booking_time")
    party_size = ai_data.get("party_size")
    customer_name = ai_data.get("customer_name")
    seating_preference = ai_data.get("seating_preference")
    dietary_requirements = ai_data.get("dietary_requirements")
    alternative_time_range = ai_data.get("alternative_time_range")
    customer_questions = ai_data.get("customer_questions")

    if booking_date and booking_time:
        current_bookings = get_bookings_by_slot(booking_date, booking_time)
    else:
        current_bookings = []

    mcp_context = MCPContext(
        request_type=request_type,
        customer_message=text,
        customer_email=email_data.sender,
        customer_name=customer_name,
        restaurant_name="Restaurant X",
        capacity=RESTAURANT_CAPACITY,
        booking_date=booking_date,
        booking_time=booking_time,
        party_size=party_size,
        current_bookings=current_bookings,
        seating_preference=seating_preference,
        dietary_requirements=dietary_requirements,
        alternative_time_range=alternative_time_range,
        customer_questions=customer_questions,
        extraction_source="AI",
        timestamp=datetime.utcnow()
    )

    return mcp_context


