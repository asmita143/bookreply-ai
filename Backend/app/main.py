from fastapi import FastAPI
from app.api import emails
from app.api import context
from app.api import ai
from app.api import booking
from app.api import gmail

app = FastAPI(title="Restaurant AI Assistant Backend Test")

app.include_router(emails.router)

app.include_router(booking.router)

app.include_router(context.router)

app.include_router(ai.router)

app.include_router(gmail.router)