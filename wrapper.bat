@echo off
REM Extract and run Energy Game .exe with bundled files

setlocal enabledelayedexpansion

REM Create temp directory
set TEMP_DIR=%TEMP%\EnergyGame-%RANDOM%
mkdir %TEMP_DIR%

REM Copy this exe to temp and run it with environment variable
copy "%~f0" "%TEMP_DIR%\game.exe"
cd /d "%TEMP_DIR%"

REM Extract dependencies (this would need the files packed with the exe)
node game.exe

goto :EOF
