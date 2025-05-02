import os
import sys

base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
sys.path.append(base_path)

for root, dirs, files in os.walk(base_path):
    sys.path.append(os.path.abspath(root))

import  run 
print(run.run())
