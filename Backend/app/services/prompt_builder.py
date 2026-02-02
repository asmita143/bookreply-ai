from app.mcp.schemas import MCPContext

def build_prompt(context: MCPContext) -> str:
    return f"""
        You are an assistant for {context.restaurant_name}.

        A customer sent this booking request:
        "{context.customer_message}"

        Booking request details:
        Date: {context.requested_date}
        Time: {context.requested_time}
        Number of people: {context.requested_people}

        Restaurant capacity: {context.capacity}

        Existing bookings for this slot:
        {context.current_bookings}

        Your task:
        1. Calculate total occupied seats.
        2. Determine if enough seats remain.
        3. If available, confirm booking politely.
        4. If full, suggest alternative time.
    """
