from app.mcp.schemas import MCPContext
from app.models.email import Email

def build_context_from_email(email: Email) -> MCPContext:
    return MCPContext(
        request_type="booking",  
        customer_message=email.body,
        customer_email=email.sender,
        restaurant_name="Demo Restaurant"
    )
