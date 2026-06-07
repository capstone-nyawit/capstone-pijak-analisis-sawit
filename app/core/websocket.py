from fastapi import WebSocket
from typing import Dict, Set
import json

class ConnectionManager:
    def __init__(self):
        # Maps company_id -> dict of user_id -> {"ws": Set[WebSocket], "role": str}
        self.active_connections: Dict[int, Dict[int, dict]] = {}

    async def connect(self, websocket: WebSocket, company_id: int, user_id: int, role: str = "user"):
        await websocket.accept()
        
        if company_id not in self.active_connections:
            self.active_connections[company_id] = {}
            
        if user_id not in self.active_connections[company_id]:
            self.active_connections[company_id][user_id] = {"ws": set(), "role": role}
            
        self.active_connections[company_id][user_id]["ws"].add(websocket)
        # Always keep role up to date
        self.active_connections[company_id][user_id]["role"] = role

    def disconnect(self, websocket: WebSocket, company_id: int, user_id: int):
        if company_id in self.active_connections:
            if user_id in self.active_connections[company_id]:
                self.active_connections[company_id][user_id]["ws"].discard(websocket)
                if not self.active_connections[company_id][user_id]["ws"]:
                    del self.active_connections[company_id][user_id]
            if not self.active_connections[company_id]:
                del self.active_connections[company_id]

    def is_user_online(self, company_id: int, user_id: int) -> bool:
        return (
            company_id in self.active_connections
            and user_id in self.active_connections[company_id]
            and len(self.active_connections[company_id][user_id]["ws"]) > 0
        )

    async def broadcast_to_company(self, company_id: int, message: dict):
        """Broadcast to ALL users in a company (presence updates, etc.)"""
        if company_id not in self.active_connections:
            return
        message_str = json.dumps(message)
        for user_data in self.active_connections[company_id].values():
            for ws in user_data["ws"]:
                try:
                    await ws.send_text(message_str)
                except Exception:
                    pass

    async def broadcast_to_admins(self, company_id: int, message: dict):
        """Broadcast ONLY to admin-role users in a company (admin-only notifications)."""
        if company_id not in self.active_connections:
            return
        message_str = json.dumps(message)
        for user_data in self.active_connections[company_id].values():
            if user_data.get("role") == "admin":
                for ws in user_data["ws"]:
                    try:
                        await ws.send_text(message_str)
                    except Exception:
                        pass

    async def send_to_user(self, company_id: int, user_id: int, message: dict):
        """Send to a specific user only."""
        if company_id not in self.active_connections:
            return
        if user_id not in self.active_connections[company_id]:
            return
        message_str = json.dumps(message)
        for ws in self.active_connections[company_id][user_id]["ws"]:
            try:
                await ws.send_text(message_str)
            except Exception:
                pass

manager = ConnectionManager()
