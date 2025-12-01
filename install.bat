@echo off
echo.
echo ===================================
echo  VibeGraphics - Installation
echo ===================================
echo.

echo [1/2] Installing backend dependencies...
cd backend
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [2/2] Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

cd..

echo.
echo ===================================
echo  Installation Complete!
echo ===================================
echo.
echo To start the application, run: start.bat
echo.
pause
