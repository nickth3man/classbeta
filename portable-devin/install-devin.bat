@echo off
REM Portable Devin Installation Script
REM This batch file makes it easy to install Devin in any directory

echo.
echo ===============================================================
echo                   PORTABLE DEVIN INSTALLER
echo ===============================================================
echo.

REM Get target directory from argument or use current directory
set TARGET_DIR=%~1
if "%TARGET_DIR%"=="" set TARGET_DIR=%CD%

echo Installing Devin to: %TARGET_DIR%
echo.

REM Copy .windsurfrules to target directory
copy "%~dp0.windsurfrules" "%TARGET_DIR%\" > nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to copy .windsurfrules file.
    goto :error
) else (
    echo [SUCCESS] Copied .windsurfrules to target directory.
)

REM Check if Python is available
python --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Python not found in PATH. Please install dependencies manually.
) else (
    echo Installing Python dependencies...
    python -m pip install -r "%~dp0requirements.txt"
    if %ERRORLEVEL% neq 0 (
        echo [WARNING] Some dependencies could not be installed.
    ) else (
        echo [SUCCESS] Dependencies installed.
    )
    
    REM Check if playwright is needed and install browsers
    findstr /c:"playwright" "%~dp0requirements.txt" > nul
    if %ERRORLEVEL% equ 0 (
        echo Installing Playwright browsers...
        python -m playwright install
        if %ERRORLEVEL% neq 0 (
            echo [WARNING] Failed to install Playwright browsers.
        ) else (
            echo [SUCCESS] Playwright browsers installed.
        )
    )
)

echo.
echo ===============================================================
echo                  INSTALLATION COMPLETE
echo ===============================================================
echo.
echo Your portable Devin is now ready to use!
echo.
echo To verify the installation, run:
echo   python %~dp0devin_utils.py verify
echo.
echo Remember to configure your API keys in the .env file.
goto :end

:error
echo.
echo Installation encountered errors. Please check the messages above.

:end
echo.
