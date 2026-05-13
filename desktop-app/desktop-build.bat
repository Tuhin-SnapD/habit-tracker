@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
if not exist "package.json" cd ..

echo === LevelUp Desktop (production build) ===

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js missing. Run start.bat first.
    pause
    exit /b 1
)

REM Cargo: PATH or rustup fallback path
set "CARGO_HOME=%USERPROFILE%\.cargo"
set "CARGO_BIN=%CARGO_HOME%\bin"
where cargo >nul 2>nul
if errorlevel 1 (
    if exist "%CARGO_BIN%\cargo.exe" (
        echo Found Rust at %CARGO_BIN% - adding to PATH for this session...
        set "PATH=%CARGO_BIN%;%PATH%"
    ) else (
        echo Rust missing. Run desktop.bat once to install it.
        pause
        exit /b 1
    )
)

where cargo >nul 2>nul
if errorlevel 1 (
    echo cargo still not on PATH. Close this window and reopen PowerShell.
    pause
    exit /b 1
)

if not exist "src-tauri\icons\icon.ico" (
    echo.
    echo No icons in src-tauri\icons. The build will fail.
    echo Drop a square PNG ^(^>=1024x1024^) into the project root as app-icon.png,
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
