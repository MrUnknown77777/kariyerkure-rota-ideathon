@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Bu demo icin Node.js gerekli. https://nodejs.org/ adresinden LTS surumu kurulabilir.
  pause
  exit /b 1
)
echo.
echo Kariyer Kure - Ideathon Prototipi
echo Tarayicida ac: http://127.0.0.1:3100
echo Bu pencereyi sunum boyunca acik tut.
echo.
node serve.mjs
pause
