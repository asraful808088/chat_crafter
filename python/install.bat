@echo off
echo Installing Python dependencies...
pip install -r requirements.txt > install_log.txt 2>&1
echo Installation complete. Check install_log.txt for details.
pause
