from mcp_client.context_builder import build_context_from_email
from models.email import Email

def build_email_messages(email: Email):
    """
    Convert Email / MCPContext into OpenAI message format
    """
    mcp_context = build_context_from_email(email)

    print("Now in MCP Context ", mcp_context)

    messages = [
        {"role": "system", "content": "You are a restaurant booking assistant."},
        {"role": "user", "content": f"""
        Customer Name: {mcp_context.customer_name}
        Email: {mcp_context.customer_email}
        Message: {mcp_context.customer_message}
        Booking Date: {mcp_context.booking_date}
        Booking Time: {mcp_context.booking_time}
        Party Size: {mcp_context.party_size}
        Seating Preference: {mcp_context.seating_preference}
        Dietary Requirements: {mcp_context.dietary_requirements}
        Current Bookings: {mcp_context.current_bookings}
        """.strip()}
    ]

    return messages