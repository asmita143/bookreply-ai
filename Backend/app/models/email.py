from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Email(BaseModel):
    gmail_id: str
    full_name: Optional[str] = None
    sender: str
    subject: str
    body: str
    intent: Optional[str] = None
    ai_reply: Optional[str] = None
