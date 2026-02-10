from app.mcp.schemas import MCPContext
import json

def build_prompt(context: MCPContext, decision) -> str:
    context_dict = context.dict() if hasattr(context, "dict") else context
    print(decision)
    return f"""
        You are an AI assistant for a restaurant.

        Based on the context below, generate a polite and professional email reply.

        Context:
        {json.dumps(context_dict, indent=2, default=str)}
        Decision: {decision}

        Decision rules (DO NOT change these decisions):
        - If ACCEPT:
            Confirm the reservation politely.
        - If REJECT:
            Politely inform the customer that the requested time is not available.
            Suggest alternative times if alternative_time_range exists.
        - If request_type = cancellation:
            Confirm the cancellation.
        - If request_type = general:
            Answer the customer's question.

        Important:
        - Use a professional and friendly email tone.
        - Return only the email text.
    """