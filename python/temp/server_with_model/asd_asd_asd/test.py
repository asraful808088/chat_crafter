from handler import create_conv_controller
def mama(res):
    try:
        res["success"]
        print(res)
    except:
        pass


create_conv_controller("Show active users",callback=mama)