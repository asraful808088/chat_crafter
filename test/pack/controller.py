import json
import os
import sys
import random
current_file_path = os.path.abspath(__file__)
base_path = current_file_path.replace("controller.py","")
sys.path.append(os.path.abspath(base_path))
for root, dirs, files in os.walk(base_path):
    sys.path.append(os.path.abspath(root))

# some problem 
# 1st on_respose_stage and on_respose code duplication

file_path = os.path.join(current_file_path.replace("controller.py",""), "scripts", "scripts.json")
condition_path = os.path.join(current_file_path.replace("controller.py",""), "condition")
response_path = os.path.join(current_file_path.replace("controller.py",""), "response")
action_path = os.path.join(current_file_path.replace("controller.py",""), "custom_actions")
try:
    with open(file_path, "r") as file:
        content = json.load(file) 
except json.JSONDecodeError:
    print("Error: Invalid JSON format.")
script = content["script"]


class CovController():
    
    def __init__(self,script:list):
        self.script = script
        self.store_covtimeline = []
        self.current_index = 0
        self.current_obj = None
        self.current_stap_obj = None
        self.on_respose_stage:function = None
        self.on_respose:function = None
        self.old_obj = None
        self.memo = {}

    def input(self,sent,index=0):
        if self.current_obj == None:
            self.current_obj  = self.find_conv(sent)
            if self.current_obj !=None:
              response = self.current_obj["list_of_response"]
              intent_info = {
                 "id":self.current_obj["id"],"sent":sent,"target":self.current_obj["target"]
              }
              self.ans_response(self.current_obj,self.current_obj["target"],response,intent_info)
              self.store_covtimeline.append(intent_info)
            else:
               self.store_covtimeline = []
            return
        else:
           prediction_value = self.prediction(sent,index)
           print(len(self.store_covtimeline))
           self.conv_recreation(self.current_obj,  self.store_covtimeline  ,prediction_value["value"],sent=sent)
     
    def prediction(self,sent,v=0):
      if v==0:
        return {
        "value":"greeting"
        }
      elif v==1:
         return {
        "value":"ask_name"
        }
      elif v==2:
         return {
        "value":"greeting"
        }
      elif v==3:
         return {
        "value":"bye"
        }

    def ans_response(self,item,prediction,list_of_res,l={},fallback = False):
         if self.on_respose_stage != None:
            self.on_respose_stage({"stage":"before_res","type":item["type"],"intent":prediction })
         for itemRes in list_of_res:
            if self.on_respose_stage != None:
               self.on_respose_stage({"stage":"run_res","res":itemRes,"type":item["type"] ,"intent":prediction})
            if self.on_respose != None:
                 if itemRes["type"] == 'response':
                   result = self.response_handler(itemRes["target"])
                   if result:
                       if fallback:
                          reassin = result
                          reassin["fallback"]=True
                          self.on_respose(reassin)
                       else:
                          self.on_respose(result)
                   else:
                      self.on_respose({'success': True, 'sent': 'response unset','fallback':fallback})
                      
                 else:
                    result = self.custom_action_handler(itemRes["target"],l=l)
                    if result:
                        if fallback:
                           reassin = result
                           reassin["fallback"]=True
                           self.on_respose(reassin)
                        else:
                           self.on_respose(result)
                    else:
                      self.on_respose({'success': True, 'sent': 'response unset','fallback':fallback})
         if self.on_respose_stage != None:
            self.on_respose_stage({"stage":"after_res","type":item["type"] ,"intent":prediction})



       
    def conv_recreation(self,obj, current_stap_id,prediction=None,sent = ""):
      if len(current_stap_id) > 1 :
         if len(obj["list_of_store"]) > 0:
            for item in obj["list_of_store"]:
                    if current_stap_id[1]["id"] == item["id"]:
                      self.conv_recreation(item,current_stap_id[1:],prediction=prediction)
                      break
      else:
        access_fail = True
        for item in obj["list_of_store"]:
           if item["target"].replace(" ","_") == prediction:
              if item["type"] == "t_next":
                intent_info = {"id":item["id"],"sent":sent,"target":item["target"]}
                self.ans_response(item,prediction,item["list_of_response"],intent_info)
                self.store_covtimeline.append(intent_info)
                access_fail = False
                break
              
              elif item["type"] == "t_forwards":
                if self.on_respose_stage != None:
                   self.on_respose_stage({"stage":"before_res","type":item["type"],"intent":prediction})
                result  = self.check_backward_obj(self.current_obj,self.store_covtimeline,item["target_id"],self.store_covtimeline,index=0,init=True)
                self.store_covtimeline = result[1]
                intent_info = {"id":result[0]["id"],"sent":sent,"target":prediction}
                self.ans_response(item,prediction,result[2],intent_info)
                access_fail = False
                break
              
              elif item["type"] == "add_condition":
                isAllow = self.condition_handler(item['condition'],item["condition_type"],{
                   "id":item["id"],"sent":sent,"target":item["target"]
                })
                if isAllow:
                  intent_info = {"id":item["id"],"sent":sent,"target":item["target"]}
                  self.ans_response(item,prediction,item["list_of_response"],intent_info)
                  self.store_covtimeline.append(intent_info)
                  access_fail = False
                  break
                

        if access_fail:
            if prediction == obj["target"].replace(" ","_") :
               intent_info = {"id":obj["id"],"sent":sent,"target":obj["target"]}
               self.ans_response(obj,prediction,obj["list_of_response"],intent_info)
               access_fail = False

            if access_fail :  
               for item in obj["list_of_next_stap"]:
                  if item["type"] == "serial_break_add":
                     if item["val"] :
                        self.current_obj  = self.find_conv("sent",3)
                        response = self.current_obj["list_of_response"]
                        self.store_covtimeline = []
                        intent_info = {
                           "id":self.current_obj["id"],"sent":sent,"target":self.current_obj["target"]
                        }
                        self.store_covtimeline.append(intent_info)
                        self.ans_response(self.current_obj,self.current_obj["target"],response,intent_info)
                        access_fail = False
                        break
            if access_fail:  
               for item in obj["list_of_store"]:
                  if item["type"] == "fallback":
                     if len(item["list_of_response"]) != 0:
                        intent_info = {"id":item["id"],"sent":sent,"target":item["target"]}
                        self.ans_response(item,prediction,item["list_of_response"],intent_info,True)
                        access_fail = False
                        break



            if access_fail:
               if self.on_respose_stage != None:
                  self.on_respose_stage({"stage":"before_res","type":obj["type"],"intent":prediction,"default_fallback":True })
               if self.on_respose != None:  
                  response  = self.response_handler("default_fallback")
                  if self.on_respose_stage != None:
                   self.on_respose_stage({"stage":"run_res","type":obj["type"] ,"intent":prediction,"default_fallback":True})
                  if response:
                       self.on_respose(response)
                  else:
                     self.on_respose({'success': True, 'sent': 'response unset',"from":"default_fallback"})
               if self.on_respose_stage != None:
                  self.on_respose_stage({"stage":"after_res","type":obj["type"],"intent":prediction,"default_fallback":True })
               access_fail = False
               
            

            
           
                
              
    def condition_handler(self,name,ctype,last_intent={}):
              base_path_runpy = f"{condition_path}\\{name}\\run.py"
              result = json.loads(self.code_exe(base_path_runpy,"run",l=last_intent))
              if result["success"]:
                 self.memo = result["memo"]
                 return ctype==result["cat"]
              else:
                 print(result)
                 return False    
              


       
    

    def custom_action_handler(self,name,l={}):
       base_path_runpy = f"{action_path}\\{name}\\run.py"
       result = json.loads(self.code_exe(base_path_runpy,"run",l=l))
       ans = []
       if result["success"]:
                 map_sents = []
                 try:
                    self.memo = result["memo"]
                    with open(f"{response_path}\\{result["response"]}\\{result["response"]}.json", "r") as file:
                        mainContent = json.load(file)
                    with open(f"{response_path}\\{result["response"]}\\{'regenerate'}.json", "r") as file:
                        generateContent = json.load(file)
                    for item in mainContent["list_of_intent"]:
                       map_sents.append({"gen": item["mainsent"],"map_sent":item["mapword"]})
                    for item in generateContent["sents"]:
                       for subitem in item["list"]:
                          map_sents.append({"gen": subitem["gen"],"map_sent":subitem["map_sent"]})
                    random_item = random.choice(map_sents)
                    result = self.sentModify(random_item,result["data"])
                    ans.append(result)
                    
                 except:
                    try:
                       ans.append(result["txt"])
                    except:
                       pass
                    
                 if len(ans) !=0:
                    return {
                       "success":True,
                       "sent":ans[0]
                    }
                 else:
                    return {
                       "success":True,
                       "sent":"resonse unset"
                    }
       else:
                 print(result)
                 return False  
       


    def sentModify(self,p, cng):
      if not cng:
          return p["gen"]
      key_list = list(cng.keys())[0] 
      name_replacement = cng[key_list] 
      split_word = p["gen"].split(" ")
      map_sent = p["map_sent"]
      new_sentence = []
      name_started = False  
      for i, tag in enumerate(map_sent):
          if tag == "B-NAME":  
              new_sentence.append(name_replacement)
              name_started = True
          elif tag == "J-NAME" and name_started: 
              continue  
          else:
              new_sentence.append(split_word[i])
      return " ".join(new_sentence)

    def response_handler(self,name):
         all_response = []
         with open(f"{response_path}\\{name}\\{name}.json", "r") as file:
            mainContent = json.load(file)
         with open(f"{response_path}\\{name}\\{'regenerate'}.json", "r") as file:
            generateContent = json.load(file)
         try:
            for item in mainContent["list_of_intent"]:
               try:
                  all_response.append(item["mainsent"])
               except:
                  pass
         except:
            pass
         try:
            for item in generateContent["sents"]:
                  try:
                     for item2 in item["list"]:
                        if  item2["gen"] not in all_response:
                            all_response.append(item2["gen"])
                  except:
                     pass
         except:
            pass
         if len(all_response) != 0: 
            random_item = random.choice(all_response)
            return {
               "success":True,
               "sent":random_item
            }
         else:
             return None


         
    def code_exe(self,path,module_name = "run",l={}):
       import importlib.util
       import sys
       module_path = path
       module_name = module_name
       spec = importlib.util.spec_from_file_location(module_name, module_path)
       module = importlib.util.module_from_spec(spec)
       sys.modules[module_name] = module
       spec.loader.exec_module(module)
       inject_intent = self.memo
       inject_intent["last_intents_info"] = l
       getResult = module.run(inject_intent)
       return getResult
    
    def read_file(self,path):
       try:
          with open(path, "r") as file:
              return file 
       except json.JSONDecodeError:
          return None
       

    def check_backward_obj(self,obj,track_list,target_id,fulltimeline,index=1,init=False):
       returnObj = None
       if init:
          if obj["id"] == target_id:
             returnObj = [obj,fulltimeline[:index+1],obj["list_of_response"]]
       if len(track_list) > 1 and returnObj == None:
         if len(obj["list_of_store"]) > 0:
            for item in obj["list_of_store"]:
                    if target_id == item["id"]:
                       returnObj = [item,fulltimeline[:index+1],item["list_of_response"]]
                       break
                    if track_list[1]["id"] == item["id"]:
                      returnObj = self.check_backward_obj(item,track_list[1:],target_id,fulltimeline,index=index+1)
                      break
       return returnObj
        

    def find_conv(self,sent,v=0):
       for item in self.script:
          target_model = self.prediction(sent,v=v)
          if item["target"].replace(" ","_") ==  target_model["value"]:
             return item

       
# t_forwards
# t_next
# fallback
# list_of_next_stap -> serial_break_add -> val
# add_condition

def onResStage(e):
   print(e)
def onRes(e):
   print(e)
   pass
s =  CovController(script)
# s.on_respose_stage = onResStage
s.on_respose = onRes
s.input("ASD")
s.input("ASD",1)
s.input("ASD",1)
s.input("ASD",1)
s.input("ASD",1)





