import { motion } from 'framer-motion'
import { BookOpen, ExternalLink, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AlgorithmInfoProps {
  algorithm: string
}

const algorithmData: Record<string, {
  name: string
  description: string
  bestFor: string
  chapterId: number
  emoji: string
  color: string
}> = {
  bandit: {
    name: 'Multi-Armed Bandit',
    description: 'Learn how to balance exploration (trying new things) with exploitation (using what works).',
    bestFor: 'Beginners! Start here to understand the basics of decision-making under uncertainty.',
    chapterId: 1,
    emoji: '🎰',
    color: 'blue'
  },
  qlearning: {
    name: 'Q-Learning',
    description: 'Learns the value of actions in different states. Works by trying actions and updating estimates.',
    bestFor: 'Problems where you want the agent to learn from experience without needing a model of the world.',
    chapterId: 3,
    emoji: '🎯',
    color: 'green'
  },
  sarsa: {
    name: 'SARSA',
    description: 'Like Q-Learning, but learns while following its own policy. More cautious and safe!',
    bestFor: 'When you want the agent to consider the consequences of its exploration during training.',
    chapterId: 4,
    emoji: '🛡️',
    color: 'cyan'
  },
  td_lambda: {
    name: 'TD(λ)',
    description: 'Bridges short-term and long-term learning using "eligibility traces" - memories of past actions.',
    bestFor: 'When you want to credit past actions for current rewards (like connecting moves in chess).',
    chapterId: 5,
    emoji: '🌉',
    color: 'indigo'
  },
  reinforce: {
    name: 'REINFORCE',
    description: 'The first policy gradient method! Directly learns which actions to take, not just their values.',
    bestFor: 'Continuous action spaces and when you want to learn a probability distribution over actions.',
    chapterId: 6,
    emoji: '🚀',
    color: 'purple'
  },
  a2c: {
    name: 'A2C (Advantage Actor-Critic)',
    description: 'Combines the best of value-based and policy-based methods with an "advantage" function.',
    bestFor: 'Complex tasks requiring both value estimates and policy learning with lower variance.',
    chapterId: 7,
    emoji: '🎭',
    color: 'pink'
  },
  trpo: {
    name: 'TRPO (Trust Region)',
    description: 'Ensures policy updates aren\'t too large using a "trust region" constraint.',
    bestFor: 'When stability is crucial - prevents catastrophic policy changes during learning.',
    chapterId: -1, // No dedicated chapter yet
    emoji: '⚖️',
    color: 'amber'
  },
  ppo: {
    name: 'PPO (Proximal Policy Optimization)',
    description: 'A simplified, clipped version of TRPO that\'s become the industry standard. Fast and reliable!',
    bestFor: 'State-of-the-art performance on complex tasks. Great for robotics and game AI.',
    chapterId: 8,
    emoji: '⭐',
    color: 'orange'
  }
}

export default function AlgorithmInfo({ algorithm }: AlgorithmInfoProps) {
  const navigate = useNavigate()
  const info = algorithmData[algorithm]
  
  if (!info) return null
  
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 border-blue-300 bg-blue-50',
    green: 'from-green-500 to-green-600 border-green-300 bg-green-50',
    cyan: 'from-cyan-500 to-cyan-600 border-cyan-300 bg-cyan-50',
    indigo: 'from-indigo-500 to-indigo-600 border-indigo-300 bg-indigo-50',
    purple: 'from-purple-500 to-purple-600 border-purple-300 bg-purple-50',
    pink: 'from-pink-500 to-pink-600 border-pink-300 bg-pink-50',
    amber: 'from-amber-500 to-amber-600 border-amber-300 bg-amber-50',
    orange: 'from-orange-500 to-orange-600 border-orange-300 bg-orange-50'
  }
  
  const colors = colorClasses[info.color as keyof typeof colorClasses]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border-2 p-4 ${colors.split(' ')[2]} ${colors.split(' ')[3]}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-4xl">{info.emoji}</div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{info.name}</h3>
          <p className="text-sm text-gray-700 mb-2">{info.description}</p>
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              <strong>Best for:</strong> {info.bestFor}
            </p>
          </div>
          
          {info.chapterId >= 0 && (
            <button
              onClick={() => navigate(`/learn/${info.chapterId}`)}
              className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${colors.split(' ')[0]} ${colors.split(' ')[1]} text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Learn More About {info.name.split(' ')[0]}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

