@echo off
for /f %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"
echo ========================================
echo   MAINFRAME SECURITY
echo ========================================
set /p code=Enter admin password: 
echo.
if /i "%code%"=="ZERODAY" (
  echo %ESC%[92mACCESS GRANTED%ESC%[0m
  echo Welcome, admin.
) else (
  echo %ESC%[91mACCESS DENIED%ESC%[0m
)