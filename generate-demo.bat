@echo off
title Fuel Friendly - Automated Demo Generator
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║           ⛽ FUEL FRIENDLY AUTOMATED DEMO GENERATOR          ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [INFO] Starting automated demo generation process...
echo.

REM Navigate to frontend directory
cd /d "%~dp0frontend"

echo [STEP 1/4] Starting development server...
start "" npm run dev
timeout /t 10 /nobreak >nul

echo [STEP 2/4] Opening automated demo page...
timeout /t 5 /nobreak >nul
start "" http://localhost:3000/auto-demo.html

echo [STEP 3/4] Waiting for demo generation...
echo.
echo The demo will generate automatically in your browser.
echo Please allow screen recording permissions when prompted.
echo.
echo Estimated time: 60-90 seconds
echo.

REM Wait for demo completion (adjust as needed)
timeout /t 90 /nobreak >nul

echo [STEP 4/4] Checking for generated video file...
echo.

REM Check Downloads folder for the generated MP4
set DOWNLOADS=%USERPROFILE%\Downloads
if exist "%DOWNLOADS%\fuel-friendly-demo-*.mp4" (
    echo [SUCCESS] Demo video generated successfully!
    echo.
    echo File location: %DOWNLOADS%
    echo File name: fuel-friendly-demo-*.mp4
    echo.
    echo Opening downloads folder...
    explorer "%DOWNLOADS%"
) else (
    echo [WARNING] Video file not found in downloads folder
    echo Please check your browser downloads
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║                    PROCESS COMPLETED                         ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Press any key to close...
pause >nul