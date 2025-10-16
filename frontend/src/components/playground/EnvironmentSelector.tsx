import { motion } from 'framer-motion'
import { Grid3X3, CheckCircle, ChevronRight, Info } from 'lucide-react'

export interface Environment {
  id: string
  name: string
  description: string
  icon: string
  features: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  available: boolean
}

const environments: Environment[] = [
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
  },
  {
    id: 'maze',
    name: 'Maze Navigator',
    description: 'Complex mazes with multiple paths and dead ends',
    icon: '🌀',
    features: [
      'Procedurally generated',
      'Multiple difficulty levels',
      'Sparse rewards',
      'Exploration challenge',
    ],
    difficulty: 'intermediate',
    available: false,
  },
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
  },
]

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 border-green-300',
  intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  advanced: 'bg-red-100 text-red-700 border-red-300',
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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-3xl font-bold mb-2">Select Environment</h2>
          <p className="text-blue-100">Choose a learning environment for your RL agent</p>
        </div>

        {/* Environment List */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          <div className="grid gap-4">
            {environments.map((env) => {
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
                  whileHover={isAvailable ? { scale: 1.02 } : {}}
                  disabled={!isAvailable}
                  className={`
                    relative p-6 rounded-xl border-2 text-left transition-all
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : isAvailable
                      ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                      : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                    }
                  `}
                >
                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-blue-600 fill-blue-100" />
                    </div>
                  )}

                  {/* Coming Soon Badge */}
                  {!isAvailable && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="text-5xl">{env.icon}</div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{env.name}</h3>
                          <p className="text-gray-600 text-sm">{env.description}</p>
                        </div>
                      </div>

                      {/* Difficulty Badge */}
                      <div className="mt-3 mb-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                            difficultyColors[env.difficulty]
                          }`}
                        >
                          {env.difficulty.charAt(0).toUpperCase() + env.difficulty.slice(1)}
                        </span>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {env.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    {isAvailable && (
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">More environments coming soon!</p>
                <p>
                  We're working on adding more diverse environments to test different RL algorithms. 
                  Each environment will challenge your agent in unique ways.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}


