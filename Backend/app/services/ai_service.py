from app.mcp.schemas import MCPContext
from app.services.prompt_builder import build_prompt
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_rule_based_reply(context: MCPContext) -> str:

    if context.request_type == "booking":
        return f"Thank you for your booking request. We will confirm availability shortly."

    elif context.request_type == "location":
        return f"Our restaurant is located at Main Street 101. We look forward to seeing you."

    elif context.request_type == "menu":
        return f"You can view our menu here on our website. Let us know if you have dietary questions."

    elif context.request_type == "cancellation":
        return f"Your cancellation request has been received and processed"

    else:
        return "Thank you for contacting us."

def generate_ai_reply(context):
    prompt = build_prompt(context)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an assistant helping a restaurant manage bookings."},
            {"role": "user", "content": prompt}
        ],
    )
    return response.choices[0].message.content