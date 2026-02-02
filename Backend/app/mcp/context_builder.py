from app.mcp.schemas import MCPContext
from app.models.email import Email
from app.services.request_classifier import detect_request_type
from app.db.bookings_db import get_bookings_for_slot

RESTAURANT_CAPACITY = 20

def build_context_from_email(email: Email) -> MCPContext:
    request_type = detect_request_type(email.body)

    requested_people = 4
    requested_time = "19:00"
    requested_date = "2026-01-31"

    current_bookings = get_bookings_for_slot(requested_date, requested_time)

    return MCPContext(
        request_type=request_type,  
        customer_message=email.body,
        customer_email=email.sender,
        restaurant_name="Restaurant X",
        capacity=RESTAURANT_CAPACITY,
        booking_date=requested_date,
        booking_time=requested_time,
        party_size=requested_people,
        current_bookings=current_bookings
    )
