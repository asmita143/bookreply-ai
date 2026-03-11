from fastapi import APIRouter
from typing import Optional
from models.booking import Booking
from mcp_server.services.booking_service import (
    create_booking,
    get_bookings_by_slot,
    get_all_bookings,
)
from mcp_server.services.cancellation_service import cancel_booking

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/")
def add_booking(booking: Booking):
    create_booking(booking)
    return {"message": "Booking created"}

@router.post("/cancel")
def cancel_booking(booking_id: str):
    result = cancel_booking(booking_id)
    return result

@router.get("/")
def get_bookings(date: str, time: str):
    return get_bookings_by_slot(date, time)


@router.get("/all")
def get_all_bookings_route():
    return get_all_bookings()
