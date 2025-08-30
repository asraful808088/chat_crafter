import json
from handler import create_conv_controller

sto = None
last_sent = None  # store last message to avoid duplicates

def res(ress):
    global sto, last_sent
    # Update conversation state
    if 'store_covtimeline' in ress:
        sto = ress
    # Only print unique messages
    elif 'sent' in ress:
        if ress['sent'] != last_sent:
            last_sent = ress['sent']
            print('------------')
            print('------------')
            print('------------')
            print(ress['sent'])
            print('------------')
            print('------------')
            print('------------')

# Send inputs to conversation controller
create_conv_controller("hi", res, sto)
create_conv_controller("Goodbye", res, sto)
create_conv_controller("i want to create account", res, sto)
create_conv_controller(
    "this is my email asraful@gmail.com username asraful password asrafulttrriii",
    res,
    sto
)
create_conv_controller("Goodbye", res, sto)
