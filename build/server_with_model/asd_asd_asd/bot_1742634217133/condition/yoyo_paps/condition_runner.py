
from cat import ConditionTypes
from task2 import getCondition
from entities_box.mamax.generated import predict_entities

def run_condition(memo={}):
   return {
        "cat":getCondition(),
        "memo":{
            "data":"modidy"
        }
   }
