#!/bin/bash

set -e  # Exit on error

echo "🔄 Updating ReinforcePlay on AWS"
echo "================================================"
echo ""

# Get current directory
CURRENT_DIR=$(pwd)

# Step 1: Pull latest code (if using git)
if [ -d ".git" ]; then
    echo "📥 Step 1/4: Pulling latest code..."
    git pull
    echo ""
else
    echo "📝 Step 1/4: Skipping git pull (not a git repo)"
    echo ""
fi

# Step 2: Update backend dependencies
echo "🐍 Step 2/4: Updating backend..."
cd backend

if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    pip install --upgrade pip --quiet
    pip install -r requirements.txt --quiet
    deactivate
    echo "✅ Backend dependencies updated"
else
    echo "⚠️  Virtual environment not found. Run ./aws-setup.sh first"
    exit 1
fi

cd ..
echo ""

# Step 3: Rebuild frontend
echo "🎨 Step 3/4: Rebuilding frontend..."
cd frontend

# Update dependencies if package.json changed
if [ -f "package-lock.json" ]; then
    echo "Checking for new dependencies..."
    npm install --quiet
fi

# Build
echo "Building..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist folder not created"
    exit 1
fi

echo "✅ Frontend rebuilt"
cd ..
echo ""

# Step 4: Restart services
echo "🔄 Step 4/4: Restarting services..."

if systemctl is-active --quiet reinforceplay-backend; then
    echo "Restarting backend..."
    sudo systemctl restart reinforceplay-backend
    sleep 2
else
    echo "Starting backend..."
    sudo systemctl start reinforceplay-backend
    sleep 2
fi

if systemctl is-active --quiet reinforceplay-frontend; then
    echo "Restarting frontend..."
    sudo systemctl restart reinforceplay-frontend
    sleep 2
else
    echo "Starting frontend..."
    sudo systemctl start reinforceplay-frontend
    sleep 2
fi

echo "✅ Services restarted"
echo ""

# Check status
echo "================================================"
echo "📊 Status Check"
echo "================================================"
echo ""

if systemctl is-active --quiet reinforceplay-backend; then
    echo "✅ Backend: Running"
else
    echo "❌ Backend: Failed"
    sudo journalctl -u reinforceplay-backend -n 10 --no-pager
fi

if systemctl is-active --quiet reinforceplay-frontend; then
    echo "✅ Frontend: Running"
else
    echo "❌ Frontend: Failed"
    sudo journalctl -u reinforceplay-frontend -n 10 --no-pager
fi

echo ""

# Test endpoints
echo "🧪 Testing..."
sleep 1

if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend API responding"
else
    echo "❌ Backend API not responding"
fi

if curl -s http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Frontend responding"
else
    echo "❌ Frontend not responding"
fi

echo ""
echo "================================================"
echo "✨ Update Complete!"
echo "================================================"
echo ""

PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")
echo "🌐 App URL: http://$PUBLIC_IP"
echo ""
echo "📊 View logs: sudo journalctl -u reinforceplay-backend -f"
echo ""

