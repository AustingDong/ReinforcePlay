# 🚀 Quick Start Guide

Get ReinforcePlay running in 5 minutes!

## Prerequisites

- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)

Check your installations:
```bash
python --version   # or python3 --version
node --version
```

---

## Option 1: Automated Startup (Recommended)

### macOS / Linux
```bash
chmod +x start.sh
./start.sh
```

### Windows
```bash
start.bat
```

This will:
1. ✅ Create Python virtual environment
2. ✅ Install Python dependencies
3. ✅ Install Node.js dependencies
4. ✅ Start both backend and frontend
5. ✅ Open in your browser

---

## Option 2: Manual Startup

### Step 1: Start Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

✅ Backend running at: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

### Step 2: Start Frontend

Open a **new terminal** window:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

## 🎉 You're Ready!

Open your browser and navigate to:
- **App:** http://localhost:5173
- **API Docs:** http://localhost:8000/docs

### First Steps

1. 📚 **Learn Mode** - Start with Chapter 1: Multi-Armed Bandit
2. 🎮 **Playground** - Experiment with custom environments
3. ⚙️ **Tweak Parameters** - See how algorithms behave differently

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Must be 3.10+

# Try reinstalling dependencies
cd backend
pip install --upgrade -r requirements.txt
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
If port 8000 or 5173 is already in use:

**Backend:** Edit `backend/main.py`, change port in `uvicorn.run()`

**Frontend:** The Vite dev server will prompt you to use an alternative port

### CORS errors
Make sure backend is running and accessible at http://localhost:8000

Check `backend/main.py` CORS settings:
```python
allow_origins=["http://localhost:5173", "http://localhost:3000"]
```

---

## 📦 Optional: Production Build

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 🆘 Still Need Help?

- Check the main [README.md](README.md)
- Check [backend/README.md](backend/README.md)
- Check [frontend/README.md](frontend/README.md)
- Open an issue on GitHub

---

**Happy Learning! 🧠✨**

