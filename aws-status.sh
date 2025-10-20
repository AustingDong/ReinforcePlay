#!/bin/bash

echo "📊 ReinforcePlay Status Check"
echo "================================================"
echo ""

# Service status
echo "⚙️  Services:"
echo ""

if systemctl is-active --quiet reinforceplay-backend; then
    echo "✅ Backend: Running"
    sudo systemctl status reinforceplay-backend --no-pager -l | grep -E "(Active|Memory|CPU)" | head -3
else
    echo "❌ Backend: Stopped"
fi

echo ""

if systemctl is-active --quiet reinforceplay-frontend; then
    echo "✅ Frontend: Running"
    sudo systemctl status reinforceplay-frontend --no-pager -l | grep -E "(Active|Memory|CPU)" | head -3
else
    echo "❌ Frontend: Stopped"
fi

echo ""
echo "================================================"
echo "🌐 Network:"
echo ""

# Check ports
if sudo lsof -i :8000 > /dev/null 2>&1; then
    echo "✅ Port 8000 (Backend): Open"
else
    echo "❌ Port 8000 (Backend): Closed"
fi

if sudo lsof -i :80 > /dev/null 2>&1; then
    echo "✅ Port 80 (Frontend): Open"
else
    echo "❌ Port 80 (Frontend): Closed"
fi

echo ""
echo "================================================"
echo "🧪 Health Checks:"
echo ""

# Backend health
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    HEALTH=$(curl -s http://localhost:8000/health)
    echo "✅ Backend API: $HEALTH"
else
    echo "❌ Backend API: Not responding"
fi

# Frontend
if curl -s http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Frontend: Responding"
else
    echo "❌ Frontend: Not responding"
fi

echo ""
echo "================================================"
echo "🌍 Public Access:"
echo ""

PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "Unknown")
echo "   http://$PUBLIC_IP"
echo ""

echo "================================================"
echo "📋 Quick Commands:"
echo ""
echo "   View backend logs:   sudo journalctl -u reinforceplay-backend -f"
echo "   View frontend logs:  sudo journalctl -u reinforceplay-frontend -f"
echo "   Restart services:    sudo systemctl restart reinforceplay-*"
echo "   Stop services:       sudo systemctl stop reinforceplay-*"
echo "   Update app:          ./aws-update.sh"
echo ""

