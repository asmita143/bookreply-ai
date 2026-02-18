from pydantic import BaseModel
from typing import Optional, List

class Booking(BaseModel):
    booking_date: Optional[str]
    booking_time: Optional[str]
    party_size: Optional[int]
    customer_name: Optional[str]
    customer_email: Optional[str]
    seating_preference: Optional[str]
    dietary_requirements: Optional[str]
    alternative_time_range: Optional[List[str]]
    customer_questions: Optional[List[str]]
