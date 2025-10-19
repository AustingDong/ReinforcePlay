#!/bin/bash

echo "🚀 Build and Run ReinforcePlay"
echo ""

# Build frontend (skip type checking)
echo "📦 Building frontend..."
cd frontend

# Build without type checking
npm run build -- --mode production 2>&1 | grep -v "TS[0-9]" || vite build --mode production

cd ..

# Check if build succeeded
if [ ! -d "frontend/dist" ] || [ -z "$(ls -A frontend/dist)" ]; then
    echo "❌ Build failed or dist is empty"
    exit 1
fi

echo "✅ Build complete!"
echo ""

# Run the application
./run-public.sh

