# ⚡ Quick Deployment Guide

## 🚀 Deploy in 3 Steps

### 1. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit with your settings (or use defaults for localhost)
nano .env
```

### 2. Deploy with Docker
```bash
# Make deploy script executable (if not already)
chmod +x deploy.sh

# Deploy!
./deploy.sh
```

### 3. Access Your App
- **Frontend**: http://localhost (or http://your-server-ip)
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## 🌐 Deploy to Public Server

### Option A: Quick Public Port Access (Development)

1. **Set backend to listen on all interfaces:**
Already configured! Backend listens on `0.0.0.0:8000`

2. **Allow firewall access:**
```bash
# On your server
sudo ufw allow 80
sudo ufw allow 8000
```

3. **Deploy:**
```bash
./deploy.sh
```

4. **Access:**
- Frontend: `http://YOUR_SERVER_IP`
- Backend: `http://YOUR_SERVER_IP:8000`

### Option B: Production Deployment (Recommended)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Custom domain setup
- SSL/HTTPS configuration
- Security best practices
- Cloud platform deployment

---

## 🐳 Docker Commands Reference

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up -d --build

# Check service status
docker-compose ps

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

---

## 🔧 Without Docker

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
export HOST=0.0.0.0
export PORT=8000
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run build
npx serve -s dist -p 80
```

---

## 🔐 Environment Variables

### Backend (.env)
```bash
# CORS - Allow all origins (dev only!)
CORS_ORIGINS=*

# Or specific origins (production)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Server port
PORT=8000

# Debug mode
DEBUG=false
```

### Frontend
The frontend automatically uses `http://localhost:8000` for API calls.

For production, update `frontend/vite.config.ts` or use environment variables.

---

## ✅ Verify Deployment

1. **Check backend health:**
```bash
curl http://localhost:8000/health
```

2. **Check frontend:**
Open browser: http://localhost

3. **View API docs:**
Open browser: http://localhost:8000/docs

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Find process
sudo lsof -i :8000
sudo lsof -i :80

# Kill process
sudo kill -9 <PID>
```

### CORS errors
Update `CORS_ORIGINS` in `.env` to include your frontend URL.

### Can't connect to backend
- Check backend is running: `docker-compose ps`
- Check logs: `docker-compose logs backend`
- Verify firewall allows port 8000

### Docker issues
```bash
# Clean everything and start fresh
docker-compose down
docker system prune -a
docker-compose up -d --build
```

---

## 📞 Need Help?

1. Check logs: `docker-compose logs -f`
2. Verify services: `docker-compose ps`
3. Test backend: `curl http://localhost:8000/health`
4. See detailed guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎉 Success!

Your ReinforcePlay is now accessible publicly!

**Next steps:**
- Set up custom domain (see DEPLOYMENT.md)
- Configure SSL certificate for HTTPS
- Set up monitoring and backups
- Review security settings

Enjoy teaching RL! 🚀🤖

