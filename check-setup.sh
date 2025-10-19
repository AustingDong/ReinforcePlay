#!/bin/bash

echo "🔍 Checking ReinforcePlay Setup..."
echo ""

# Check backend
echo "📦 Backend:"
if [ -d "backend/venv" ]; then
    echo "  ✅ Virtual environment exists"
else
    echo "  ❌ Virtual environment missing"
fi

if [ -f "backend/requirements.txt" ]; then
    echo "  ✅ requirements.txt found"
else
    echo "  ❌ requirements.txt missing"
fi

# Check frontend
echo ""
echo "🎨 Frontend:"
if [ -d "frontend/node_modules" ]; then
    echo "  ✅ Node modules installed"
else
    echo "  ❌ Node modules missing - run: cd frontend && npm install"
fi

if [ -d "frontend/dist" ]; then
    FILE_COUNT=$(ls -1 frontend/dist/ 2>/dev/null | wc -l)
    echo "  ✅ Build folder exists ($FILE_COUNT files)"
    if [ $FILE_COUNT -lt 2 ]; then
        echo "  ⚠️  Build folder seems empty - run: cd frontend && npm run build"
    fi
else
    echo "  ❌ Build folder missing - run: cd frontend && npm run build"
fi

# Check configuration
echo ""
echo "⚙️  Configuration:"
if [ -f ".env" ]; then
    echo "  ✅ .env file exists"
    cat .env
else
    echo "  ❌ .env file missing"
fi

echo ""
echo "🔍 Port Status:"
if command -v lsof &> /dev/null; then
    echo "  Port 8000:"
    lsof -i :8000 || echo "    Not in use"
    echo "  Port 80:"
    sudo lsof -i :80 || echo "    Not in use"
else
    echo "  lsof not available, install with: sudo yum install lsof"
fi

echo ""
echo "================================"

