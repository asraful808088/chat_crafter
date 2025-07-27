
from asd1231231231_condition_runner import run_condition
from asd1231231231_cat import ConditionTypes
import json

def run(memo={}):
    try:
        value = run_condition(memo)
        if value == None:
            return None
        if value["cat"] == None:
            return None
        if not isinstance(value["cat"], ConditionTypes):
            return None
        if not isinstance(value["memo"], dict):
            return None
        return json.dumps({
            "success":True,
            "cat":value["cat"].value,
            "memo":value["memo"]
        })
    except Exception as e:
        
        return json.dumps({
            "success":False,
            "error":str(e)
        })
