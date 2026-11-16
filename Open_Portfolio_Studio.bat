@echo off
setlocal
cd /d "%~dp0"

echo Starting Portfolio Studio...
where python >nul 2>nul
if not errorlevel 1 (
  python studio\server.py %*
  goto :check_err
)

where py >nul 2>nul
if not errorlevel 1 (
  py -3 studio\server.py %*
  goto :check_err
)

echo [ERROR] Python 3 was not found on PATH.
pause
exit /b 1

:check_err
if errorlevel 1 (
  echo.
  echo [ERROR] Failed to launch Portfolio Studio.
  echo Make sure Python 3 is installed and available on your PATH.
  pause
  exit /b 1
)
