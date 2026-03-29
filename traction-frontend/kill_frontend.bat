@echo off
set PORT=5173
echo.
echo  ╔══════════════════════════════════════╗
echo  ║      Stopping Traction Frontend      ║
echo  ║      Port: %PORT%                     ║
echo  ╚══════════════════════════════════════╝
echo.

setlocal
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT%') do (
    echo Terminating process PID: %%a
    taskkill /f /pid %%a
)
endlocal

echo.
echo  Frontend stopped successfully.
pause
