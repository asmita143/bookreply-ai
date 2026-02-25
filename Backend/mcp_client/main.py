from fastapi import FastAPI
from mcp_client.routers import ai

app = FastAPI(title="MCP Client - AI Email Orchestrator")

app.include_router(ai.router)