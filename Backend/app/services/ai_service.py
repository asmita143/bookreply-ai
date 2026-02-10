from app.mcp.schemas import MCPContext
from app.services.prompt_builder import build_prompt
from openai import OpenAI
import os
from dotenv import load_dotenv
from datetime import datetime

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

def generate_ai_reply(context: MCPContext):
    occupied_seats = sum(b["party_size"] for b in context.current_bookings)
    remaining_seats = context.capacity - occupied_seats

    if remaining_seats >= context.party_size:
        decision = "ACCEPT"
    else:
        decision = "REJECT"

    prompt = build_prompt(context, decision=decision)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a restaurant booking assistant. Only output the final customer-facing message."},
            {"role": "user", "content": prompt}
        ],
    )
    
    return response.choices[0].message.content

def ai_extract(email_text: str):
    today = str(datetime.today().date())
    prompt = f"""
        Extract booking info from the email. Today's date: {today}.
        Return JSON only with:
        booking_date (YYYY-MM-DD or null)
        booking_time (HH:MM 24-hour or null)
        party_size (number or null)
        customer_name (or null)
        seating_preference (or null)
        dietary_requirements (or null)
        alternative_time_range (tuple or null)
        customer_questions (list or null)

        Email:
        \"\"\"{email_text}\"\"\"
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    import json
    try:
        return json.loads(response.choices[0].message.content.strip())
    except:
        return {}