#!/bin/bash

# Quick frontend build with progress and debugging

echo "🔨 Quick Frontend Build"
echo "================================================"
echo ""

cd frontend || exit 1

echo "📦 Step 1/3: Checking Node.js..."
node --version
npm --version
echo ""

echo "🧹 Step 2/3: Cleaning..."
rm -rf dist
rm -rf node_modules/.vite
echo "✅ Clean complete"
echo ""

echo "🔨 Step 3/3: Building..."
echo "This should take 1-3 minutes..."
echo ""

# Build with verbose output and memory limit
NODE_OPTIONS="--max-old-space-size=2048" \
  npm run build -- --logLevel info

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    ls -lh dist/
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi

cd ..

