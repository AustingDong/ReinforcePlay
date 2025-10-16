# ReinforcePlay Backend

FastAPI backend for the ReinforcePlay interactive RL learning platform.

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
# Or with uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health status

### Simulation
- `POST /api/simulate` - Start a new RL simulation
- `GET /api/simulate/stream/{session_id}` - Stream simulation updates (SSE)
- `GET /api/simulate/status/{session_id}` - Get simulation status

### Progress (WebSocket)
- `WS /api/ws/progress/{session_id}` - WebSocket for real-time updates

## Algorithm Implementations

### 1. Multi-Armed Bandit (`algorithms/bandit.py`)
- Epsilon-greedy exploration
- Incremental Q-value updates
- Tracks optimal arm selection

### 2. Q-Learning (`algorithms/qlearning.py`)
- GridWorld environment
- Epsilon-greedy policy
- Configurable grid with obstacles and rewards

### 3. PPO (`algorithms/ppo.py`)
- **TODO**: Currently simplified policy gradient
- **TODO**: Implement full PPO with actor-critic networks

## Development

### Adding New Algorithms

1. Create new file in `algorithms/`
2. Implement async simulation function
3. Add route handler in `routes/simulate.py`
4. Update `models.py` with config schema

### Testing

```bash
# Install dev dependencies
pip install pytest pytest-asyncio httpx

# Run tests (TODO: add tests)
pytest
```

## Architecture

```
Backend Flow:
1. Client sends simulation request
2. Server validates config and creates session
3. Algorithm runs in background task
4. Results streamed via SSE or WebSocket
5. Client receives real-time updates
```

