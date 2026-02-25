from fastapi import APIRouter
from mcp_server.services.booking_service import create_booking, get_bookings_by_slot
from mcp_server.services.cancellation_service import cancel_booking
from mcp_server.services.availability_services import check_availability
from models.booking import Booking

router = APIRouter(prefix="/tools", tags=["Tools"])

@router.post("/create_booking")
def create_booking_tool(data: dict):
    booking = Booking(
        customer_name=data["customer_name"],
        booking_date=data["date"],
        booking_time=data["time"],
        customer_email=data["email"],
        party_size=data["party_size"],
        dietary_requirements=data.get("dietary_requirements", ""),
        customer_questions=data.get("customer_questions", [])
    )
    create_booking(booking)
    return {"status": "success"}


@router.post("/cancel_booking")
def cancel_booking_tool(data: dict):
    return cancel_booking(
        sender_email=data.get("email"),
        booking_date=data.get("booking_date"),
        booking_time=data.get("booking_time")
    )


@router.post("/check_availability")
def check_availability_tool(data: dict):
    return check_availability(
        date=data["date"],
        time=data["time"],
        party_size=data["party_size"],
        capacity=data["capacity"]
    )

@router.post("/get_bookings_by_slot")
def get_bookings_by_slot_tool(data: dict):
    print("Booking details: ", data.get("date"))
    date = data.get("date")
    time = data.get("time")
    bookings = get_bookings_by_slot(date, time)
    return {"status": "success", "data": bookings}