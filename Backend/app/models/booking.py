from pydantic import BaseModel

class Booking(BaseModel):
    customer_name: str
    email: str
    date: str
    time: str
    party_size: int
    status: str
    source_email_id: str
