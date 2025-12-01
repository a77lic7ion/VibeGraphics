@echo off
echo.
echo ===================================
echo  Starting VibeGraphics
echo ===================================
echo.

echo Starting Backend Server...
start "VibeGraphics Backend" cmd /k "cd backend && python api_server.py"

timeout /t 3 /nobreak > nul

echo Starting Frontend...
start "VibeGraphics Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak > nul

echo.
echo ===================================
echo  VibeGraphics is Starting!
echo ===================================
echo.
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:5173
echo.
echo Press any key to open the application in your browser...
pause > nul

start http://localhost:5173

echo.
echo Application is running!
echo Close this window to keep the servers running.
echo.
