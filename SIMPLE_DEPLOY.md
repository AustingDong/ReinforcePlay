# 🚀 Simple Deployment (No Docker)

Deploy ReinforcePlay directly on your server without Docker.

## ⚡ Quick Start

### 1. One-Time Setup
```bash
./deploy-simple.sh
```

This will:
- Install Python dependencies
- Install Node dependencies
- Build frontend for production
- Create `.env` configuration
- Create `run.sh` script

### 2. Run the Application
```bash
./run-public.sh
```

That's it! Your app is now accessible at:
- **Frontend**: http://YOUR_SERVER_IP
- **Backend**: http://YOUR_SERVER_IP:8000
- **API Docs**: http://YOUR_SERVER_IP:8000/docs

## 🔧 Configuration

The backend is already configured to listen on `0.0.0.0` (all interfaces).

Edit `.env` to customize:
```bash
HOST=0.0.0.0      # Listen on all interfaces
PORT=8000         # Backend port
CORS_ORIGINS=*    # Allow all origins (change for production)
```

## 🔐 Firewall Setup

Allow incoming connections:
```bash
# For Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 8000/tcp
sudo ufw enable

# For Amazon Linux/RHEL
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --reload
```

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- Port 80 and 8000 available
- Sudo access (for port 80)

## 🛑 Stop the Application

Press `Ctrl+C` in the terminal, or:
```bash
# Find processes
ps aux | grep "python main.py"
ps aux | grep "serve"

# Kill processes
kill <PID>
```

## 🔄 Update Application

```bash
git pull
cd frontend
npm run build
cd ..
./run-public.sh
```

## 🎯 Production Tips

### 1. Run in Background
```bash
nohup ./run-public.sh > app.log 2>&1 &
```

### 2. Auto-restart on Reboot (Recommended!)

**Quick Setup:**
```bash
./setup-services.sh
```

This automatically sets up systemd services that:
- ✅ Start on server boot
- ✅ Keep running after SSH disconnect
- ✅ Auto-restart on crashes

See [SERVICE_MANAGEMENT.md](./SERVICE_MANAGEMENT.md) for full details.

**Or manual setup:**

**Backend service** (`/etc/systemd/system/reinforceplay-backend.service`):
```ini
[Unit]
Description=ReinforcePlay Backend
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/ReinforcePlay/backend
Environment="HOST=0.0.0.0"
Environment="PORT=8000"
Environment="CORS_ORIGINS=*"
ExecStart=/home/ec2-user/ReinforcePlay/backend/venv/bin/python main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

**Frontend service** (`/etc/systemd/system/reinforceplay-frontend.service`):
```ini
[Unit]
Description=ReinforcePlay Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/ec2-user/ReinforcePlay/frontend
ExecStart=/usr/bin/npx serve -s dist -l 80
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable services:
```bash
sudo systemctl daemon-reload
sudo systemctl enable reinforceplay-backend
sudo systemctl enable reinforceplay-frontend
sudo systemctl start reinforceplay-backend
sudo systemctl start reinforceplay-frontend
```

Check status:
```bash
sudo systemctl status reinforceplay-backend
sudo systemctl status reinforceplay-frontend
```

### 3. Nginx Reverse Proxy (Optional)

Instead of running frontend on port 80, use nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🐛 Troubleshooting

### Port 80 Permission Denied
```bash
# Give node permission to bind to port 80
sudo setcap 'cap_net_bind_service=+ep' $(which node)
```

### Backend Not Accessible
```bash
# Check if backend is running
curl http://localhost:8000/health

# Check if listening on 0.0.0.0
netstat -tulpn | grep 8000
```

### CORS Errors
Make sure `CORS_ORIGINS=*` in `.env` or set to your frontend domain.

### Can't Connect from Outside
1. Check firewall: `sudo ufw status`
2. Check security group (AWS/Cloud)
3. Verify backend is on 0.0.0.0: `netstat -tulpn | grep 8000`

## 📊 Monitoring

### View Logs
```bash
# If running in background
tail -f app.log

# Check systemd logs
sudo journalctl -u reinforceplay-backend -f
sudo journalctl -u reinforceplay-frontend -f
```

### Resource Usage
```bash
htop
# or
top
```

## ✅ Checklist

- [ ] Run `./deploy-simple.sh` once
- [ ] Configure firewall (ports 80, 8000)
- [ ] Run `./run-public.sh`
- [ ] Test from external network
- [ ] (Optional) Set up systemd services
- [ ] (Optional) Configure domain name
- [ ] (Optional) Add SSL certificate

---

**That's it!** No Docker needed. Simple and straightforward. 🎉

