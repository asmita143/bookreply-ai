from pydantic import BaseModel
from typing import Optional, List, Dict

class MCPContext(BaseModel):
    email_id: str
    request_type: str 
    customer_name: str
    customer_email: str
    customer_message: str
    restaurant_name: str
    capacity: int

    booking_date: Optional[str] = None
    booking_time: Optional[str] = None
    party_size: Optional[int] = None

    current_bookings: Optional[List[Dict]] = None
