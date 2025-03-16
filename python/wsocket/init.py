from python.function.main_model import traning_main_model
from fastapi import  WebSocket
from typing import List
import json
import asyncio


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
       parsed_message = json.loads(message)
       layerss = [
   {
      
      "type":"lstm",
      "persep":100,
      "activation":"tanh",
      "l1":None,
      "l2":None,
    },
    {"type":"dropout",
        "rate":0.1
    },
]
       
       
       def callbackConsole(value):
            print("------------------------------")
            print("------------------------------")
            print("------------------------------")
            print("------------------------------")
            # for connection in self.active_connections:
            #     await connection.send_text("asdasdasd")
            #     pass
       if parsed_message["type"] == "main_model":
           traning_main_model(parsed_message["map_cat"],callBack=callbackConsole)
           


# .send_text(json.dumps(value))