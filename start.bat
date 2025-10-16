@echo off
echo Starting ReinforcePlay...
echo.

REM Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python 3.10 or higher.
    pause
    exit /b 1
)

REM Check Node
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

REM Start Backend
echo Starting Backend (FastAPI)...
cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -q -r requirements.txt

echo Backend starting on http://localhost:8000
start /b python main.py

cd ..

REM Start Frontend
echo.
echo Starting Frontend (React + Vite)...
cd frontend

if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
)

echo Frontend starting on http://localhost:5173
start /b npm run dev

cd ..

echo.
echo ReinforcePlay is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop all services
pause >nul

