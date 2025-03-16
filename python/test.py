import sys
import os
sys.path.append(os.path.abspath("E:/project/nuxt/chat_crafter"))
sys.path.append(os.path.abspath("E:/project/nuxt/chat_crafter/doc"))
base_path = "E:/project/nuxt/chat_crafter/doc"
sys.path.append(os.path.abspath(base_path))

for root, dirs, files in os.walk(base_path):
    sys.path.append(os.path.abspath(root))

from doc.asd_asd_asd.condition.another_text.run import run
run()