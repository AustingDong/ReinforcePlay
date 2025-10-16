#!/bin/bash

echo "🚀 Starting ReinforcePlay..."
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.10 or higher."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Start backend
echo "📦 Starting Backend (FastAPI)..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

echo "✅ Backend starting on http://localhost:8000"
python main.py &
BACKEND_PID=$!

cd ..

# Start frontend
echo ""
echo "🎨 Starting Frontend (React + Vite)..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

echo "✅ Frontend starting on http://localhost:5173"
npm run dev &
FRONTEND_PID=$!

cd ..

# Wait for user interrupt
echo ""
echo "✨ ReinforcePlay is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Trap Ctrl+C and cleanup
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

# Wait for background processes
wait

