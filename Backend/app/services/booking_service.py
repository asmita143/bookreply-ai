from app.db.firebase import db
from app.models.booking import Booking

COLLECTION = "bookings"

def create_booking(booking: Booking):
    doc_ref = db.collection(COLLECTION).document()
    doc_ref.set(booking.dict())
    return doc_ref.id


def get_bookings_by_slot(date: str, time: str):
    docs = (
        db.collection(COLLECTION)
        .where("date", "==", date)
        .where("time", "==", time)
        .stream()
    )

    return [doc.to_dict() for doc in docs]
