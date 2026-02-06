def detect_request_type(message: str) -> str:
    msg = message.lower()

    if "book" in msg or "reservation" in msg or "table" in msg:
        return "booking"
    elif "where" in msg or "location" in msg or "address" in msg:
        return "location"
    elif "menu" in msg or "vegan" in msg or "food" in msg or "dish" in msg:
        return "menu"
    elif "cancel" in msg or "cancellation" in msg:
        return "cancellation"
    else:
        return "general"
