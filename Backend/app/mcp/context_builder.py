from app.mcp.schemas import MCPContext
from app.models.email import Email
from app.services.request_classifier import detect_request_type
from app.db.bookings_db import get_bookings_for_slot
import re

RESTAURANT_CAPACITY = 20

def build_context_from_email(email: Email) -> MCPContext:
    request_type = detect_request_type(email.body)

    if request_type == "booking":
        booking_date, booking_time, party_size = extract_booking_details(email.body)
    else:
        booking_date, booking_time, party_size = None, None, None

    current_bookings = get_bookings_for_slot(booking_date, booking_time)

    return MCPContext(
        request_type=request_type,  
        customer_message=email.body,
        restaurant_name="Restaurant X",
        capacity=RESTAURANT_CAPACITY,
        booking_date=booking_date,
        booking_time=booking_time,
        party_size=party_size,
        current_bookings=current_bookings
    )


def extract_booking_details(email_text: str):
    # date in YYYY-MM-DD
    date_match = re.search(r"\b(\d{4}-\d{2}-\d{2})\b", email_text)
    booking_date = date_match.group(1) if date_match else None

    # time in HH:MM
    time_match = re.search(r"\b(\d{1,2}:\d{2})\b", email_text)
    booking_time = time_match.group(1) if time_match else None

    # party size
    people_match = re.search(r"(\d+)\s*(people|persons|guests|pax)", email_text, re.IGNORECASE)
    party_size = int(people_match.group(1)) if people_match else None

    return booking_date, booking_time, party_size