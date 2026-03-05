TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "check_availability",
            "description": "Check table availability for a specific date and time",
            "parameters": {
                "type": "object",
                "properties": {
                    "date": {"type": "string"},
                    "time": {"type": "string"},
                    "party_size": {"type": "integer"},
                    "capacity": {"type": "integer"}
                },
                "required": ["date", "time", "party_size", "capacity"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_booking",
            "description": "Create a restaurant booking",
            "parameters": {
                "type": "object",
                "properties": {
                    "customer_name": {"type": "string"},
                    "date": {"type": "string"},
                    "time": {"type": "string"},
                    "email": {"type": "string"},
                    "party_size": {"type": "integer"},
                    "dietary_requirements": {"type": "string"},
                    "customer_questions": {"type": "array", "items": {"type": "string"}},
                    "source_email": {"type": "string"}
                },
                "required": ["customer_name", "date", "time", "email", "party_size", "dietary_requirements", "customer_questions", "source_email"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "cancel_booking",
            "description": "Cancel an existing booking",
            "parameters": {
                "type": "object",
                "properties": {
                    "booking_date": {
                        "type": "string",
                        "description": "Date of the booking in YYYY-MM-DD format"
                    },
                    "booking_time": {
                        "type": "string",
                        "description": "Time of the booking in HH:MM format"
                    }
                },
                "required": ["booking_date", "booking_time"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_restaurant_info",
            "description": "Get restaurant location and opening hours",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_menu_data",
            "description": "Get restaurant menu",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    }
]