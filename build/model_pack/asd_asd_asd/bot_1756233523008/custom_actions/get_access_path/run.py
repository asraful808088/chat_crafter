
from get_access_path_custom_code_runners import run_task
import json
def run(memo={}):
      try:   
        result  = run_task(memo)
        try:
                result["response"]
                try:
                      result["data"]
                      try:
                        return json.dumps({
                          "success":True,
                          "memo":result["memo"],
                          "response":result["response"],
                          "data":result["data"]})
                      except:
                        return json.dumps({
                          "success":True,
                          "memo":memo,
                          "response":result["response"],
                          "data":result["data"]}) 
                except:
                      try:
                            return json.dumps({
                              "success":True,
                              "memo":result["memo"],
                              "response":result["response"],
                              "data":None})
                      except:
                            return json.dumps({
                              "success":True,
                              "memo":memo,
                              "response":result["response"],
                              "data":None})
        except:
                result["txt"]
                try:
                      return  json.dumps({
                                "success":True,
                                "memo":result["memo"],
                                "txt":result["txt"]}) 
                except:
                        return json.dumps({
                                "success":True,
                                "memo":memo,
                                "txt":result["txt"]}) 
      except Exception as a:
            return json.dumps({
                                "success":False,
                                 "result":str(a)})

