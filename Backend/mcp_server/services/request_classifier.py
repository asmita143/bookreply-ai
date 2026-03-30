def detect_request_type(message: str) -> str:
    msg = message.lower()

    if "cancel" in msg:
        return "cancellation"
    elif any(word in msg for word in ["book", "reservation", "table"]):
        return "booking"
    elif "menu" in msg:
        return "menu"
    elif any(word in msg for word in ["location", "address", "where"]):
        return "location"
    else:
        return "general"
