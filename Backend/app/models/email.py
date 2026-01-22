from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Email(BaseModel):
    id: str
    sender: str
    subject: str
    body: str
    received_at: datetime
    status: str = "unprocessed"  # unprocessed | drafted | sent
