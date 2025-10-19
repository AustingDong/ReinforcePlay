#!/bin/bash

echo "🚀 Quick Build (Skip TypeScript Checks)"
echo ""

cd frontend

# Backup package.json
cp package.json package.json.backup

# Temporarily modify build script to skip tsc
cat > package.json << 'EOF'
{
  "name": "reinforceplay-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build-check": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1",
    "zustand": "^4.4.7",
    "axios": "^1.6.5",
    "recharts": "^2.10.4",
    "framer-motion": "^10.18.0",
    "katex": "^0.16.9",
    "react-katex": "^3.0.1",
    "lucide-react": "^0.309.0",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@types/katex": "^0.16.7",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.11"
  }
}
EOF

echo "📦 Building without type checking..."
npm run build

# Restore package.json
mv package.json.backup package.json

cd ..

if [ -d "frontend/dist" ]; then
    echo ""
    echo "✅ Build successful!"
    echo "📁 Files in dist:"
    ls -lh frontend/dist/ | head -10
else
    echo "❌ Build failed"
    exit 1
fi

