@echo off
echo Starting local server for Tic Tac Toe...
echo.
echo Choose an option:
echo 1. Python 3 HTTP Server (port 8000)
echo 2. Python 2 HTTP Server (port 8000) 
echo 3. Node.js serve (if installed)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Starting Python 3 server...
    python -m http.server 8000
) else if "%choice%"=="2" (
    echo Starting Python 2 server...
    python -m SimpleHTTPServer 8000
) else if "%choice%"=="3" (
    echo Starting Node.js serve...
    npx serve -p 8000 .
) else (
    echo Invalid choice. Starting Python 3 server by default...
    python -m http.server 8000
)

echo.
echo Server should be running at: http://localhost:8000
echo Open this URL in your browser to test the application
echo.
echo Files to test:
echo - index.html (original version)
echo - index-oop.html (new OOP version)
echo - debug.html (debug version)
echo.
pause
