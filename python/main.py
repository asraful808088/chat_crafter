import asyncio
import websockets
import json
from function.main_model import traning_main_model
from function.en_model import entities_model_builder
import threading
from time import sleep
import importlib.util
import sys
import os
sys.path.append(os.path.abspath("E:/project/nuxt/chat_crafter"))
sys.path.append(os.path.abspath("E:/project/nuxt/chat_crafter/doc"))
base_path = "E:/project/nuxt/chat_crafter/doc"
sys.path.append(os.path.abspath(base_path))

for root, dirs, files in os.walk(base_path):
    sys.path.append(os.path.abspath(root))
import subprocess
store_main_traning = []
main_traning_off = False
store_main_traning_en = []
main_traning_off_en = False
task_list = {}
async def handle_connection(websocket):
    global store_main_traning
    global main_traning_off
    global store_main_traning_en
    global main_traning_off_en
    global task_list
    def passToNodeItems(items):
         store_main_traning.append(items)
    def passToNodeItems_en(items):
         store_main_traning_en.append(items)
    def main_traning_status():
         global main_traning_off
         return main_traning_off
    def main_traning_status_en():
         global main_traning_off_en
         return main_traning_off_en
    def main_traning_start():
         global main_traning_off
         global store_main_traning
         store_main_traning = []
         main_traning_off = False
    def main_traning_start2():
         global store_main_traning_en
         global main_traning_off_en
         store_main_traning_en = []
         main_traning_off_en = False
    def main_traning_stop(final_data = None):
         global main_traning_off
         global task_list
         main_traning_off = True
         if final_data != None:
              asyncio.run(websocket.send(json.dumps({"items":[final_data],"emit_type": 'finishing_model'})))
              try:
                   del task_list["main_task_loop"]
              except:
                   pass
              try:
                    del task_list["main_task"]
              except:
                   pass
              
    def main_traning_stop2(final_data = None):
         global main_traning_off_en
         global task_list
         main_traning_off_en = True
         if final_data != None:
              asyncio.run(websocket.send(json.dumps({"items":[final_data],"emit_type": 'finishing_model_en'})))
              try:
                   del task_list["main_task_loop_en"]
              except:
                   pass
              try:
                    del task_list["main_task_en"]
              except:
                   pass

    def applyToClient(store_main_traning,websocket):
         while True:
              asyncio.run(websocket.send(json.dumps({"items":store_main_traning, "emit_type": 'updateing_model'})))
              store_main_traning.clear()
              sleep(3)
              if main_traning_status():
                    try:
                         del task_list["main_task_loop"]
                    except:
                         pass
                    try:
                         del task_list["main_task"]
                    except:
                         pass
                    break
    def applyToClient2(store_main_traning,websocket):
         while True:
              asyncio.run(websocket.send(json.dumps({"items":store_main_traning_en, "emit_type": 'updateing_model_en'})))
              store_main_traning_en.clear()
              sleep(3)
              if main_traning_status_en():
                    try:
                         del task_list["main_task_loop_en"]
                    except:
                         pass
                    try:
                         del task_list["main_task_en"]
                    except:
                         pass
                    break

    try:
        async for message in websocket:
               parsed_message  = json.loads(message)  
               if parsed_message["type"] == "main_model":
                    
                    main_traning_start()
                    task_list["main_task_loop"] = threading.Thread(target=applyToClient,args=(store_main_traning,websocket))
                    task_list["main_task_loop"].start()
                    task_list["main_task"] = threading.Thread(target=traning_main_model,args=(parsed_message["map_cat"],passToNodeItems,main_traning_status,parsed_message["network"],main_traning_stop,parsed_message["test_rate"]["active"], parsed_message["out_dim"]["active"], parsed_message["learning_rate"]["active"], parsed_message["epoch"]["active"], parsed_message["batch"]["active"],parsed_message["profileName"],parsed_message["model_name"]))
                    task_list["main_task"].start()
               elif parsed_message["type"] == "stop_main_model":
                    del task_list["main_task_loop"]
                    del task_list["main_task"]
                    main_traning_stop()
               elif parsed_message["type"] == "check_type":
                    module_path = parsed_message["path"]
                    module_name = "generated"
                    spec = importlib.util.spec_from_file_location(module_name, module_path)
                    module = importlib.util.module_from_spec(spec)
                    sys.modules[module_name] = module
                    spec.loader.exec_module(module)
                    getResult = module.getResult(parsed_message["msg"])
                    await websocket.send(json.dumps({"result":getResult[0],"emit_type": 'get_msg_return','full_result':getResult}))
               elif parsed_message["type"] == "en_main_model":
                    model_path = os.path.join(os.path.dirname(__file__), "en_temp.json")
                    with open(model_path, "r") as file:
                         data = json.load(file)
                    main_traning_start2()
                    task_list["main_task_loop_en"] = threading.Thread(target=applyToClient2,args=(store_main_traning,websocket))
                    task_list["main_task_loop_en"].start()
                    task_list["main_task_en"] = threading.Thread(target=entities_model_builder,args=(data["map_cat"],passToNodeItems_en,main_traning_status_en,parsed_message["network"],main_traning_stop2,parsed_message["test_rate"]["active"], parsed_message["out_dim"]["active"], parsed_message["learning_rate"]["active"], parsed_message["epoch"]["active"], parsed_message["batch"]["active"],parsed_message["profileName"],parsed_message["model_name"],parsed_message["entities"]))
                    task_list["main_task_en"].start()
               elif parsed_message["type"] == "stop_en_main_model":
                    del task_list["main_task_loop_en"]
                    del task_list["main_task_en"]
                    main_traning_stop2()
               elif parsed_message["type"] == "entities_check_type":
                    module_path = parsed_message["path"]
                    module_name = "generated"
                    spec = importlib.util.spec_from_file_location(module_name, module_path)
                    module = importlib.util.module_from_spec(spec)
                    sys.modules[module_name] = module
                    spec.loader.exec_module(module)
                    getResult = module.predict_entities(parsed_message["msg"])
                    await websocket.send(json.dumps({"result":getResult,"emit_type": 'entities_check_type_msg_return'}))
               elif parsed_message["type"] == "condition_check_type":
                    module_path = parsed_message["path"]
                    result = subprocess.run(["python", module_path], capture_output=True, text=True)
                    try:
                         result = subprocess.run(["python", module_path], capture_output=True, text=True, check=True)
                         await websocket.send(json.dumps({"result":{"output":result.stdout},"emit_type": 'condition_check_type_msg_return'}))
                    except subprocess.CalledProcessError as e:
                        await websocket.send(json.dumps({"result":{"output":e.stderr},"emit_type": 'condition_check_type_msg_return',"err":True}))
                    except FileNotFoundError:
                        await websocket.send(json.dumps({"result":{"output":"Python executable not found or script path is incorrect."},"emit_type": 'condition_check_type_msg_return',"err":True}))
                    except Exception as e:
                        await websocket.send(json.dumps({"result":{"output": f"{str(e)}"},"emit_type": 'condition_check_type_msg_return',"err":True}))
               elif parsed_message["type"] == "code_frame":
                    module_path = parsed_message["path"]
                    result = subprocess.run(["python", module_path], capture_output=True, text=True)
                    try:
                         result = subprocess.run(["python", module_path], capture_output=True, text=True, check=True)
                         await websocket.send(json.dumps({"result":{"output":result.stdout},"emit_type": 'codeFrames_check_type_msg_return'}))
                    except subprocess.CalledProcessError as e:
                        await websocket.send(json.dumps({"result":{"output":e.stderr},"emit_type": 'codeFrames_check_type_msg_return',"err":True}))
                    except FileNotFoundError:
                        await websocket.send(json.dumps({"result":{"output":"Python executable not found or script path is incorrect."},"emit_type": 'codeFrames_check_type_msg_return',"err":True}))
                    except Exception as e:
                        await websocket.send(json.dumps({"result":{"output": f"{str(e)}"},"emit_type": 'codeFrames_check_type_msg_return',"err":True}))

                    
                    

                    
    except Exception as a:
            pass

async def main():
    start_server = await websockets.serve(handle_connection, "localhost", 8765)
    print("WebSocket server started on ws://localhost:8765")
    await start_server.wait_closed()
asyncio.run(main())



