from app.mcp.schemas import MCPContext

def build_prompt(context: MCPContext, occupied_seats, remaining_seats, decision) -> str:
    return f"""
        You are an assistant for {context.restaurant_name}.

        A customer sent this booking request:
        "{context.customer_message}"

        Booking request details:
        Date: {context.booking_date}
        Time: {context.booking_time}
        Number of people: {context.party_size}

        Restaurant capacity: {context.capacity}
        Occupied seats: {occupied_seats}
        Remaining seats: {remaining_seats}

        Decision: {decision}

        IMPORTANT:
        - Only output the final message for the customer.
        - Do NOT include calculations or reasoning steps.
        - Be polite and professional.
        - If REJECT → optionally suggest alternative times.
    """
