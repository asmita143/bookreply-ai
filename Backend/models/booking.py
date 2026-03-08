from pydantic import BaseModel
from typing import Optional, List

class Booking(BaseModel):
    id: Optional[str]
    booking_date: Optional[str]
    booking_time: Optional[str]
    party_size: Optional[int]
    customer_name: Optional[str]
    customer_email: Optional[str]
    dietary_requirements: Optional[str]
    customer_questions: Optional[List[str]]
