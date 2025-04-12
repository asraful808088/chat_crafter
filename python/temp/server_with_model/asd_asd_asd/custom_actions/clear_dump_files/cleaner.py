import os
import shutil

temp_path = os.getenv("TEMP")  
all_users_temp_path = os.getenv("ALLUSERSPROFILE") + r"\\Temp"  
prefetch_path = r"C:\\Windows\\Prefetch"
windows_temp_path = r"C:\\Windows\\Temp" 

def delete_files_in_folder(folder):
    """ Deletes all files and folders inside the given folder """
    if os.path.exists(folder):
        for file in os.listdir(folder):
            file_path = os.path.join(folder, file)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path) 
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)  
            except Exception as e:
                pass  # Ignore errors


def clean_now():
    delete_files_in_folder(temp_path)
    delete_files_in_folder(all_users_temp_path)
    delete_files_in_folder(prefetch_path)
    delete_files_in_folder(windows_temp_path)
    


