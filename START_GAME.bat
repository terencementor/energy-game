@echo off
setlocal enabledelayedexpansion

echo Energy Game - Starting...
echo.

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM Check if node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found
echo ✓ Starting backend server...
echo.

REM Build if not already built
if not exist "backend\dist\index.js" (
    echo Building project...
    call npm --prefix backend run build
)

if not exist "frontend\dist\index.html" (
    echo Building frontend...
    call npm --prefix frontend run build
)

REM Start the backend server
start "Energy Game Server" /B cmd /c "cd backend && node dist/index.js"

REM Wait a bit for the server to start
timeout /t 3 /nobreak >nul

REM Open the game in the default browser
echo Opening game in browser...
start http://localhost:3000

REM Keep the batch window open to show logs (optional - comment out to close automatically)
REM pause
