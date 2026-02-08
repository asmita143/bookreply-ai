from pydantic import BaseModel
from typing import Optional, List, Dict, Tuple
from datetime import datetime

class MCPContext(BaseModel):
    request_type: str 
    customer_message: str
    customer_email: str
    customer_name: Optional[str]
    restaurant_name: str
    capacity: int
    booking_date: Optional[str] = None
    booking_time: Optional[str] = None
    alternative_time_range: Optional[Tuple[str, str]]
    party_size: Optional[int] = None
    seating_preference: Optional[str]
    dietary_requirements: Optional[str]
    customer_questions: Optional[List[str]]
    extraction_source: Optional[str]
    timestamp: datetime
    current_bookings: Optional[List[Dict]] = None
