from app.mcp.schemas import MCPContext
from mcp_client.services.prompt_builder import build_prompt
from openai import OpenAI
import os
import json
from dotenv import load_dotenv
from datetime import datetime
from ..tool_registry import TOOLS
from mcp_client.tool_router import execute_tool

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def call_model(messages: list, use_tools: bool = True):
    """
    Call OpenAI with tool definitions
    If use_tools=True → sends tool definitions.
    """

    params = {
        "model": "gpt-4o-mini",
        "messages": messages
    }

    if use_tools:
        params["tools"] = TOOLS
        params["tool_choice"] = "auto"
        
    response = client.chat.completions.create(**params)
    return response

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

def generate_ai_reply(context: MCPContext, sender: str):
    print("\n========== MCP AGENT START ==========")
    messages = [
        {
            "role": "system",
            "content": """You are a restaurant AI assistant.
            When booking availability must be checked, ALWAYS call check_availability first.
            If available is true, call create_booking.
            If available is false, politely reject.
            If dietary requirements are present, ALSO call get_menu_data and include relevant menu options in the response.
            If location and Opening hours, call get_restaurant_info ONLY.
            If menu, call get_menu_data ONLY.
            If user requests cancellation, call cancel_booking.
            For mixed requests (e.g., booking + dietary + questions), you may call multiple tools.
            Only produce final customer-facing message after tool responses."""
        },
        {
            "role": "user",
            "content": build_prompt(context)
        }
    ]

    booking_available = None
    cancellation_status = None

    while True:
        response = call_model(messages, use_tools=True)
        message = response.choices[0].message

        if not message.tool_calls:
            draft = message.content or "Thank you for your email. We will get back to you shortly."
            return{
                "draft": draft,
                "booking_available": booking_available,
                "cancellation_status": cancellation_status
            }

        messages.append({
            "role": "assistant",
            "content": message.content,
            "tool_calls": message.tool_calls
        })

        for tool_call in message.tool_calls:
            tool_name = tool_call.function.name
            arguments = json.loads(tool_call.function.arguments)
            arguments["email"] = sender

            tool_result = execute_tool(tool_name, arguments)

            if tool_name == "check_availability":
                booking_available = tool_result.get("available", False)
                print("Booking status is: ", booking_available)

            elif tool_name == "cancel_booking":
                cancellation_status = tool_result.get("success")
                print("Cancellation status is: ", cancellation_status)
            
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(tool_result)
            })

def ai_extract(email_text: str):
    today = str(datetime.today().date())
    
    prompt = f"""
        You are a helpful assistant. Extract booking information from the following customer email. Today's date is {today}.

        Email:
        \"\"\"{email_text}\"\"\"
        Return STRICT JSON only (no explanation, no text).

        Follow these rules carefully:

        1. booking_date → string in format YYYY-MM-DD
        2. booking_time → string in format HH:MM (24-hour)
        3. party_size → integer
        4. customer_name → string

        5. seating_preference → ALWAYS a list of strings
        Example: ["window", "quiet corner"]

        6. dietary_requirements → ALWAYS a list of strings
        Example: ["vegetarian", "gluten-free"]

        7. alternative_time_range → ALWAYS a list of objects:
        Example:
        [
            {{"date": "2026-03-23", "time": "19:30"}},
            {{"date": "2026-03-24", "time": "20:00"}}
        ]

        8. customer_questions → ALWAYS a list of strings

        9. If a value is missing:
        - use null for single values
        - use [] for lists

        Return exactly this JSON format:

        {{
        "booking_date": null,
        "booking_time": null,
        "party_size": null,
        "customer_name": null,
        "seating_preference": [],
        "dietary_requirements": [],
        "alternative_time_range": [],
        "customer_questions": []
        }}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a strict JSON extractor."},
            {"role": "user", "content": prompt}
        ],
        temperature=0
    )

    raw_content = response.choices[0].message.content.strip()

    if raw_content.startswith("```"):
        raw_content = "\n".join(raw_content.split("\n")[1:-1])

    try:
        return json.loads(raw_content)
    except json.JSONDecodeError:
        print("Failed to parse AI output:", raw_content)
        return {}