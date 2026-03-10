from app.db.firebase import db
from models.booking import Booking

COLLECTION = "bookings"

def create_booking(booking: Booking):
    doc_ref = db.collection(COLLECTION).document()
    doc_ref.set({
        "customer_name": booking.customer_name,
        "date": booking.booking_date,
        "time": booking.booking_time,
        "email": booking.customer_email,
        "party_size": booking.party_size,
        "status": "success",
        "dietary_requirements": booking.dietary_requirements,
        "customer_questions": booking.customer_questions
    })
    return doc_ref.id


def get_bookings_by_slot(date: str, time: str):
    docs = (
        db.collection(COLLECTION)
        .where("date", "==", date)
        .where("time", "==", time)
        .stream()
    )
    return [doc.to_dict() for doc in docs]


def get_all_bookings():
    docs = db.collection(COLLECTION).stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in docs]