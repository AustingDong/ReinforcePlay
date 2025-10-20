# 🐛 ReinforcePlay Troubleshooting Guide

## ❌ Connection Error in Playground

### Problem
"Connection error" when clicking "Start Training" in the Playground.

### Root Cause
The frontend is trying to connect to `localhost:8000`, but on AWS, "localhost" means the **user's browser machine**, not your server!

### Solution

**Run this on your AWS server:**
```bash
./fix-api-connection.sh
```

This will:
1. ✅ Rebuild frontend with smart API detection
2. ✅ Restart both services
3. ✅ Verify connections

### Manual Fix

If the script doesn't work:

**1. Check Backend is Running:**
```bash
sudo systemctl status reinforceplay-backend

# Should show "active (running)"
# If not, start it:
sudo systemctl start reinforceplay-backend
```

**2. Check Frontend is Running:**
```bash
sudo systemctl status reinforceplay-frontend

# Should show "active (running)"
# If not, start it:
sudo systemctl start reinforceplay-frontend
```

**3. Verify Backend Responds:**
```bash
curl http://localhost:8000/health

# Should return: {"status":"ok"}
```

**4. Check Ports are Open:**
```bash
# Backend (should show Python process)
sudo lsof -i :8000

# Frontend (should show node/npx)
sudo lsof -i :80
```

**5. Rebuild Frontend:**
```bash
cd frontend
npm run build
cd ..
sudo systemctl restart reinforceplay-frontend
```

---

## 🔍 Check Browser Console

Open browser Developer Tools (F12) → Console tab:

**Good:**
```
[API] Using API base URL: http://YOUR_SERVER_IP:8000
```

**Bad:**
```
[API] Using API base URL: http://localhost:8000
```

If it shows localhost, clear browser cache and refresh (Ctrl+Shift+R).

---

## 🌐 AWS Security Group Settings

Make sure your AWS EC2 security group allows:

| Type | Port | Source |
|------|------|--------|
| HTTP | 80 | 0.0.0.0/0 |
| Custom TCP | 8000 | 0.0.0.0/0 |
| SSH | 22 | Your IP |

**To check/add:**
1. Go to AWS EC2 Console
2. Select your instance
3. Click Security tab
4. Click Security Group
5. Edit Inbound Rules
6. Add rules if missing

---

## 🔥 Firewall Issues

If using firewall on AWS instance:

```bash
# Check if firewalld is running
sudo systemctl status firewalld

# If active, allow ports
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --reload

# Or disable firewall (less secure)
sudo systemctl stop firewalld
sudo systemctl disable firewalld
```

---

## 🚨 CORS Errors

If you see CORS errors in browser console:

**Backend Config:**
```bash
# Check backend CORS settings
cd backend
grep CORS_ORIGINS .env

# Should be: CORS_ORIGINS=*
# Or: CORS_ORIGINS=http://YOUR_IP,http://YOUR_IP:80

# If missing, add it:
echo "CORS_ORIGINS=*" >> .env

# Restart backend
sudo systemctl restart reinforceplay-backend
```

---

## 📊 Service Logs

**Backend logs:**
```bash
# Real-time logs
sudo journalctl -u reinforceplay-backend -f

# Last 100 lines
sudo journalctl -u reinforceplay-backend -n 100

# Filter errors
sudo journalctl -u reinforceplay-backend | grep -i error
```

**Frontend logs:**
```bash
sudo journalctl -u reinforceplay-frontend -f
```

**Look for:**
- Connection refused
- Port already in use
- Permission denied
- Module not found

---

## 🔄 Complete Reset

If nothing works, full reset:

```bash
# 1. Stop everything
sudo systemctl stop reinforceplay-backend reinforceplay-frontend

# 2. Kill any hanging processes
sudo pkill -f "python.*main.py"
sudo pkill -f "npx serve"

# 3. Rebuild everything
cd frontend
rm -rf dist node_modules
npm install
npm run build
cd ..

cd backend
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..

# 4. Restart services
sudo systemctl daemon-reload
sudo systemctl start reinforceplay-backend
sudo systemctl start reinforceplay-frontend

# 5. Check status
sudo systemctl status reinforceplay-backend
sudo systemctl status reinforceplay-frontend
```

---

## 🧪 Test Checklist

Run these commands on your server:

```bash
# ✓ Backend health
curl http://localhost:8000/health

# ✓ Frontend index
curl http://localhost:80 | grep "ReinforcePlay"

# ✓ Backend from outside (replace with your server IP)
curl http://YOUR_SERVER_IP:8000/health

# ✓ Frontend from outside
curl http://YOUR_SERVER_IP

# ✓ Services running
systemctl is-active reinforceplay-backend
systemctl is-active reinforceplay-frontend

# ✓ Ports listening
sudo ss -tulpn | grep -E ":(80|8000)"
```

All should return success.

---

## 🆘 Still Not Working?

**Collect diagnostic info:**
```bash
# Save diagnostic output
{
  echo "=== Services Status ==="
  sudo systemctl status reinforceplay-backend --no-pager
  sudo systemctl status reinforceplay-frontend --no-pager
  
  echo "=== Backend Logs ==="
  sudo journalctl -u reinforceplay-backend -n 50 --no-pager
  
  echo "=== Frontend Logs ==="
  sudo journalctl -u reinforceplay-frontend -n 50 --no-pager
  
  echo "=== Ports ==="
  sudo ss -tulpn | grep -E ":(80|8000)"
  
  echo "=== Backend Health ==="
  curl -v http://localhost:8000/health 2>&1
} > diagnostic.txt

cat diagnostic.txt
```

Share the output from `diagnostic.txt`.

---

## 💡 Common Mistakes

1. ❌ Not rebuilding frontend after code changes
   - ✅ Always run `npm run build` after editing frontend code

2. ❌ Using `npm start` instead of services
   - ✅ Use systemctl services for production

3. ❌ Forgetting to restart services after changes
   - ✅ `sudo systemctl restart reinforceplay-*`

4. ❌ Firewall/Security Group blocking ports
   - ✅ Open ports 80 and 8000

5. ❌ Backend not listening on 0.0.0.0
   - ✅ Check `HOST=0.0.0.0` in backend/.env

---

## 📞 Quick Commands Reference

```bash
# Status check
sudo systemctl status reinforceplay-*

# Restart everything
sudo systemctl restart reinforceplay-backend reinforceplay-frontend

# View logs
sudo journalctl -u reinforceplay-backend -f

# Rebuild frontend
cd frontend && npm run build && cd ..

# Test backend
curl http://localhost:8000/health

# Check what's using ports
sudo lsof -i :80
sudo lsof -i :8000
```

---

**Remember:** After ANY code change, you must:
1. Rebuild frontend: `cd frontend && npm run build && cd ..`
2. Restart services: `sudo systemctl restart reinforceplay-*`

---

🎉 **Most connection issues are fixed by running `./fix-api-connection.sh`!**

