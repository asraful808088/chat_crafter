
from fastapi import FastAPI, WebSocket
import json
import asyncio
app = FastAPI()
from handler import create_conv_controller
async def data_handler(data,websocket,conv_obj):
    parsedata = json.loads(data)
    if parsedata["type"] == "send_msg":
        def onRespobseState(data_info):
            asyncio.create_task(websocket.send_text(json.dumps(data_info)))
        def onRespobse(data_info):
            asyncio.create_task(websocket.send_text(json.dumps(data_info)))
        conv_obj["convObj"].on_respose = onRespobse
        conv_obj["convObj"].on_respose_stage = onRespobseState
        conv_obj["convObj"].input(parsedata["txt"])
        

clients = {}
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_text()
        parsed_data = json.loads(data)
        user_id = parsed_data.get("user_id")

        if not user_id:
            await websocket.send_text(json.dumps({"error": "user_id is required"}))
            await websocket.close()
            return
        clients[user_id] = {
            "ws":websocket,
            "convObj":create_conv_controller()
        }
        await websocket.send_text(json.dumps({"connect":1}))
        while True:
            data = await websocket.receive_text()
            await data_handler(data, websocket,clients[user_id])

    except Exception as e:
        print(f"Client {user_id} disconnected: {e}")
    finally:
        if user_id in clients:
            del clients[user_id]
     
