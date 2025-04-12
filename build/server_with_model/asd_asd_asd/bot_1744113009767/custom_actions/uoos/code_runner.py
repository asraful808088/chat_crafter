# from task.yoyotask.code_runner import run_task
import os
import shutil
import os

def create_directory_on_desktop(dir_name):
    """
    Creates a new directory on the user's desktop.

    Parameters:
    dir_name (str): The name of the directory to be created.
    """
    try:
        # Get the user's desktop path
        desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
        
        # Define the new directory path
        new_dir_path = os.path.join(desktop_path, dir_name)
        
        # Create the directory if it doesn't already exist
        os.makedirs(new_dir_path, exist_ok=True)
        
        print(f"Directory created: {new_dir_path}")
    except Exception as e:
        print(f"An error occurred: {e}")


        
def run_task(memo={}):
    # return {
    #             "memo":memo,
    #             "response":"asda12",
    #             "data":{}
    # }
    create_directory_on_desktop("demoxxx")
    return {
                "memo":memo,
                "txt":"all clear successfully",
    }
