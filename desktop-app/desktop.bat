@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
REM If launched from the desktop-app subfolder, hop up to the project root.
if not exist "package.json" cd ..

echo === LevelUp Desktop (Tauri dev) ===

REM -- Step 1: Node.js --
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js was not found. Run start.bat first to install it.
    pause
    exit /b 1
)

REM -- Step 2: Rust toolchain --
REM Try PATH first; fall back to the rustup default install location.
set "CARGO_HOME=%USERPROFILE%\.cargo"
set "CARGO_BIN=%CARGO_HOME%\bin"
where cargo >nul 2>nul
if errorlevel 1 (
    if exist "%CARGO_BIN%\cargo.exe" (
        echo Found Rust at %CARGO_BIN% - adding to PATH for this session...
        set "PATH=%CARGO_BIN%;%PATH%"
    ) else (
        where winget >nul 2>nul
        if errorlevel 1 (
            echo winget unavailable. Install Rust manually from https://rustup.rs/ and re-run this script.
            pause
            exit /b 1
        )
        echo Installing rustup via winget ^(UAC prompt may appear^)...
        winget install -e --id Rustlang.Rustup --accept-source-agreements --accept-package-agreements
        if exist "%CARGO_BIN%\cargo.exe" (
            set "PATH=%CARGO_BIN%;%PATH%"
        ) else (
            echo Rust install did not produce %CARGO_BIN%\cargo.exe.
            echo Close this window and reopen PowerShell, then re-run this script.
            pause
            exit /b 1
        )
    )
)

REM Confirm cargo is now callable.
where cargo >nul 2>nul
if errorlevel 1 (
    echo cargo still not on PATH. Close this window and reopen PowerShell.
    pause
    exit /b 1
)

echo Using cargo:
for /f "delims=" %%v in ('cargo --version') do echo   %%v

REM -- Step 3: JS deps --
if not exist "node_modules" (
    echo Installing JS dependencies...
    call npm install
    if errorlevel 1 (
        echo npm install failed.
        pause
        exit /b 1
    )
)

REM -- Step 4: launch tauri dev --
echo.
echo Launching LevelUp desktop window. First run will compile Rust ^(~2-5 min^).
echo.
call npm run tauri:dev

endlocal
