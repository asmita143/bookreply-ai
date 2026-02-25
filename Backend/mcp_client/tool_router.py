import requests
import os

MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "http://localhost:8001")

def execute_tool(tool_name: str, arguments: dict):
    """
    Send tool execution request to MCP Server
    """

    print("Tool name is ", tool_name , "Arguments are ", arguments)
        
    response = requests.post(
        f"{MCP_SERVER_URL}/tools/{tool_name}",
        json=arguments
    )

    if response.status_code == 200:
        return response.json()
    else:
        return {"status": "error", "details": response.text}