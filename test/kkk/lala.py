import os
import sys

# Get the path to the 'test' directory
base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(base_path)

from kk.mama import mama
# mama()