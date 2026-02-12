from app.mcp.schemas import MCPContext
from app.models.email import Email
from app.services.booking_service import get_bookings_by_slot
import re
from word2number import w2n
from datetime import datetime, timedelta
from app.services.ai_service import ai_extract

RESTAURANT_CAPACITY = 20

def build_context_from_email(email: Email) -> MCPContext:
    email_data = Email(**email)
    text = email_data.body
    request_type = email_data.intent

    booking_date = None
    booking_time = None
    party_size = None
    current_bookings = []
    customer_name = None
    seating_preference = None
    dietary_requirements = None
    alternative_time_range = None
    customer_questions = None

    if request_type in ["booking", "cancellation"]:
        booking_date = extract_date(text)
        booking_time = extract_time(text)
        party_size = extract_party_size(text)

        if not booking_date or not booking_time or not party_size:
            ai_data = ai_extract(text) 

            booking_date = booking_date or ai_data.get("booking_date")
            booking_time = booking_time or ai_data.get("booking_time")
            party_size = party_size or ai_data.get("party_size")

            customer_name = ai_data.get("customer_name")
            seating_preference = ai_data.get("seating_preference")
            dietary_requirements = ai_data.get("dietary_requirements")
            alternative_time_range = ai_data.get("alternative_time_range")
            customer_questions = ai_data.get("customer_questions")
        else:
            customer_name = extract_name(text)
            seating_preference = extract_seating_preference(text)
            dietary_requirements = extract_dietary_requirements(text)
            alternative_time_range = extract_time_range(text)
            customer_questions = extract_questions(text)

        if booking_date and booking_time:
            current_bookings = get_bookings_by_slot(booking_date, booking_time)

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
        extraction_source="regex+AI" if request_type=="booking" else "regex",
        timestamp=datetime.utcnow()
    )

    return mcp_context


def word_to_number(text):
    try:
        return w2n.word_to_num(text.lower())
    except:
        return None

def extract_party_size(text):
    match = re.search(r"(\d+)\s*(people|persons|guests|pax)", text, re.IGNORECASE)
    if match:
        return int(match.group(1))
    match = re.search(r"(\w+)\s*(people|persons|guests|pax)", text, re.IGNORECASE)
    if match:
        num = word_to_number(match.group(1))
        if num:
            return int(num)
    return None

def extract_time(text):
    text_lower = text.lower()
    match = re.search(r"\b(\d{1,2}:\d{2})\b", text)
    if match:
        return match.group(1)
    match = re.search(r"\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b", text_lower)
    if match:
        hour = int(match.group(1))
        minute = int(match.group(2)) if match.group(2) else 0
        period = match.group(3)
        if period == "pm" and hour != 12:
            hour += 12
        if period == "am" and hour == 12:
            hour = 0
        return f"{hour:02d}:{minute:02d}"
    return None

def extract_date(text):
    text_lower = text.lower()
    match = re.search(r"\b(\d{4}-\d{2}-\d{2})\b", text)
    if match:
        return match.group(1)
    today = datetime.today().date()
    if "tomorrow" in text_lower:
        return str(today + timedelta(days=1))
    elif "today" in text_lower:
        return str(today)
    return None

def extract_name(text):
    match = re.search(r"under the name (\w+)", text, re.IGNORECASE)
    return match.group(1) if match else None

def extract_seating_preference(text):
    match = re.search(r"(quiet|quieter|window|outdoor|booth|corner)", text, re.IGNORECASE)
    return match.group(1) if match else None

def extract_dietary_requirements(text):
    if re.search(r"(no dietary|none|no special dietary)", text, re.IGNORECASE):
        return None
    match = re.search(r"(vegetarian|vegan|gluten-free|allergy|kosher|halal)", text, re.IGNORECASE)
    return match.group(1) if match else None

def extract_time_range(text):
    match = re.search(r"between (\d{1,2}[:.]?\d{0,2}\s*(?:am|pm)?) and (\d{1,2}[:.]?\d{0,2}\s*(?:am|pm)?)", text, re.IGNORECASE)
    if match:
        start = extract_time(match.group(1))
        end = extract_time(match.group(2))
        return (start, end)
    return None

def extract_questions(text):
    return [q.strip() for q in re.findall(r"([^.!?]*\?)", text)]


