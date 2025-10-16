# ReinforcePlay Frontend

Interactive React-based frontend for learning Reinforcement Learning through visualization.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at http://localhost:5173

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar
│   ├── ParameterSlider.tsx
│   ├── lessons/        # Algorithm lesson components
│   │   ├── BanditLesson.tsx
│   │   ├── MDPLesson.tsx
│   │   ├── QLearningLesson.tsx
│   │   └── PolicyGradientLesson.tsx
│   ├── playground/     # Playground mode components
│   │   ├── GridEditor.tsx
│   │   ├── AlgorithmSelector.tsx
│   │   ├── ParameterPanel.tsx
│   │   └── SimulationVisualization.tsx
│   └── visualizations/ # Algorithm visualizations
│       └── BanditVisualization.tsx
├── pages/              # Main page components
│   ├── Home.tsx
│   ├── LearningMode.tsx
│   └── Playground.tsx
├── services/           # API and external services
│   └── api.ts
├── store/              # State management (Zustand)
│   └── useAppStore.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles (Tailwind)
```

## 🎨 Features

### Learning Mode (`/learn`)
- Progressive chapter-based lessons
- Interactive parameter controls
- Real-time algorithm visualizations
- Math formulas with KaTeX
- Progress tracking

**Chapters:**
1. Multi-Armed Bandit
2. Markov Decision Process (MDP)
3. Q-Learning
4. Policy Gradient (PPO)

### Playground Mode (`/playground`)
- Custom environment editor (GridWorld)
- Algorithm selection (Bandit, Q-Learning, PPO)
- Real-time parameter tuning
- Live simulation with streaming results
- Export/Import configurations

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Routing:** React Router
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Math:** KaTeX
- **Icons:** Lucide React

## 🔧 Configuration

Create a `.env` file (copy from `.env.example`):

```bash
VITE_API_BASE=http://localhost:8000
```

## 📡 API Integration

The frontend communicates with the FastAPI backend via:
- REST API (`/api/simulate`)
- Server-Sent Events (SSE) for streaming simulation updates

See `src/services/api.ts` for API client implementation.

## 🎯 Development

### Adding New Algorithm Lessons

1. Create new lesson component in `src/components/lessons/`
2. Add to `chapters` array in `src/pages/LearningMode.tsx`
3. Implement visualization component if needed

### Customizing UI Theme

Edit `tailwind.config.js` to modify colors, animations, etc.

## 🐛 TODO / Known Issues

- [ ] Add Q-value heatmap visualization for Q-Learning
- [ ] Add agent trajectory animation
- [ ] Implement WebSocket alternative to SSE
- [ ] Add user authentication and progress persistence
- [ ] Mobile responsive improvements
- [ ] Add more algorithm variants (SARSA, DQN, etc.)

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Recharts](https://recharts.org/)

## 🤝 Contributing

Contributions welcome! Please:
1. Follow existing code style
2. Add TypeScript types
3. Test thoroughly
4. Update documentation

## 📄 License

MIT License - feel free to use for learning and teaching!

