# 🔧 ReinforcePlay Service Management

## 🚀 One-Time Setup

Run this **once** on your AWS server to set up permanent services:

```bash
./setup-services.sh
```

This will:
- ✅ Create systemd services for backend and frontend
- ✅ Enable auto-start on server boot
- ✅ Start the services immediately
- ✅ Configure auto-restart on crashes

After setup, your app will **stay running** even when you disconnect from SSH!

---

## 📋 Service Management Commands

### Check Status
```bash
# Backend status
sudo systemctl status reinforceplay-backend

# Frontend status
sudo systemctl status reinforceplay-frontend

# Both at once
sudo systemctl status reinforceplay-*
```

### Start/Stop/Restart Services
```bash
# Start services
sudo systemctl start reinforceplay-backend
sudo systemctl start reinforceplay-frontend

# Stop services
sudo systemctl stop reinforceplay-backend
sudo systemctl stop reinforceplay-frontend

# Restart services (after code updates)
sudo systemctl restart reinforceplay-backend
sudo systemctl restart reinforceplay-frontend
```

### View Logs
```bash
# Backend logs (live)
sudo journalctl -u reinforceplay-backend -f

# Frontend logs (live)
sudo journalctl -u reinforceplay-frontend -f

# Last 100 lines of backend logs
sudo journalctl -u reinforceplay-backend -n 100

# Logs from today
sudo journalctl -u reinforceplay-backend --since today
```

### Enable/Disable Auto-Start
```bash
# Enable auto-start on boot (already done by setup script)
sudo systemctl enable reinforceplay-backend
sudo systemctl enable reinforceplay-frontend

# Disable auto-start
sudo systemctl disable reinforceplay-backend
sudo systemctl disable reinforceplay-frontend
```

---

## 🔄 After Code Updates

When you update your code:

```bash
# 1. Pull changes
git pull

# 2. Rebuild frontend (if frontend changed)
cd frontend
npm run build
cd ..

# 3. Restart services
sudo systemctl restart reinforceplay-backend
sudo systemctl restart reinforceplay-frontend

# 4. Check if running
sudo systemctl status reinforceplay-*
```

---

## 🐛 Troubleshooting

### Service Won't Start

**Check logs:**
```bash
sudo journalctl -u reinforceplay-backend -n 50
sudo journalctl -u reinforceplay-frontend -n 50
```

**Common issues:**

1. **Port already in use:**
```bash
# Find process using port 8000
sudo lsof -i :8000
# Kill it
sudo kill -9 <PID>
# Restart service
sudo systemctl restart reinforceplay-backend
```

2. **Frontend dist folder missing:**
```bash
cd frontend
npm run build
cd ..
sudo systemctl restart reinforceplay-frontend
```

3. **Python virtual environment issues:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..
sudo systemctl restart reinforceplay-backend
```

### Check Service Configuration

```bash
# View backend service file
sudo systemctl cat reinforceplay-backend

# View frontend service file
sudo systemctl cat reinforceplay-frontend
```

### Reset Services

If something is really broken:

```bash
# Stop services
sudo systemctl stop reinforceplay-backend
sudo systemctl stop reinforceplay-frontend

# Remove service files
sudo rm /etc/systemd/system/reinforceplay-backend.service
sudo rm /etc/systemd/system/reinforceplay-frontend.service

# Reload systemd
sudo systemctl daemon-reload

# Run setup again
./setup-services.sh
```

---

## 📊 Monitoring

### Check if Services are Running
```bash
# Quick check
systemctl is-active reinforceplay-backend
systemctl is-active reinforceplay-frontend

# Detailed status
sudo systemctl status reinforceplay-backend --no-pager
sudo systemctl status reinforceplay-frontend --no-pager
```

### View Resource Usage
```bash
# CPU and memory
top
# or
htop

# Service-specific
systemctl status reinforceplay-backend
```

### Test Endpoints
```bash
# Backend health check
curl http://localhost:8000/health

# Frontend check
curl http://localhost:80
```

---

## 🔐 Security Notes

The services run as:
- **Backend**: Your user account
- **Frontend**: Root (required for port 80)

For production, consider:
1. Using nginx as reverse proxy
2. Setting up SSL/HTTPS
3. Restricting CORS origins
4. Using non-privileged ports with reverse proxy

---

## 🆘 Emergency Stop

If you need to stop everything immediately:

```bash
# Stop both services
sudo systemctl stop reinforceplay-backend reinforceplay-frontend

# Verify stopped
sudo systemctl status reinforceplay-*

# To start again
sudo systemctl start reinforceplay-backend reinforceplay-frontend
```

---

## ✅ Verification Checklist

After running `./setup-services.sh`:

- [ ] Backend service is active: `systemctl is-active reinforceplay-backend`
- [ ] Frontend service is active: `systemctl is-active reinforceplay-frontend`
- [ ] Backend responds: `curl http://localhost:8000/health`
- [ ] Frontend responds: `curl http://localhost:80`
- [ ] Services enabled for boot: `systemctl is-enabled reinforceplay-*`
- [ ] Can access from browser: `http://YOUR_SERVER_IP`

---

## 🎉 Benefits

✅ **Always Running** - Services survive SSH disconnection  
✅ **Auto-Start** - Starts on server boot/reboot  
✅ **Auto-Restart** - Recovers from crashes (10 sec delay)  
✅ **Easy Management** - Standard systemctl commands  
✅ **Logging** - Centralized via journalctl  

---

**Your ReinforcePlay is now a production service!** 🚀

