from entities_box.xx.generated import predict_entities
def run_task(memo={}):
    
    print(predict_entities(memo['last_intents_info']['sent']))
    print('--------------')
    print('--------------')
    print(memo['last_intents_info'])


    print('--------------')
    print('--------------')
    return {
                "memo":memo,
                "txt":"user create successfully",
    }
