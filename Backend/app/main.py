from fastapi import FastAPI
from app.api import emails

app = FastAPI(title="Restaurant AI Assistant Backend Test")

app.include_router(emails.router)
