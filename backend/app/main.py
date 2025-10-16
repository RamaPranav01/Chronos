from fastapi import FastAPI, WebSocket
from .core.config import settings

app = FastAPI(title="Project Chronos Backend")

@app.get("/")
def read_root():
    # This will fail if the API key is not loaded, which is a good check.
    return {"message": f"Chronos Backend is running. API Key loaded: {'Yes' if settings.GOOGLE_API_KEY else 'No'}"}

@app.websocket("/ws/analyze")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("Connection to Chronos Agent established.")
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Mission received: {data}")