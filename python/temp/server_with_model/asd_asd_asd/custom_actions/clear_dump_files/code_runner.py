from cleaner import delete_files_in_folder
from cleaner import clean_now
def run_task(memo={}):
    clean_now()
    
    return {
                "memo":memo,
                "txt":"clear your all dump files",
    }
