#!/bin/bash

echo "🧪 Testing ReinforcePlay Deployment..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test backend health
echo "1. Testing Backend Health..."
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)

if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Backend is healthy (HTTP 200)${NC}"
else
    echo -e "${RED}❌ Backend health check failed (HTTP $BACKEND_RESPONSE)${NC}"
fi

# Test backend algorithms endpoint
echo ""
echo "2. Testing Backend API..."
API_RESPONSE=$(curl -s http://localhost:8000/health | grep -o '"status":"healthy"')

if [ -n "$API_RESPONSE" ]; then
    echo -e "${GREEN}✅ Backend API is responding correctly${NC}"
else
    echo -e "${RED}❌ Backend API response is invalid${NC}"
fi

# Test frontend
echo ""
echo "3. Testing Frontend..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)

if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is accessible (HTTP 200)${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend returned HTTP $FRONTEND_RESPONSE${NC}"
    echo "   This might be normal if using React Router"
fi

# Test CORS
echo ""
echo "4. Testing CORS Configuration..."
CORS_HEADER=$(curl -s -I http://localhost:8000/health | grep -i "access-control-allow-origin")

if [ -n "$CORS_HEADER" ]; then
    echo -e "${GREEN}✅ CORS is configured${NC}"
    echo "   $CORS_HEADER"
else
    echo -e "${RED}❌ CORS headers not found${NC}"
fi

# Summary
echo ""
echo "================================"
echo "📊 Deployment Test Summary"
echo "================================"
echo ""
echo "🌐 URLs:"
echo "   Frontend:  http://localhost"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "🔍 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""

