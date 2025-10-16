# 📁 Project Structure

Complete overview of the ReinforcePlay codebase.

## 🌳 Directory Tree

```
ReinforcePlay/
│
├── 📄 README.md                    # Main project documentation
├── 📄 QUICK_START.md              # Quick setup guide
├── 📄 PROJECT_STRUCTURE.md        # This file
├── 🔧 .gitignore                  # Git ignore rules
├── 🚀 start.sh                    # Startup script (Unix)
├── 🚀 start.bat                   # Startup script (Windows)
│
├── 🐍 backend/                    # FastAPI Backend
│   ├── 📄 README.md              # Backend documentation
│   ├── 📄 requirements.txt       # Python dependencies
│   ├── 🔧 .gitignore            # Backend git ignore
│   ├── 🔧 .env.example          # Environment template
│   │
│   ├── 📝 main.py                # FastAPI app entry point
│   ├── 📝 models.py              # Pydantic data models
│   │
│   ├── 📂 algorithms/            # RL Algorithm Implementations
│   │   ├── __init__.py
│   │   ├── 🎰 bandit.py         # Multi-Armed Bandit
│   │   ├── 🎯 qlearning.py      # Q-Learning + GridWorld
│   │   └── 🚀 ppo.py            # PPO (simplified)
│   │
│   └── 📂 routes/                # API Endpoints
│       ├── __init__.py
│       ├── simulate.py           # Simulation endpoints
│       └── progress.py           # Progress tracking (WebSocket)
│
└── ⚛️ frontend/                  # React Frontend
    ├── 📄 README.md              # Frontend documentation
    ├── 📄 package.json           # Node dependencies
    ├── 🔧 .gitignore            # Frontend git ignore
    ├── 🔧 .env.example          # Environment template
    ├── 🔧 .eslintrc.cjs         # ESLint config
    │
    ├── 📝 index.html             # HTML entry point
    ├── 📝 vite.config.ts         # Vite configuration
    ├── 📝 tsconfig.json          # TypeScript config
    ├── 📝 tsconfig.node.json     # TS config for Node
    ├── 📝 tailwind.config.js     # Tailwind CSS config
    ├── 📝 postcss.config.js      # PostCSS config
    │
    └── 📂 src/                   # Source code
        ├── 📝 main.tsx           # React entry point
        ├── 📝 App.tsx            # Main app component
        ├── 📝 index.css          # Global styles
        │
        ├── 📂 pages/             # Main page components
        │   ├── 🏠 Home.tsx           # Landing page
        │   ├── 📚 LearningMode.tsx   # Learning interface
        │   └── 🎮 Playground.tsx     # Playground interface
        │
        ├── 📂 components/        # Reusable components
        │   ├── 🎨 Layout.tsx         # App layout with sidebar
        │   ├── 🎛️ ParameterSlider.tsx # Slider component
        │   │
        │   ├── 📂 lessons/           # Algorithm lessons
        │   │   ├── BanditLesson.tsx
        │   │   ├── MDPLesson.tsx
        │   │   ├── QLearningLesson.tsx
        │   │   └── PolicyGradientLesson.tsx
        │   │
        │   ├── 📂 playground/        # Playground components
        │   │   ├── GridEditor.tsx
        │   │   ├── AlgorithmSelector.tsx
        │   │   ├── ParameterPanel.tsx
        │   │   └── SimulationVisualization.tsx
        │   │
        │   └── 📂 visualizations/    # Algorithm visualizations
        │       └── BanditVisualization.tsx
        │
        ├── 📂 services/          # API & External services
        │   └── api.ts            # Backend API client
        │
        └── 📂 store/             # State management
            └── useAppStore.ts    # Zustand store
```

---

## 🎯 Key Files Explained

### Backend

| File | Purpose |
|------|---------|
| `main.py` | FastAPI app initialization, CORS, route registration |
| `models.py` | Pydantic schemas for request/response validation |
| `algorithms/bandit.py` | Multi-Armed Bandit with ε-greedy strategy |
| `algorithms/qlearning.py` | Q-Learning with GridWorld environment |
| `algorithms/ppo.py` | Simplified Policy Gradient (PPO placeholder) |
| `routes/simulate.py` | POST `/api/simulate`, GET `/api/simulate/stream/{id}` |
| `routes/progress.py` | WebSocket endpoint for real-time updates |

### Frontend

| File | Purpose |
|------|---------|
| `App.tsx` | Main app with React Router setup |
| `pages/Home.tsx` | Landing page with features overview |
| `pages/LearningMode.tsx` | Chapter-based learning interface |
| `pages/Playground.tsx` | Interactive experimentation sandbox |
| `components/Layout.tsx` | Sidebar navigation and layout |
| `store/useAppStore.ts` | Global state (Zustand) |
| `services/api.ts` | API client with SSE streaming |

---

## 🔄 Data Flow

### Learning Mode Flow
```
User → Lesson Component → Parameters → Visualization
                              ↓
                    Local simulation (frontend)
```

### Playground Mode Flow
```
User → GridEditor → Config
         ↓
      Playground → API Service → POST /api/simulate
         ↓                              ↓
   SimulationViz ← SSE Stream ← Backend Algorithm
```

---

## 🧩 Component Hierarchy

```
App
├── Layout (Sidebar + Header)
│   ├── Home
│   ├── LearningMode
│   │   ├── ChapterNav
│   │   └── Lesson (Bandit/MDP/QLearning/PPO)
│   │       ├── ParameterSlider (multiple)
│   │       └── Visualization
│   └── Playground
│       ├── AlgorithmSelector
│       ├── ParameterPanel
│       ├── GridEditor
│       └── SimulationVisualization
```

---

## 🗄️ State Management

### Zustand Store (`useAppStore`)

**Learning State:**
- `currentChapter`: Active chapter index
- `completedChapters`: Set of completed chapters

**Playground State:**
- `grid`: GridCell array
- `gridWidth`, `gridHeight`: Grid dimensions
- `simulationResults`: Array of episode results
- `isSimulating`: Boolean flag
- `currentSessionId`: Active simulation session

**Persistence:**
- Uses `zustand/middleware/persist`
- Stores progress in localStorage
- Key: `reinforceplay-storage`

---

## 🔌 API Integration

### Endpoints Used

1. **POST `/api/simulate`**
   - Start new simulation
   - Returns `{ session_id, status, ... }`

2. **GET `/api/simulate/stream/{session_id}`**
   - Server-Sent Events (SSE) stream
   - Real-time episode updates

3. **GET `/api/simulate/status/{session_id}`**
   - Check simulation status

4. **GET `/health`**
   - Backend health check

---

## 🎨 Styling System

### Tailwind Classes

**Custom Components (index.css):**
- `.btn` - Base button styles
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button
- `.card` - Card container
- `.input` - Form input
- `.slider` - Range slider

**Theme:**
- Primary: Blue (`#0ea5e9`)
- Accent: Purple/Pink (`#d946ef`)
- Custom animations in `tailwind.config.js`

---

## 🧪 Testing Strategy (TODO)

```
backend/tests/
  - test_algorithms.py
  - test_routes.py

frontend/src/__tests__/
  - components/
  - pages/
  - integration/
```

---

## 📦 Build & Deploy

### Development
```bash
# Backend
cd backend && python main.py

# Frontend
cd frontend && npm run dev
```

### Production
```bash
# Backend
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend && npm run build
# Serve dist/ with nginx or similar
```

---

## 🚀 Extending the App

### Add New Algorithm

1. Create `backend/algorithms/new_algo.py`
2. Add config model to `backend/models.py`
3. Add route handler in `backend/routes/simulate.py`
4. Create `frontend/src/components/lessons/NewAlgoLesson.tsx`
5. Update `LearningMode.tsx` chapters array

### Add New Environment

1. Create environment class in backend
2. Extend `GridCell` or create new model
3. Create editor component in frontend
4. Update playground to support new env type

---

**Need more details? Check component-level comments in the code!**

