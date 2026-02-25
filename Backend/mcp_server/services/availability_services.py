from mcp_server.services.booking_service import get_bookings_by_slot

def check_availability(date: str, time: str, party_size: int, capacity: int):
    current_bookings = get_bookings_by_slot(date, time)

    total_reserved = sum(b.get("party_size", 0) for b in current_bookings)
    remaining_capacity = capacity - total_reserved

    return {
        "available": party_size <= remaining_capacity
    }