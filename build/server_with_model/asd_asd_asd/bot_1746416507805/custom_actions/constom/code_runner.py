from entities_box.mama.generated import predict_entities
import json
def run_task(memo={}):
    # return {
    #             "memo":memo,
    #             "response":"",
    #             "data":{
                   
    #             }
    # }
    # item = memo["last_intents_info"]
    
    
    return {
                "memo":memo,
                "txt": json.dumps({"asd":predict_entities("this is my number 01913222929")}) ,
    }
