
   
from controller import CovController
def create_conv_controller(input,callback,m=None):
    conv = None
    if m != None: 
        conv = CovController(None, m)
    else:
        conv = CovController()

    def onRespobseState(data_info):
        if callback != None:
            callback(data_info)
    def onRespobse(data_info):
        if callback != None:
            callback(data_info)
    def onRespobseScripts(data_info):
        if callback != None:
            callback(data_info)
    conv.on_respose = onRespobse
    conv.on_respose_stage = onRespobseState
    conv.on_respose_script = onRespobseScripts 
    conv.input(input)
   
   
   
   
   
   