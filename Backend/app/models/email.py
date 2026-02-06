from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Email(BaseModel):
    sender: str
    subject: str
    body: str
    intent: Optional[str] = None
    ai_reply: Optional[str] = None
