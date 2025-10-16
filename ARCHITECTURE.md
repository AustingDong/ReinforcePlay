# 🏛️ ReinforcePlay Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ReinforcePlay System                         │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────────┐                    ┌────────────────────────┐
│                       │                    │                        │
│   Frontend (React)    │ ◄───── HTTP ─────► │  Backend (FastAPI)     │
│   localhost:5173      │        SSE         │  localhost:8000        │
│                       │                    │                        │
└───────────────────────┘                    └────────────────────────┘
         │                                              │
         │                                              │
         ▼                                              ▼
┌───────────────────────┐                    ┌────────────────────────┐
│  State Management     │                    │  RL Algorithms         │
│  (Zustand)            │                    │  (NumPy + Gymnasium)   │
│  • Learning Progress  │                    │  • Bandit              │
│  • Grid Config        │                    │  • Q-Learning          │
│  • Simulation Results │                    │  • PPO                 │
└───────────────────────┘                    └────────────────────────┘
         │                                              │
         │                                              │
         ▼                                              ▼
┌───────────────────────┐                    ┌────────────────────────┐
│  localStorage         │                    │  Memory (Temp)         │
│  • User Progress      │                    │  • Active Simulations  │
│  • Grid Configs       │                    │  • Session Data        │
└───────────────────────┘                    └────────────────────────┘
```

---

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser (React App)                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         React Router                             │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐        │
│  │  Home    │  │ Learning Mode│  │   Playground       │        │
│  │   /      │  │   /learn     │  │   /playground      │        │
│  └──────────┘  └──────────────┘  └────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────────┐
        │   Layout     │ │  Pages   │ │  Components  │
        │ (Sidebar)    │ │          │ │              │
        └──────────────┘ └──────────┘ └──────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────────┐
        │   Lessons    │ │Playground│ │Visualizations│
        │  Components  │ │Components│ │  (Charts)    │
        └──────────────┘ └──────────┘ └──────────────┘
                                │
                                ▼
                        ┌──────────────┐
                        │  Zustand     │
                        │  Store       │
                        └──────────────┘
```

### Component Flow - Learning Mode

```
User Interaction Flow:

1. User opens /learn
   │
   ▼
2. LearningMode.tsx renders
   │
   ├─► Chapter Navigation (Sidebar)
   │   └─► Select Chapter 0-3
   │
   ├─► Lesson Component (Center)
   │   ├─► Theory & Math (KaTeX)
   │   ├─► Parameter Sliders
   │   └─► "Simulate" Button
   │
   └─► Visualization Component
       ├─► Local simulation runs
       ├─► Charts update in real-time
       └─► Results displayed

State Updates:
• currentChapter → Zustand
• completedChapters → Zustand → localStorage
• Simulation results → Component state (temporary)
```

### Component Flow - Playground Mode

```
User Interaction Flow:

1. User opens /playground
   │
   ▼
2. Playground.tsx renders
   │
   ├─► Left Panel (Config)
   │   ├─► Algorithm Selector
   │   ├─► Parameter Panel
   │   └─► Grid Settings
   │
   ├─► Center Panel (Editor)
   │   ├─► Grid Editor (if grid-based)
   │   │   ├─► Tool selection
   │   │   └─► Cell placement
   │   └─► Bandit Info (if bandit)
   │
   └─► Right Panel (Results)
       └─► Simulation Visualization
           ├─► Stats display
           ├─► Reward chart
           └─► Episode history

Data Flow:
1. User edits config → Zustand store
2. User clicks "Run" → API call
3. Backend streams results → SSE
4. Frontend updates chart → Real-time
5. Complete → Display final stats
```

---

## Backend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Application                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────────┐
        │   Routes     │ │  Models  │ │ Middleware   │
        │              │ │(Pydantic)│ │   (CORS)     │
        └──────────────┘ └──────────┘ └──────────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
┌──────────────┐ ┌──────────────┐
│  /simulate   │ │  /progress   │
│  (POST/GET)  │ │  (WebSocket) │
└──────────────┘ └──────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│         Background Tasks                │
│  ┌────────────────────────────────┐    │
│  │  run_simulation()              │    │
│  │  ├─► Parse config              │    │
│  │  ├─► Initialize algorithm      │    │
│  │  ├─► Run episodes              │    │
│  │  └─► Stream results (SSE)      │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│         Algorithm Layer                 │
│  ┌─────────────┐  ┌──────────────┐     │
│  │   Bandit    │  │  Q-Learning  │     │
│  │  .simulate  │  │  .simulate   │     │
│  └─────────────┘  └──────────────┘     │
│  ┌─────────────┐                       │
│  │     PPO     │                       │
│  │  .simulate  │                       │
│  └─────────────┘                       │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│      Environment Layer                  │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  GridWorld   │  │  BanditEnv   │    │
│  │  .step()     │  │  .pull()     │    │
│  │  .reset()    │  │  .reward()   │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
```

### API Request Flow

```
Client Request:
POST /api/simulate
{
  "algorithm": "qlearning",
  "config": {
    "grid_width": 5,
    "grid_height": 5,
    "n_episodes": 500,
    "alpha": 0.1,
    "gamma": 0.95,
    "epsilon": 0.1,
    "grid": [...]
  }
}
    │
    ▼
FastAPI Route Handler
    │
    ├─► Validate with Pydantic
    │   (QLearningConfig model)
    │
    ├─► Generate session_id
    │   (UUID)
    │
    ├─► Store in active_simulations
    │   (In-memory dict)
    │
    ├─► Start background task
    │   (BackgroundTasks.add_task)
    │
    └─► Return session_id immediately
        {
          "session_id": "abc123",
          "status": "started",
          "total_episodes": 500
        }

Background Task:
    │
    ▼
Initialize Algorithm
(QLearningAgent + GridWorld)
    │
    ▼
For each episode:
    │
    ├─► Run episode
    │   └─► Step through environment
    │       └─► Update Q-values
    │
    ├─► Store result in queue
    │   (active_simulations[session_id]['results'])
    │
    └─► Continue to next episode

SSE Stream:
GET /api/simulate/stream/{session_id}
    │
    ▼
While session active:
    │
    ├─► Check for new results
    │
    ├─► Format as SSE
    │   data: {"episode": 10, "reward": 5.2, ...}
    │
    └─► Yield to client
        └─► Client updates UI
```

---

## Data Models

### Frontend Types (TypeScript)

```typescript
// Grid Cell
interface GridCell {
  x: number
  y: number
  type: 'empty' | 'obstacle' | 'reward' | 'goal' | 'start'
  value: number
}

// Simulation Result
interface SimulationResult {
  episode: number
  reward: number
  qValues?: number[]
  trajectory?: any[]
  [key: string]: any
}

// App State
interface AppState {
  currentChapter: number
  completedChapters: Set<number>
  simulationResults: SimulationResult[]
  isSimulating: boolean
  grid: GridCell[]
  gridWidth: number
  gridHeight: number
}
```

### Backend Models (Pydantic)

```python
# Algorithm Config
class QLearningConfig(BaseModel):
    grid_width: int
    grid_height: int
    n_episodes: int
    alpha: float  # Learning rate
    gamma: float  # Discount factor
    epsilon: float  # Exploration rate
    grid: List[GridCell]

# Response
class SimulationResponse(BaseModel):
    session_id: str
    status: str
    message: str
    total_episodes: int
```

---

## Communication Protocols

### REST API
```
POST /api/simulate        → Start simulation
GET /api/simulate/status  → Check status
GET /health               → Health check
```

### Server-Sent Events (SSE)
```
GET /api/simulate/stream/{session_id}
→ text/event-stream
→ data: {...}\n\n
```

### WebSocket (Alternative)
```
WS /api/ws/progress/{session_id}
→ Bidirectional real-time updates
```

---

## State Management

### Frontend State (Zustand)

```javascript
┌──────────────────────────────────┐
│       Global State (Zustand)     │
│                                  │
│  ┌────────────────────────────┐ │
│  │  Learning State            │ │
│  │  • currentChapter          │ │
│  │  • completedChapters       │ │
│  └────────────────────────────┘ │
│                                  │
│  ┌────────────────────────────┐ │
│  │  Playground State          │ │
│  │  • grid, gridWidth/Height  │ │
│  │  • simulationResults       │ │
│  │  • isSimulating            │ │
│  │  • currentSessionId        │ │
│  └────────────────────────────┘ │
│                                  │
│  ┌────────────────────────────┐ │
│  │  Actions                   │ │
│  │  • setCurrentChapter()     │ │
│  │  • updateGridCell()        │ │
│  │  • addSimulationResult()   │ │
│  └────────────────────────────┘ │
└──────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│      localStorage (Persist)      │
│  • currentChapter                │
│  • completedChapters (array)     │
│  • gridWidth, gridHeight         │
└──────────────────────────────────┘
```

### Backend State (In-Memory)

```python
active_simulations = {
    'session-id-123': {
        'algorithm': 'qlearning',
        'status': 'running',
        'results': [episode_data...],
        'total_episodes': 500
    }
}
```

---

## Security Considerations

```
┌─────────────────────────────────────────┐
│          Security Layer                 │
│                                         │
│  1. CORS Configuration                  │
│     ✓ Restrict origins                  │
│     ✓ localhost:5173, localhost:3000    │
│                                         │
│  2. Input Validation                    │
│     ✓ Pydantic models                   │
│     ✓ Type checking                     │
│     ✓ Range constraints                 │
│                                         │
│  3. Rate Limiting (TODO)                │
│     ⚠ Add for production                │
│                                         │
│  4. Authentication (TODO)               │
│     ⚠ Add for multi-user                │
│                                         │
│  5. HTTPS (TODO)                        │
│     ⚠ Required for production           │
└─────────────────────────────────────────┘
```

---

## Performance Optimizations

### Frontend
- ✅ Code splitting (Vite)
- ✅ React component memoization
- ✅ Efficient re-renders
- ✅ LocalStorage caching
- 📝 TODO: Lazy loading routes
- 📝 TODO: Virtual scrolling for large lists

### Backend
- ✅ Async/await patterns
- ✅ Background task processing
- ✅ Streaming responses (SSE)
- ✅ NumPy vectorization
- 📝 TODO: Redis caching
- 📝 TODO: Database for persistence

---

## Deployment Architecture

```
Production Setup (Recommended):

┌────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
│                   (nginx/Traefik)                       │
└────────────────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│   Frontend       │    │   Backend        │
│   (Static)       │    │   (FastAPI)      │
│   nginx/CDN      │    │   Gunicorn/      │
│   Port 80/443    │    │   Uvicorn        │
└──────────────────┘    │   Port 8000      │
                        └──────────────────┘
                                │
                        ┌───────┴────────┐
                        ▼                ▼
                ┌──────────────┐ ┌──────────────┐
                │   Redis      │ │  PostgreSQL  │
                │   (Cache)    │ │  (Optional)  │
                └──────────────┘ └──────────────┘
```

---

**This architecture is designed for:**
- ✅ Scalability
- ✅ Maintainability
- ✅ Real-time interactions
- ✅ Educational clarity
- ✅ Easy extension

