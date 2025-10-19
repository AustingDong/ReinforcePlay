#!/bin/bash

echo "🔧 Fixing Frontend Build..."
echo ""

# Stop any running processes
echo "Stopping existing processes..."
sudo pkill -f "serve"
pkill -f "python main.py"

# Navigate to frontend
cd frontend

# Clean previous build
echo "Cleaning previous build..."
rm -rf dist

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build for production
echo "Building frontend..."
npm run build

# Verify dist exists
if [ -d "dist" ]; then
    echo "✅ Build successful! Files in dist:"
    ls -lah dist/ | head -10
else
    echo "❌ Build failed - dist folder not created"
    exit 1
fi

cd ..

echo ""
echo "✅ Frontend is ready!"
echo ""
echo "Now run: ./run-public.sh"

