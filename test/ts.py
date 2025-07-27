import os
import shutil
import getpass

# Delete all files/folders in a directory
def clear_folder(path):
    if not os.path.exists(path):
        return

    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.remove(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path, ignore_errors=True)
        except Exception:
            pass  # ignore permission errors or locked files

# Main cleanup function (no admin required)
def clear_junk():
    username = getpass.getuser()
    paths_to_clear = [
        os.getenv('TEMP'),
        os.getenv('TMP'),
        f"C:\\Users\\{username}\\AppData\\Local\\Temp",
        f"C:\\Users\\{username}\\AppData\\Roaming\\Microsoft\\Windows\\Recent"
        # C:\Windows\Temp and Prefetch removed due to permission restrictions
    ]

    for path in paths_to_clear:
        clear_folder(path)

    print("✅ Junk/cache files cleaned (non-admin only).")

# Call function mid-program or directly
clear_junk()
