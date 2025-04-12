from controller import CovController
def onResStage(e):
   print(e)
def onRes(e):
   print(e)
   pass
s =  CovController()
s.on_respose_stage = onResStage
s.on_respose = onRes

s.input("ASD",3)
s.input("ASD",1)

# s.input("ASD",1)
# s.input("ASD",1)
