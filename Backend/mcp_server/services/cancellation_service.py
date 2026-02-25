from app.db.firebase import db
from datetime import datetime

COLLECTION = "bookings"

def cancel_booking(sender_email: str, booking_date: str, booking_time: str):

    bookings = (
        db.collection(COLLECTION)
        .where("email", "==", sender_email)
        .where("date", "==", booking_date)
        .where("time", "==", booking_time)
        .where("status", "==", "success")
        .get()
    )

    if not bookings:
        return {
            "success": False,
            "message": "No matching active booking found."
        }

    booking_doc = bookings[0]

    booking_doc.reference.update({
        "status": "cancelled",
        "cancelled_at": datetime.utcnow()
    })

    return {
        "success": True,
        "message": "Booking cancelled successfully."
    }