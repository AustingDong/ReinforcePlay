"""
Progress tracking endpoint
"""
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

router = APIRouter()

# Store connected WebSocket clients
active_connections: Dict[str, List[WebSocket]] = {}


@router.websocket("/ws/progress/{session_id}")
async def websocket_progress(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time progress updates
    
    Alternative to SSE for bidirectional communication
    """
    await websocket.accept()
    
    # Add to active connections
    if session_id not in active_connections:
        active_connections[session_id] = []
    active_connections[session_id].append(websocket)
    
    try:
        while True:
            # Wait for messages from client (keepalive, commands, etc.)
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get('type') == 'ping':
                await websocket.send_json({'type': 'pong'})
            
    except WebSocketDisconnect:
        # Remove from active connections
        active_connections[session_id].remove(websocket)
        if not active_connections[session_id]:
            del active_connections[session_id]


async def broadcast_progress(session_id: str, progress_data: Dict):
    """
    Broadcast progress update to all connected clients for this session
    """
    if session_id in active_connections:
        disconnected = []
        
        for connection in active_connections[session_id]:
            try:
                await connection.send_json(progress_data)
            except:
                disconnected.append(connection)
        
        # Remove disconnected clients
        for conn in disconnected:
            active_connections[session_id].remove(conn)


@router.get("/progress/{session_id}")
async def get_progress(session_id: str):
    """
    Get current progress (alternative to streaming)
    """
    # This would query the simulation state
    # For now, return a placeholder
    return {
        "session_id": session_id,
        "message": "Use /simulate/stream/{session_id} for real-time updates"
    }

