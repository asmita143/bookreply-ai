from app.mcp.schemas import MCPContext

def generate_draft_reply(context: MCPContext) -> str:
    """
    Generates a draft reply using MCP structured context.
    (For now this can be mock logic before real LLM integration)
    """

    if context.request_type == "booking":
        return f"""
Dear customer,

Thank you for your booking request at {context.restaurant_name}.
We have received your message:

"{context.customer_message}"

Our team will confirm your booking shortly.

Best regards,
{context.restaurant_name}
"""

