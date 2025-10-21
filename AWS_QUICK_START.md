# 🚀 AWS Quick Start Guide

## Prerequisites

Install Node.js and Python on your AWS instance:

```bash
# Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Python 3
sudo yum install -y python3 python3-pip

# Git (if not installed)
sudo yum install -y git
```

## 📦 First Time Setup

Run this **once** on your AWS server:

```bash
# 1. Clone or upload your code to the server

# 2. Navigate to the project directory
cd ReinforcePlay

# 3. Make scripts executable
chmod +x *.sh

# 4. Run setup (handles everything automatically)
./aws-setup.sh
```

**That's it!** The script will:
- ✅ Check prerequisites
- ✅ Stop old processes
- ✅ Setup backend (Python virtual environment)
- ✅ Build frontend
- ✅ Create systemd services
- ✅ Start everything
- ✅ Configure auto-start on boot

## 🔄 After Code Changes

When you update your code:

```bash
./aws-update.sh
```

This will:
- Pull latest code (if git)
- Update dependencies
- Rebuild frontend
- Restart services
- Verify everything works

## 📊 Check Status

```bash
./aws-status.sh
```

Shows:
- Service status (running/stopped)
- Port status (open/closed)
- Health checks
- Public URL
- Useful commands

## 📋 View Logs

```bash
# View both services
./aws-logs.sh

# View backend only
./aws-logs.sh backend

# View frontend only
./aws-logs.sh frontend
```

Press `Ctrl+C` to stop viewing logs.

## 🛠️ Common Tasks

### Restart Services
```bash
sudo systemctl restart reinforceplay-backend
sudo systemctl restart reinforceplay-frontend

# Or both at once
sudo systemctl restart reinforceplay-*
```

### Stop Services
```bash
sudo systemctl stop reinforceplay-backend
sudo systemctl stop reinforceplay-frontend

# Or both at once
sudo systemctl stop reinforceplay-*
```

### Start Services
```bash
sudo systemctl start reinforceplay-backend
sudo systemctl start reinforceplay-frontend
```

### Check Individual Service
```bash
sudo systemctl status reinforceplay-backend
sudo systemctl status reinforceplay-frontend
```

## 🔐 AWS Security Group

Make sure your EC2 security group allows:

| Type | Port | Source | Purpose |
|------|------|--------|---------|
| HTTP | 80 | 0.0.0.0/0 | Frontend |
| Custom TCP | 8000 | 0.0.0.0/0 | Backend API |
| SSH | 22 | Your IP | SSH access |

## 🌐 Access Your App

Get your server's public IP:
```bash
curl ifconfig.me
```

Then open in browser:
```
http://YOUR_PUBLIC_IP
```

## ✅ Verify Everything Works

1. **Check services are running:**
   ```bash
   ./aws-status.sh
   ```

2. **Test backend API:**
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status":"ok"}
   ```

3. **Test frontend:**
   ```bash
   curl http://localhost:80
   # Should return HTML
   ```

4. **Open in browser:**
   - Go to `http://YOUR_PUBLIC_IP`
   - Open Playground
   - Click "Start Training"
   - Should work without connection errors!

## 🐛 Troubleshooting

### Services won't start
```bash
# Check logs
./aws-logs.sh

# Or check specific service
sudo journalctl -u reinforceplay-backend -n 50
sudo journalctl -u reinforceplay-frontend -n 50
```

### Port already in use
```bash
# Find process
sudo lsof -i :8000
sudo lsof -i :80

# Kill it
sudo kill -9 <PID>

# Restart service
sudo systemctl restart reinforceplay-*
```

### Frontend build fails or gets stuck
```bash
# Try quick build script
./quick-frontend-build.sh

# Or clear everything and rebuild
cd frontend
rm -rf node_modules dist node_modules/.vite
npm install
NODE_OPTIONS="--max-old-space-size=2048" npm run build
cd ..
sudo systemctl restart reinforceplay-frontend
```

**If build is too slow on small instances:**
Build locally and upload `dist` folder. See [BUILD_TROUBLESHOOTING.md](./BUILD_TROUBLESHOOTING.md)

### Backend crashes
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..
sudo systemctl restart reinforceplay-backend
```

### Complete reset
```bash
# Stop everything
sudo systemctl stop reinforceplay-*

# Run setup again
./aws-setup.sh
```

## 📚 All Scripts

| Script | Purpose |
|--------|---------|
| `aws-setup.sh` | First-time setup (run once) |
| `aws-update.sh` | Update after code changes |
| `aws-status.sh` | Check status of everything |
| `aws-logs.sh` | View service logs |

## 🎉 Benefits

✅ **Persistent** - Survives SSH disconnection  
✅ **Auto-restart** - Recovers from crashes  
✅ **Boot-safe** - Starts on server reboot  
✅ **Easy updates** - One command to update  
✅ **Production-ready** - Proper service management  

---

## 📞 Need Help?

1. Check status: `./aws-status.sh`
2. Check logs: `./aws-logs.sh`
3. Read full guide: `SERVICE_MANAGEMENT.md`
4. Read troubleshooting: `TROUBLESHOOTING.md`

---

**Enjoy your production-ready ReinforcePlay! 🚀**

