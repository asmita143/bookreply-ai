from app.db.firebase import db
from app.models.booking import Booking
from app.mcp.schemas import MCPContext

COLLECTION = "bookings"

def create_booking(booking: Booking):
    doc_ref = db.collection(COLLECTION).document()
    doc_ref.set(booking)
    return doc_ref.id


def get_bookings_by_slot(date: str, time: str):
    docs = (
        db.collection(COLLECTION)
        .where("date", "==", date)
        .where("time", "==", time)
        .stream()
    )
    return [doc.to_dict() for doc in docs]

def check_availability(context: MCPContext) -> bool:
    if not context.current_bookings:
        return True

    total_reserved = sum(b["party_size"] for b in context.current_bookings)
    remaining_capacity = context.capacity - total_reserved

    return context.party_size <= remaining_capacity
