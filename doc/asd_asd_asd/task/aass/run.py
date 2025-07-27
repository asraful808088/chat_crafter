
from aass_task_code_runners import run_task
import json
def run(params={},memo=None):
        try:
                result =  run_task(params,memo)
                result["data"]
                try:
                        return  json.dumps({
                        "success":True,
                        "result":result["data"],
                        "memo":result["memo"]}) 
                        
                except:
                        return  json.dumps({
                        "success":True,
                        "result":result["data"],
                        "memo":memo}) 
                
        except Exception as a:
                return  json.dumps({
                        "success":False,
                        "result":str(a)
                }) 
