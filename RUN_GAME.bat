@echo off
setlocal enabledelayedexpansion

REM Energy Game Launcher
REM This is the standalone launcher for the Energy Game

echo.
echo ===================================
echo   Energy Game - Starting
echo ===================================
echo.

REM Change to the script's directory
cd /d "%~dp0"

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is required but not installed
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then try running this file again.
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js detected
echo.

REM Build if needed
if not exist "backend\dist\index.js" (
    echo Building backend...
    call npm --prefix backend run build
)

if not exist "frontend\dist\index.html" (
    echo Building frontend...
    call npm --prefix frontend run build
)

REM Start the server in a new window (hidden from user)
echo Starting game server...

start "" /B node backend/dist/index.js 

REM Wait for server to start
timeout /t 3 /nobreak >nul

echo Opening game in browser...
echo.

REM Open browser
start http://localhost:3000

echo ===================================
echo Energy Game is running!
echo If the browser didn't open, visit:
echo   http://localhost:3000
echo ===================================
echo.
echo Close this window to stop the game.
pause
