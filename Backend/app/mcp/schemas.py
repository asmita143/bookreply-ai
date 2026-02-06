from pydantic import BaseModel
from typing import Optional, List

class MCPContext(BaseModel):
    request_type: str 
    customer_message: str
    restaurant_name: str
    capacity: int

    booking_date: Optional[str] = None
    booking_time: Optional[str] = None
    party_size: Optional[int] = None

    current_bookings: List[dict]
