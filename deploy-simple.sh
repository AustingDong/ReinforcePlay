#!/bin/bash

echo "🚀 Deploying ReinforcePlay (Simple Mode)..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# Backend Configuration
CORS_ORIGINS=*
HOST=0.0.0.0
PORT=8000
DEBUG=false
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
fi

# Backend Setup
echo ""
echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

echo -e "${GREEN}✅ Backend ready${NC}"
cd ..

# Frontend Setup
echo ""
echo -e "${BLUE}🎨 Setting up Frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build for production
echo "Building production bundle..."
npm run build

echo -e "${GREEN}✅ Frontend built${NC}"
cd ..

# Create run script
cat > run.sh << 'RUNSCRIPT'
#!/bin/bash

echo "🚀 Starting ReinforcePlay..."
echo ""

# Load environment variables
set -a
[ -f .env ] && . .env
set +a

# Start backend
cd backend
source venv/bin/activate
echo "✅ Backend starting on http://0.0.0.0:8000"
python main.py &
BACKEND_PID=$!
cd ..

# Start frontend (serve production build)
cd frontend
echo "✅ Frontend starting on http://0.0.0.0:80"
sudo npx serve -s dist -l 80 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✨ ReinforcePlay is running!"
echo "   Frontend: http://YOUR_SERVER_IP"
echo "   Backend:  http://YOUR_SERVER_IP:8000"
echo "   API Docs: http://YOUR_SERVER_IP:8000/docs"
echo ""
echo "Press Ctrl+C to stop"

# Trap Ctrl+C
trap "echo ''; echo '🛑 Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

wait
RUNSCRIPT

chmod +x run.sh

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✨ Deployment Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "To start the application:"
echo "  ./run.sh"
echo ""
echo "The app will be accessible at:"
echo "  Frontend: http://YOUR_SERVER_IP"
echo "  Backend:  http://YOUR_SERVER_IP:8000"
echo ""

