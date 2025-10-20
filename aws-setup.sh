#!/bin/bash

set -e  # Exit on error

echo "🚀 ReinforcePlay AWS Setup"
echo "================================================"
echo ""

# Get current directory
CURRENT_DIR=$(pwd)
USER=$(whoami)

# Step 1: Check prerequisites
echo "📋 Step 1/5: Checking prerequisites..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Install it with: curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash - && sudo yum install -y nodejs"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    echo "Install it with: sudo yum install -y python3 python3-pip"
    exit 1
fi
echo "✅ Python $(python3 --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo "✅ npm $(npm --version)"

echo ""

# Step 2: Stop existing services
echo "📦 Step 2/5: Stopping existing services..."
echo ""

if systemctl is-active --quiet reinforceplay-backend 2>/dev/null; then
    echo "Stopping backend service..."
    sudo systemctl stop reinforceplay-backend
fi

if systemctl is-active --quiet reinforceplay-frontend 2>/dev/null; then
    echo "Stopping frontend service..."
    sudo systemctl stop reinforceplay-frontend
fi

# Kill any hanging processes
pkill -f "python.*main.py" 2>/dev/null || true
pkill -f "npx serve" 2>/dev/null || true

echo "✅ Old processes stopped"
echo ""

# Step 3: Setup backend
echo "🐍 Step 3/5: Setting up backend..."
echo ""

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet
deactivate

echo "✅ Backend ready"
echo ""
cd ..

# Step 4: Setup frontend
echo "🎨 Step 4/5: Setting up frontend..."
echo ""

cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install --quiet
fi

# Build frontend
echo "Building frontend..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Frontend build failed - dist folder not created"
    exit 1
fi

echo "✅ Frontend built"
echo ""
cd ..

# Step 5: Setup systemd services
echo "⚙️  Step 5/5: Setting up system services..."
echo ""

# Create backend service
echo "Creating backend service..."
sudo tee /etc/systemd/system/reinforceplay-backend.service > /dev/null << EOF
[Unit]
Description=ReinforcePlay Backend (FastAPI)
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$CURRENT_DIR/backend
Environment="PATH=$CURRENT_DIR/backend/venv/bin:/usr/local/bin:/usr/bin:/bin"
Environment="HOST=0.0.0.0"
Environment="PORT=8000"
Environment="CORS_ORIGINS=*"
ExecStart=$CURRENT_DIR/backend/venv/bin/python main.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Create frontend service
echo "Creating frontend service..."
sudo tee /etc/systemd/system/reinforceplay-frontend.service > /dev/null << EOF
[Unit]
Description=ReinforcePlay Frontend (Serve)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$CURRENT_DIR/frontend
ExecStart=/usr/bin/npx serve -s dist -l 80
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
echo "Reloading systemd..."
sudo systemctl daemon-reload

# Enable services (start on boot)
echo "Enabling auto-start on boot..."
sudo systemctl enable reinforceplay-backend
sudo systemctl enable reinforceplay-frontend

# Start services
echo "Starting services..."
sudo systemctl start reinforceplay-backend
sleep 2
sudo systemctl start reinforceplay-frontend
sleep 2

echo "✅ Services started"
echo ""

# Check status
echo "================================================"
echo "📊 Service Status"
echo "================================================"
echo ""

# Backend status
if systemctl is-active --quiet reinforceplay-backend; then
    echo "✅ Backend: Running"
else
    echo "❌ Backend: Failed"
    echo "   View logs: sudo journalctl -u reinforceplay-backend -n 20"
fi

# Frontend status
if systemctl is-active --quiet reinforceplay-frontend; then
    echo "✅ Frontend: Running"
else
    echo "❌ Frontend: Failed"
    echo "   View logs: sudo journalctl -u reinforceplay-frontend -n 20"
fi

echo ""

# Test endpoints
echo "🧪 Testing endpoints..."
sleep 2

if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend API responding"
else
    echo "⚠️  Backend API not responding"
fi

if curl -s http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Frontend responding"
else
    echo "⚠️  Frontend not responding"
fi

echo ""
echo "================================================"
echo "✨ Setup Complete!"
echo "================================================"
echo ""
echo "🌐 Your app is running at:"

# Try to get public IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "YOUR_SERVER_IP")
echo "   http://$PUBLIC_IP"
echo ""

echo "📋 Useful Commands:"
echo "   sudo systemctl status reinforceplay-backend"
echo "   sudo systemctl status reinforceplay-frontend"
echo "   sudo systemctl restart reinforceplay-*"
echo "   sudo journalctl -u reinforceplay-backend -f"
echo "   sudo journalctl -u reinforceplay-frontend -f"
echo ""

echo "🔄 After code updates, run:"
echo "   ./aws-update.sh"
echo ""

echo "🛑 To stop services:"
echo "   sudo systemctl stop reinforceplay-*"
echo ""

echo "✅ Services will auto-start on server reboot!"
echo ""

