# 🧠 ReinforcePlay

**An Interactive Web Application for Learning Reinforcement Learning Through Visualization**

ReinforcePlay is a full-stack educational platform that makes RL concepts accessible through interactive simulations, step-by-step lessons, and hands-on experimentation.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![React](https://img.shields.io/badge/react-18.2+-61DAFB.svg)
![FastAPI](https://img.shields.io/badge/fastapi-0.109+-009688.svg)

---

## 🚀 Quick Deploy

### Simple Deployment (No Docker)
```bash
# One-time setup
./deploy-simple.sh

# Run on public IP
./run-public.sh
```

Your app is now live on `http://YOUR_SERVER_IP`! See [SIMPLE_DEPLOY.md](./SIMPLE_DEPLOY.md) for details.

### Docker Deployment (Optional)
```bash
./deploy.sh
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Docker and advanced production setup.

---

## ✨ Features

### 📚 Learning Mode
Progressive, chapter-based curriculum covering:
- **Multi-Armed Bandit** - Exploration vs. Exploitation
- **Markov Decision Process (MDP)** - States, Actions, Rewards
- **Q-Learning** - Temporal Difference Learning
- **Policy Gradient (PPO)** - Modern Policy Optimization

Each lesson includes:
- ✅ Clear explanations with mathematical formulas
- ✅ Interactive parameter controls
- ✅ Real-time algorithm visualizations
- ✅ Progress tracking

### 🎮 Playground Mode
Hands-on experimentation sandbox:
- 🗺️ Custom GridWorld environment editor
- 🤖 Multiple RL algorithm selection
- ⚙️ Real-time parameter tuning
- 📊 Live training visualization with streaming results
- 💾 Export/Import environment configurations

---

## 🏗️ Architecture

```
ReinforcePlay/
├── backend/               # FastAPI Python backend
│   ├── algorithms/        # RL algorithm implementations
│   │   ├── bandit.py     # Multi-Armed Bandit
│   │   ├── qlearning.py  # Q-Learning
│   │   └── ppo.py        # PPO (simplified)
│   ├── routes/           # API endpoints
│   ├── models.py         # Pydantic schemas
│   ├── main.py           # FastAPI app
│   └── requirements.txt
│
└── frontend/             # React + Vite frontend
    ├── src/
    │   ├── components/   # UI components
    │   ├── pages/        # Main pages
    │   ├── services/     # API client
    │   └── store/        # State management
    ├── package.json
    └── vite.config.ts
```

### Tech Stack

**Backend:**
- FastAPI (Python)
- NumPy for computations
- Gymnasium for RL environments
- Server-Sent Events (SSE) for streaming

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Zustand (state management)
- Recharts (data visualization)
- KaTeX (math rendering)
- Framer Motion (animations)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

Backend will be available at **http://localhost:8000**

API docs at **http://localhost:8000/docs**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at **http://localhost:5173**

---

## 📖 Usage Guide

### Learning Mode

1. Navigate to **"Learn"** in the sidebar
2. Progress through chapters sequentially
3. Adjust parameters using sliders
4. Click **"Run Simulation"** to see algorithms in action
5. Mark chapters complete as you go

### Playground Mode

1. Navigate to **"Playground"** in the sidebar
2. Select an algorithm (Bandit, Q-Learning, or PPO)
3. For grid-based algorithms:
   - Use the grid editor to place obstacles, rewards, start, and goal
   - Adjust grid dimensions as needed
4. Tune hyperparameters in the left panel
5. Click **"Run Simulation"** to train
6. Watch real-time results in the right panel
7. Export your configuration for later use

---

## 🧪 API Endpoints

### Health Check
```
GET /health
```

### Start Simulation
```
POST /api/simulate
Body: {
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
```

### Stream Results
```
GET /api/simulate/stream/{session_id}
```
Returns Server-Sent Events stream

---

## 🎯 Roadmap & TODOs

### High Priority
- [ ] Add Q-value heatmap visualization for grid environments
- [ ] Implement agent trajectory animation
- [ ] Add more algorithms (SARSA, DQN, A3C)
- [ ] Improve PPO implementation with neural networks

### Medium Priority
- [ ] User authentication and progress persistence
- [ ] LLM integration (Gemini/GPT) for natural language explanations
- [ ] Mobile responsive design improvements
- [ ] Add more environments (CartPole, MountainCar)

### Low Priority
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] Social sharing of configurations
- [ ] Leaderboards for optimal solutions

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add type hints (Python) and TypeScript types
- Write clear commit messages
- Update documentation as needed
- Test thoroughly before submitting

---

## 📚 Learning Resources

### Reinforcement Learning
- [Sutton & Barto - RL: An Introduction](http://incompleteideas.net/book/the-book-2nd.html)
- [OpenAI Spinning Up](https://spinningup.openai.com/)
- [DeepMind x UCL RL Course](https://www.deepmind.com/learning-resources/reinforcement-learning-lecture-series-2021)

### Implementation References
- [Gymnasium Documentation](https://gymnasium.farama.org/)
- [Stable-Baselines3](https://stable-baselines3.readthedocs.io/)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- Built with inspiration from educational RL platforms
- Algorithm implementations based on classic RL papers
- UI/UX inspired by modern educational tools

---

## 📧 Contact

For questions, suggestions, or collaboration:
- Open an issue on GitHub
- Contributions via Pull Requests welcome!

---

**Happy Learning! 🎓🤖**

*Master Reinforcement Learning through interactive visualization and hands-on experimentation.*
