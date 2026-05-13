@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo === LevelUp Habit Tracker ===

REM -- Step 1: ensure Node.js is installed --
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js was not found.
    where winget >nul 2>nul
    if errorlevel 1 (
        echo winget is not available. Please install Node.js LTS from https://nodejs.org/ then re-run this script.
        pause
        exit /b 1
    )
    echo Installing Node.js LTS via winget ^(you may see a UAC prompt^)...
    winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
    if errorlevel 1 (
        echo Node.js installation failed. Please install manually from https://nodejs.org/ and re-run this script.
        pause
        exit /b 1
    )
    echo Node.js installed. Close this window and re-run start.bat so PATH updates take effect.
    pause
    exit /b 0
)

REM -- Step 2: install dependencies if missing --
if not exist "node_modules" (
    echo Installing dependencies ^(first run only^)...
    call npm install
    if errorlevel 1 (
        echo npm install failed. See errors above.
        pause
        exit /b 1
    )
)

REM -- Step 3: launch dev server --
echo.
echo Starting dev server. The app will open at http://localhost:5173
echo Press Ctrl+C in this window to stop.
echo.
call npm run dev

endlocal
