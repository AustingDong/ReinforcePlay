#!/bin/bash

echo "🚀 Starting ReinforcePlay on public ports..."
echo ""

# Load environment variables
set -a
[ -f .env ] && . .env
set +a

# Default values
HOST=${HOST:-0.0.0.0}
PORT=${PORT:-8000}

# Kill existing processes on ports
echo "🧹 Checking for existing processes..."
sudo lsof -ti:80 | xargs sudo kill -9 2>/dev/null
lsof -ti:$PORT | xargs kill -9 2>/dev/null

# Start backend
echo "📦 Starting Backend on $HOST:$PORT..."
cd backend
source venv/bin/activate

# Export environment variables for Python
export HOST=$HOST
export PORT=$PORT
export CORS_ORIGINS=${CORS_ORIGINS:-*}

python main.py &
BACKEND_PID=$!
echo "✅ Backend PID: $BACKEND_PID"
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend on $HOST:80..."
cd frontend

# Check if dist exists
if [ ! -d "dist" ]; then
    echo "Building frontend..."
    npm run build
fi

# Serve on port 80 (requires sudo)
sudo npx serve -s dist -l 80 &
FRONTEND_PID=$!
echo "✅ Frontend PID: $FRONTEND_PID"
cd ..

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")

echo ""
echo "================================================"
echo "✨ ReinforcePlay is LIVE!"
echo "================================================"
echo ""
echo "🌐 Access your app at:"
echo "   Frontend: http://$PUBLIC_IP"
echo "   Backend:  http://$PUBLIC_IP:$PORT"
echo "   API Docs: http://$PUBLIC_IP:$PORT/docs"
echo ""
echo "📊 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "🛑 To stop: Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Trap Ctrl+C
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID 2>/dev/null; sudo kill $FRONTEND_PID 2>/dev/null; exit 0" INT

# Keep script running
wait

