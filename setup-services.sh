#!/bin/bash

echo "🔧 Setting up ReinforcePlay as a system service..."
echo ""

# Get current directory
CURRENT_DIR=$(pwd)
USER=$(whoami)

# Create backend service
echo "📦 Creating backend service..."
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

[Install]
WantedBy=multi-user.target
EOF

# Create frontend service
echo "🎨 Creating frontend service..."
sudo tee /etc/systemd/system/reinforceplay-frontend.service > /dev/null << EOF
[Unit]
Description=ReinforcePlay Frontend (Serve)
After=network.target

[Service]
Type=simple
WorkingDirectory=$CURRENT_DIR/frontend
ExecStart=/usr/bin/npx serve -s dist -l 80
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
echo "🔄 Reloading systemd..."
sudo systemctl daemon-reload

# Enable services (start on boot)
echo "✅ Enabling services to start on boot..."
sudo systemctl enable reinforceplay-backend
sudo systemctl enable reinforceplay-frontend

# Start services
echo "🚀 Starting services..."
sudo systemctl start reinforceplay-backend
sudo systemctl start reinforceplay-frontend

# Wait a moment
sleep 3

# Check status
echo ""
echo "================================================"
echo "📊 Service Status"
echo "================================================"
echo ""
echo "Backend Status:"
sudo systemctl status reinforceplay-backend --no-pager -l | head -15
echo ""
echo "Frontend Status:"
sudo systemctl status reinforceplay-frontend --no-pager -l | head -15

echo ""
echo "================================================"
echo "✨ Setup Complete!"
echo "================================================"
echo ""
echo "Your services are now running and will:"
echo "  ✅ Start automatically on server boot"
echo "  ✅ Keep running after you disconnect"
echo "  ✅ Restart automatically if they crash"
echo ""
echo "📋 Useful Commands:"
echo "  sudo systemctl status reinforceplay-backend"
echo "  sudo systemctl status reinforceplay-frontend"
echo "  sudo systemctl restart reinforceplay-backend"
echo "  sudo systemctl restart reinforceplay-frontend"
echo "  sudo systemctl stop reinforceplay-backend"
echo "  sudo systemctl stop reinforceplay-frontend"
echo "  sudo journalctl -u reinforceplay-backend -f"
echo "  sudo journalctl -u reinforceplay-frontend -f"
echo ""

