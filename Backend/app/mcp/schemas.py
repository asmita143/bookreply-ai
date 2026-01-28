from pydantic import BaseModel
from typing import Optional

class MCPContext(BaseModel):
    request_type: str 
    customer_message: str
    customer_email: str
    restaurant_name: str
    booking_date: Optional[str] = None
    booking_time: Optional[str] = None
    party_size: Optional[int] = None
