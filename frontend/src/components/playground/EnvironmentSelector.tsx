import { motion } from 'framer-motion'
import { CheckCircle, ChevronRight, Info } from 'lucide-react'

export interface Environment {
  id: string
  name: string
  description: string
  icon: string
  features: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  available: boolean
  category: 'bandit' | 'grid' | 'continuous' | 'special'
  algorithms?: string[]
}

const environments: Environment[] = [
  // Available Environments
  {
    id: 'multi-armed-bandit',
    name: 'Multi-Armed Bandit',
    description: 'Explore vs exploit tradeoff with slot machines',
    icon: '🎰',
    features: [
      'No state transitions',
      'Instant feedback',
      'Exploration challenge',
      'Classic problem',
    ],
    difficulty: 'beginner',
    available: true,
    category: 'bandit',
    algorithms: ['bandit'],
  },
  {
    id: 'classic-grid',
    name: 'Classic GridWorld',
    description: 'Navigate a grid with obstacles and rewards to reach the goal',
    icon: '🎯',
    features: [
      'Customizable grid size',
      'Obstacles and rewards',
      'Discrete actions',
      'Fully observable',
    ],
    difficulty: 'beginner',
    available: true,
    category: 'grid',
    algorithms: ['qlearning', 'sarsa', 'td_lambda', 'reinforce', 'a2c', 'trpo', 'ppo'],
  },
  
  // Future Grid-Based Environments
  {
    id: 'cliff-walking',
    name: 'Cliff Walking',
    description: 'Walk along a dangerous cliff without falling off',
    icon: '🏔️',
    features: [
      'High negative rewards',
      'Risk-reward tradeoff',
      'On/off-policy comparison',
      'Classic benchmark',
    ],
    difficulty: 'intermediate',
    available: false,
    category: 'grid',
    algorithms: ['qlearning', 'sarsa', 'td_lambda'],
  },
  {
    id: 'windy-gridworld',
    name: 'Windy GridWorld',
    description: 'Navigate with unpredictable wind affecting movements',
    icon: '💨',
    features: [
      'Stochastic transitions',
      'Environmental forces',
      'Adaptation required',
      'Robust learning',
    ],
    difficulty: 'advanced',
    available: false,
    category: 'grid',
    algorithms: ['qlearning', 'sarsa', 'td_lambda', 'a2c', 'ppo'],
  },
  
  // Future Continuous Control Environments
  {
    id: 'racetrack',
    name: 'Racetrack Challenge',
    description: 'Control a race car to complete laps as fast as possible',
    icon: '🏎️',
    features: [
      'Continuous control',
      'Velocity and position',
      'Time-optimal racing',
      'Physics simulation',
    ],
    difficulty: 'advanced',
    available: false,
    category: 'continuous',
    algorithms: ['reinforce', 'a2c', 'trpo', 'ppo'],
  },
  {
    id: 'cartpole',
    name: 'CartPole Balance',
    description: 'Balance a pole on a moving cart using left/right forces',
    icon: '🎪',
    features: [
      'Classic control task',
      'Continuous observations',
      'Discrete actions',
      'Unstable dynamics',
    ],
    difficulty: 'intermediate',
    available: false,
    category: 'continuous',
    algorithms: ['reinforce', 'a2c', 'ppo'],
  },
  {
    id: 'mountain-car',
    name: 'Mountain Car',
    description: 'Build momentum to reach the goal on top of a hill',
    icon: '🚗',
    features: [
      'Sparse rewards',
      'Momentum required',
      'Delayed gratification',
      'Classic challenge',
    ],
    difficulty: 'intermediate',
    available: false,
    category: 'continuous',
    algorithms: ['qlearning', 'sarsa', 'a2c', 'ppo'],
  },
  
  // Future Special Environments
  {
    id: 'rlhf',
    name: 'RLHF Simulator',
    description: 'Learn from human feedback to align AI behavior',
    icon: '🤝',
    features: [
      'Human preferences',
      'Reward modeling',
      'Alignment training',
      'Modern technique',
    ],
    difficulty: 'advanced',
    available: false,
    category: 'special',
    algorithms: ['ppo', 'trpo'],
  },
  {
    id: 'lunar-lander',
    name: 'Lunar Lander',
    description: 'Land a spacecraft safely on the moon surface',
    icon: '🚀',
    features: [
      'Continuous control',
      'Fuel management',
      'Precision landing',
      'Physics-based',
    ],
    difficulty: 'advanced',
    available: false,
    category: 'continuous',
    algorithms: ['reinforce', 'a2c', 'ppo'],
  },
]

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 border-green-300',
  intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  advanced: 'bg-red-100 text-red-700 border-red-300',
}

const categoryIcons = {
  bandit: '🎰',
  grid: '🎯',
  continuous: '🎮',
  special: '✨',
}

const categoryNames = {
  bandit: 'Bandit Problems',
  grid: 'Grid-Based',
  continuous: 'Continuous Control',
  special: 'Special Environments',
}

interface EnvironmentSelectorProps {
  selectedEnvironment: string
  onSelectEnvironment: (envId: string) => void
  onClose: () => void
}

export default function EnvironmentSelector({
  selectedEnvironment,
  onSelectEnvironment,
  onClose,
}: EnvironmentSelectorProps) {
  // Group environments by category
  const groupedEnvironments = environments.reduce((acc, env) => {
    if (!acc[env.category]) {
      acc[env.category] = []
    }
    acc[env.category].push(env)
    return acc
  }, {} as Record<string, Environment[]>)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white p-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            🌍 Select Environment
          </h2>
          <p className="text-blue-100">Choose a learning environment for your RL agent</p>
        </div>

        {/* Environment List */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          {Object.entries(groupedEnvironments).map(([category, envs]) => (
            <div key={category} className="mb-8 last:mb-0">
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                <h3 className="text-lg font-bold text-gray-900">
                  {categoryNames[category as keyof typeof categoryNames]}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-2" />
              </div>

              {/* Environments in this category */}
              <div className="grid gap-4 md:grid-cols-2">
                {envs.map((env) => {
                  const isSelected = env.id === selectedEnvironment
                  const isAvailable = env.available

                  return (
                    <motion.button
                      key={env.id}
                      onClick={() => {
                        if (isAvailable) {
                          onSelectEnvironment(env.id)
                          onClose()
                        }
                      }}
                      whileHover={isAvailable ? { scale: 1.02, y: -2 } : {}}
                      disabled={!isAvailable}
                      className={`
                        relative p-5 rounded-xl border-2 text-left transition-all
                        ${isSelected
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg'
                          : isAvailable
                          ? 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                          : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        }
                      `}
                    >
                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="w-6 h-6 text-purple-600 fill-purple-100" />
                        </div>
                      )}

                      {/* Coming Soon Badge */}
                      {!isAvailable && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-semibold rounded-full shadow-sm">
                            Coming Soon
                          </span>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="text-4xl">{env.icon}</div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 className="text-lg font-bold mb-1">{env.name}</h4>
                          <p className="text-gray-600 text-xs mb-3 line-clamp-2">{env.description}</p>

                          {/* Difficulty Badge */}
                          <div className="mb-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                difficultyColors[env.difficulty]
                              }`}
                            >
                              {env.difficulty.charAt(0).toUpperCase() + env.difficulty.slice(1)}
                            </span>
                          </div>

                          {/* Features */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {env.features.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600">
                                <div className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
                                <span className="truncate">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Arrow */}
                        {isAvailable && (
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">🚀 Expanding RL Universe</p>
                <p>
                  We're building a diverse collection of environments! From classic control tasks to cutting-edge RLHF simulations,
                  each environment will challenge your agents in unique ways. Stay tuned for updates!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg font-semibold transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export { environments }
