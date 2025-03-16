from condition_runner import run_condition
from cat import ConditionTypes

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
        return {
            "success":True,
            "cat":value["cat"].value,
            "memo":value["memo"]
        }
    except Exception as e:
        return {
            "success":False,
            "error":e
        }