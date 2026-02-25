from fastapi import FastAPI
from mcp_server.routers import tool
from mcp_server.routers import gmail
from mcp_server.routers import booking
from mcp_server.routers import emails

app = FastAPI(title="MCP Server - Restaurant Tools")

app.include_router(tool.router)

app.include_router(gmail.router)

app.include_router(booking.router)

app.include_router(emails.router)