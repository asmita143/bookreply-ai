from pydantic import BaseModel

class Booking(BaseModel):
    id: str
    date: str
    time: str
    people: int
