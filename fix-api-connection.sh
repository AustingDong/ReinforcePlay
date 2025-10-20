#!/bin/bash

echo "🔧 Fixing API Connection for Production..."
echo ""

# Get current directory
CURRENT_DIR=$(pwd)

# Rebuild frontend with new API detection
echo "📦 Rebuilding frontend with smart API detection..."
cd frontend
npm run build

if [ ! -d "dist" ]; then
  echo "❌ Build failed - dist folder not created"
  exit 1
fi

cd ..

# Restart services if they're running
if systemctl is-active --quiet reinforceplay-backend; then
  echo "🔄 Restarting backend service..."
  sudo systemctl restart reinforceplay-backend
  sleep 2
fi

if systemctl is-active --quiet reinforceplay-frontend; then
  echo "🔄 Restarting frontend service..."
  sudo systemctl restart reinforceplay-frontend
  sleep 2
fi

# Check backend health
echo ""
echo "🏥 Checking backend health..."
if curl -s http://localhost:8000/health > /dev/null; then
  echo "✅ Backend is responding"
else
  echo "⚠️  Backend not responding on port 8000"
  echo "   Check if backend is running: sudo systemctl status reinforceplay-backend"
fi

# Check frontend
echo ""
echo "🎨 Checking frontend..."
if curl -s http://localhost:80 > /dev/null; then
  echo "✅ Frontend is responding"
else
  echo "⚠️  Frontend not responding on port 80"
  echo "   Check if frontend is running: sudo systemctl status reinforceplay-frontend"
fi

echo ""
echo "================================================"
echo "✨ Done! API Connection Fixed"
echo "================================================"
echo ""
echo "📝 What Changed:"
echo "  - Frontend now auto-detects the API URL"
echo "  - Uses http://YOUR_SERVER_IP:8000 in production"
echo "  - Uses http://localhost:8000 in development"
echo ""
echo "🌐 Access your app at:"
echo "  http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
echo ""
echo "🐛 If still not working, check:"
echo "  1. Backend running: sudo systemctl status reinforceplay-backend"
echo "  2. Frontend running: sudo systemctl status reinforceplay-frontend"
echo "  3. Port 8000 open: sudo lsof -i :8000"
echo "  4. Browser console (F12) for errors"
echo ""

