@echo off
setlocal
cd /d "%~dp0"

echo === LevelUp Desktop (production build) ===

REM Pre-req sanity
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js missing. Run start.bat first.
    pause
    exit /b 1
)
where cargo >nul 2>nul
if errorlevel 1 (
    echo Rust missing. Run desktop.bat once to install it.
    pause
    exit /b 1
)

REM Icons check
if not exist "src-tauri\icons\icon.ico" (
    echo.
    echo No icons in src-tauri\icons. The build will fail.
    echo Drop a square PNG ^(>=1024x1024^) into the project root as app-icon.png,
    echo then run: npm run tauri:icon -- ./app-icon.png
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" call npm install

echo.
echo Building LevelUp .exe / installer. This compiles Rust in release mode and
echo bundles the frontend. Expect 3-8 minutes on the first run.
echo Output: src-tauri\target\release\bundle\
echo.
call npm run tauri:build

endlocal
