# 🚀 ReinforcePlay Deployment Guide

This guide covers deploying ReinforcePlay to a public server.

## 📋 Prerequisites

- Docker & Docker Compose installed
- A server with public IP (AWS EC2, DigitalOcean, etc.)
- Domain name (optional but recommended)

## 🐳 Docker Deployment (Recommended)

### Quick Start

1. **Clone and navigate to the project:**
```bash
git clone <your-repo-url>
cd ReinforcePlay
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your settings
nano .env
```

3. **Deploy:**
```bash
./deploy.sh
```

That's it! Your app is now running on:
- Frontend: http://your-server-ip
- Backend: http://your-server-ip:8000
- API Docs: http://your-server-ip:8000/docs

### Configuration Options

Edit `.env` file:

```bash
# Backend
CORS_ORIGINS=*  # Change to your domain in production
PORT=8000

# Frontend
VITE_API_URL=http://your-domain.com:8000

# Production example:
# CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
# VITE_API_URL=https://api.yourdomain.com
```

### Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build

# View running containers
docker-compose ps
```

## 🌐 Custom Domain Setup

### 1. DNS Configuration

Point your domain to your server IP:
```
A record: yourdomain.com → your-server-ip
A record: www.yourdomain.com → your-server-ip
```

### 2. SSL Certificate (HTTPS)

Install Certbot:
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

Get certificate:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. Update nginx.conf

Add SSL configuration to `nginx.conf`:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## 🔧 Manual Deployment (Without Docker)

### Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export HOST=0.0.0.0
export PORT=8000
export CORS_ORIGINS=*

# Run with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Serve with a static server
npm install -g serve
serve -s dist -p 80
```

## ☁️ Cloud Platform Deployment

### AWS EC2

1. **Launch EC2 instance:**
   - Ubuntu 22.04 LTS
   - t2.medium or larger
   - Open ports: 80, 443, 8000

2. **Install Docker:**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
```

3. **Deploy:**
```bash
git clone <your-repo>
cd ReinforcePlay
./deploy.sh
```

### DigitalOcean Droplet

1. **Create Droplet:**
   - Ubuntu 22.04
   - 2GB RAM minimum
   - Enable monitoring

2. **SSH into droplet:**
```bash
ssh root@your-droplet-ip
```

3. **Follow Docker deployment steps above**

### Heroku

Create `Procfile` in root:
```
web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

Deploy:
```bash
heroku create your-app-name
git push heroku main
```

### Vercel (Frontend only)

```bash
cd frontend
npm install -g vercel
vercel
```

Configure build settings:
- Build Command: `npm run build`
- Output Directory: `dist`

## 🔐 Security Best Practices

1. **Update CORS origins:**
```python
# In backend/config.py
CORS_ORIGINS = ["https://yourdomain.com"]  # Not "*"
```

2. **Use HTTPS** - Always use SSL certificates in production

3. **Environment Variables** - Never commit `.env` files

4. **Firewall Rules:**
```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8000  # Only if backend is separate
sudo ufw enable
```

5. **Regular Updates:**
```bash
docker-compose pull
docker-compose up -d
```

## 📊 Monitoring

### Docker Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Health Checks
- Backend: http://your-domain:8000/health
- Frontend: http://your-domain

### Resource Monitoring
```bash
docker stats
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 80
sudo lsof -i :80
sudo kill -9 <PID>
```

### CORS Errors
Update `backend/.env`:
```bash
CORS_ORIGINS=http://your-frontend-domain,https://your-frontend-domain
```

### Build Failures
```bash
# Clean rebuild
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Issues
Check logs:
```bash
docker-compose logs backend
```

## 🔄 Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/ReinforcePlay
            git pull
            docker-compose up -d --build
```

## 📈 Scaling

### Horizontal Scaling
```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
```

### Load Balancer
Use nginx or cloud load balancer to distribute traffic.

## 🆘 Support

- Check logs: `docker-compose logs -f`
- Health endpoint: `/health`
- API docs: `/docs`

## 📝 Checklist Before Going Live

- [ ] Update `.env` with production values
- [ ] Set proper CORS origins
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Set up monitoring
- [ ] Test all endpoints
- [ ] Backup strategy in place
- [ ] Domain configured
- [ ] SSL certificate obtained
- [ ] Security headers configured

---

🎉 **Your ReinforcePlay deployment is ready!**

For issues, check the logs or refer to troubleshooting section.

