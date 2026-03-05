from app.mcp.schemas import MCPContext
from models.email import Email
from datetime import datetime
from mcp_client.services.ai_service import ai_extract
from mcp_client.tool_router import execute_tool

RESTAURANT_CAPACITY = 30

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

    current_bookings = []
    if booking_date and booking_time:
        current_bookings = execute_tool("get_bookings_by_slot", {
            "date": booking_date,
            "time": booking_time
        })
        
        if isinstance(current_bookings, dict) and current_bookings.get("status") == "success":
            bookings = current_bookings.get("data", [])
            current_bookings = bookings if isinstance(bookings, list) else []
            print("Booking tool returned list:", current_bookings)
        else:
            print("Booking tool returned non-list:", current_bookings)
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


