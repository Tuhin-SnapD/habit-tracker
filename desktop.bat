@echo off
setlocal
cd /d "%~dp0"

echo === LevelUp Desktop (Tauri dev) ===

REM Step 1: Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js was not found. Run start.bat first to install it.
    pause
    exit /b 1
)

REM Step 2: Rust toolchain
where cargo >nul 2>nul
if errorlevel 1 (
    echo Rust toolchain was not found.
    where winget >nul 2>nul
    if errorlevel 1 (
        echo winget unavailable. Install Rust manually from https://rustup.rs/ and re-run this script.
        pause
        exit /b 1
    )
    echo Installing rustup via winget ^(UAC prompt may appear^)...
    winget install -e --id Rustlang.Rustup --accept-source-agreements --accept-package-agreements
    if errorlevel 1 (
        echo Rust install failed. Install manually from https://rustup.rs/
        pause
        exit /b 1
    )
    echo Rust installed. Close this window and re-run desktop.bat so PATH updates take effect.
    pause
    exit /b 0
)

REM Step 3: WebView2 runtime sanity note
echo (Windows 11 ships with WebView2 — no install needed.)

REM Step 4: JS deps
if not exist "node_modules" (
    echo Installing JS dependencies...
    call npm install
    if errorlevel 1 (
        echo npm install failed.
        pause
        exit /b 1
    )
)

REM Step 5: launch tauri dev — this opens a native window
echo.
echo Launching LevelUp desktop window. First run will compile Rust ^(~2-5 min^).
echo.
call npm run tauri:dev

endlocal
