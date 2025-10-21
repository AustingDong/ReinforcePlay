# 🔨 Frontend Build Troubleshooting

## ⏱️ Build Gets Stuck

If the build hangs or gets stuck, try these solutions:

### Solution 1: Quick Build with Memory Limit
```bash
./quick-frontend-build.sh
```

This script:
- Clears caches
- Sets memory limits
- Shows detailed progress
- Easier to debug

### Solution 2: Manual Build with Debug
```bash
cd frontend

# Clear everything
rm -rf dist node_modules/.vite

# Build with verbose output
NODE_OPTIONS="--max-old-space-size=2048" npm run build -- --logLevel info
```

### Solution 3: Check for Stuck Processes
```bash
# Check if Node.js is using too much CPU
top

# Kill stuck processes
pkill -9 node

# Try again
./quick-frontend-build.sh
```

### Solution 4: Reinstall Dependencies
```bash
cd frontend

# Remove everything
rm -rf node_modules dist package-lock.json

# Fresh install
npm install

# Build
npm run build

cd ..
```

### Solution 5: Reduce Build Complexity
If your server has limited resources:

```bash
cd frontend

# Build with minimal resources
NODE_OPTIONS="--max-old-space-size=1024" \
  npm run build -- --minify=false

cd ..
```

---

## 🐌 Build is Very Slow

**On AWS EC2 t2.micro or similar small instances:**

The build might be slow because:
- Limited CPU (1 vCPU)
- Limited RAM (1GB)
- Vite needs to process many files

**Solutions:**

1. **Use a larger instance temporarily:**
   - Upgrade to t2.small (2GB RAM) for building
   - Build the project
   - Download the `dist` folder
   - Downgrade back to t2.micro
   - Upload just the `dist` folder

2. **Build locally and upload:**
   ```bash
   # On your local machine
   cd frontend
   npm install
   npm run build
   
   # Upload dist folder to server
   scp -r dist/ user@server:/path/to/ReinforcePlay/frontend/
   ```

3. **Use swap space:**
   ```bash
   # Create 2GB swap file on AWS
   sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   
   # Make permanent
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   
   # Now try building
   ./quick-frontend-build.sh
   ```

---

## 🔥 Out of Memory Errors

**Error: JavaScript heap out of memory**

### Solution 1: Increase Node Memory
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
cd frontend && npm run build && cd ..
```

### Solution 2: Build in Stages
If extremely limited memory:

```bash
cd frontend

# First clear caches
rm -rf node_modules/.vite

# Build with minimal memory
NODE_OPTIONS="--max-old-space-size=512" \
  npm run build -- --chunkSizeWarningLimit=1000

cd ..
```

---

## 📊 Monitor Build Progress

While building, open another terminal and monitor:

```bash
# Watch memory usage
watch -n 1 free -m

# Watch CPU
top

# Watch disk I/O
iostat -x 2

# Watch build directory
watch -n 2 "du -sh frontend/dist"
```

---

## 🔍 Common Error Messages

### "ENOSPC: no space left on device"
```bash
# Check disk space
df -h

# Clear npm cache
npm cache clean --force

# Remove old builds
cd frontend && rm -rf dist node_modules/.vite && cd ..
```

### "Cannot find module"
```bash
cd frontend
rm -rf node_modules
npm install
cd ..
```

### "Vite build timed out"
```bash
# Increase timeout
cd frontend
NODE_OPTIONS="--max-old-space-size=2048" \
  timeout 600 npm run build
cd ..
```

---

## ✅ Expected Build Times

| Server Type | RAM | Expected Time |
|-------------|-----|---------------|
| EC2 t2.micro | 1GB | 3-5 minutes |
| EC2 t2.small | 2GB | 1-2 minutes |
| EC2 t2.medium | 4GB | 30-60 seconds |
| Local (M1/M2) | 8GB+ | 10-20 seconds |

---

## 🎯 Pre-Built Option

If building on the server is too slow/stuck:

### Build Locally, Deploy Pre-built
```bash
# 1. On your local machine
cd frontend
npm install
npm run build

# 2. Create tarball
tar -czf dist.tar.gz dist/

# 3. Upload to server
scp dist.tar.gz user@server:/path/to/ReinforcePlay/frontend/

# 4. On server
cd /path/to/ReinforcePlay/frontend
tar -xzf dist.tar.gz
rm dist.tar.gz

# 5. Restart frontend service
sudo systemctl restart reinforceplay-frontend
```

This bypasses server building entirely!

---

## 🆘 Last Resort

If nothing works:

1. **Build locally** (your laptop)
2. **Upload dist folder** only
3. **Skip build** in aws-setup.sh

```bash
# On server, edit aws-setup.sh
# Comment out the build section:
# echo "Building frontend..."
# npm run build

# Instead, just check if dist exists:
if [ ! -d "dist" ]; then
    echo "⚠️  No dist folder! Upload it manually."
    exit 1
fi
```

---

## 📋 Debug Checklist

Before asking for help, collect:

```bash
# System info
uname -a
cat /etc/os-release

# Resources
free -m
df -h

# Node/npm versions
node --version
npm --version

# Try build with full output
cd frontend
NODE_OPTIONS="--max-old-space-size=2048" \
  npm run build -- --logLevel info 2>&1 | tee build.log

# Share build.log
```

---

**Most builds succeed with: `./quick-frontend-build.sh`** 🚀

