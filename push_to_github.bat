@echo off
title Pushing LogiPulse to GitHub (dattasai2424-code)
echo ======================================================================
echo   Pushing CA1 Project to GitHub: dattasai2424-code/ca1-shipment-management
echo ======================================================================
echo.
cd /d "%~dp0"
git branch -M main
git push -u origin main
echo.
echo ======================================================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS: Project pushed to GitHub!
    echo Visit: https://github.com/dattasai2424-code/ca1-shipment-management
) else (
    echo NOTE: If prompted, please authenticate with GitHub in your browser.
)
echo ======================================================================
pause
