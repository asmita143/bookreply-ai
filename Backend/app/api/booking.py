from fastapi import APIRouter
from app.models.booking import Booking
from app.services.booking_service import create_booking, get_bookings_by_slot

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/")
def add_booking(booking: Booking):
    booking_id = create_booking(booking)
    return {"message": "Booking created", "id": booking_id}

@router.get("/")
def get_bookings(date: str, time: str):
    return get_bookings_by_slot(date, time)
