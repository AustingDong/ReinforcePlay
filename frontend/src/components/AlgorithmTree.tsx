import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Circle, BookOpen, Calendar, Zap, TrendingUp } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

interface TreeNode {
  id: number
  name: string
  year: string
  category: 'foundation' | 'value-based' | 'policy-gradient'
  type: 'on-policy' | 'off-policy' | 'exploration' | 'framework'
  description: string
  features: string[]
  children?: TreeNode[]
}

const algorithmTree: TreeNode = {
  id: -1,
  name: 'Reinforcement Learning',
  year: '1950s',
  category: 'foundation',
  type: 'framework',
  description: 'Learning through interaction with environment',
  features: ['Agent', 'Environment', 'Reward', 'Policy'],
  children: [
    {
      id: 0,
      name: 'Multi-Armed Bandit',
      year: '1952',
      category: 'foundation',
      type: 'exploration',
      description: 'Exploration vs Exploitation tradeoff',
      features: ['ε-greedy', 'Action value', 'No state'],
    },
    {
      id: 1,
      name: 'Markov Decision Process',
      year: '1950s',
      category: 'foundation',
      type: 'framework',
      description: 'Mathematical framework for sequential decisions',
      features: ['States', 'Actions', 'Transitions', 'Rewards'],
      children: [
        {
          id: -2,
          name: 'Value-Based Methods',
          year: '1980s-1990s',
          category: 'value-based',
          type: 'framework',
          description: 'Learn value of states/actions',
          features: ['Q-function', 'Value function', 'Bootstrapping'],
          children: [
            {
              id: 2,
              name: 'Q-Learning',
              year: '1989',
              category: 'value-based',
              type: 'off-policy',
              description: 'Off-policy TD control',
              features: ['Q-table', 'Max operator', 'Model-free'],
            },
            {
              id: 4,
              name: 'TD(λ)',
              year: '1988',
              category: 'value-based',
              type: 'on-policy',
              description: 'Eligibility traces bridge TD and MC',
              features: ['Traces', 'λ decay', 'Credit assignment'],
            },
            {
              id: 3,
              name: 'SARSA',
              year: '1994',
              category: 'value-based',
              type: 'on-policy',
              description: 'On-policy TD control',
              features: ['On-policy', 'Safe learning', 'TD update'],
            },
          ],
        },
        {
          id: -3,
          name: 'Policy Gradient Methods',
          year: '1990s-2017',
          category: 'policy-gradient',
          type: 'framework',
          description: 'Directly optimize policy',
          features: ['Policy parameters', 'Gradient ascent', 'Continuous actions'],
          children: [
            {
              id: 5,
              name: 'REINFORCE',
              year: '1992',
              category: 'policy-gradient',
              type: 'on-policy',
              description: 'Monte Carlo policy gradient',
              features: ['Log likelihood', 'Full episodes', 'High variance'],
            },
            {
              id: -4,
              name: 'Actor-Critic Branch',
              year: '2015-2017',
              category: 'policy-gradient',
              type: 'framework',
              description: 'Combine policy and value learning',
              features: ['Actor', 'Critic', 'Lower variance'],
              children: [
                {
                  id: -5,
                  name: 'Trust Region Methods',
                  year: '2015',
                  category: 'policy-gradient',
                  type: 'on-policy',
                  description: 'Constrained policy updates',
                  features: ['KL constraint', 'Stable updates'],
                  children: [
                    {
                      id: 6,
                      name: 'A2C',
                      year: '2016',
                      category: 'policy-gradient',
                      type: 'on-policy',
                      description: 'Advantage Actor-Critic',
                      features: ['Advantage', 'Synchronous', 'Baseline'],
                    },
                    {
                      id: 7,
                      name: 'PPO',
                      year: '2017',
                      category: 'policy-gradient',
                      type: 'on-policy',
                      description: 'Clipped surrogate objective',
                      features: ['Clip ratio', 'Simple', 'SOTA'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const categoryColors = {
  foundation: 'from-blue-500 to-blue-600',
  'value-based': 'from-green-500 to-green-600',
  'policy-gradient': 'from-purple-500 to-purple-600',
}

const typeColors = {
  'on-policy': 'bg-orange-100 text-orange-700 border-orange-300',
  'off-policy': 'bg-cyan-100 text-cyan-700 border-cyan-300',
  exploration: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  framework: 'bg-gray-100 text-gray-700 border-gray-300',
}

interface TreeNodeCardProps {
  node: TreeNode
  level: number
  isCompleted: boolean
  onSelect: (id: number) => void
}

function TreeNodeCard({ node, level, isCompleted, onSelect }: TreeNodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const hasChildren = node.children && node.children.length > 0
  const isLesson = node.id >= 0 // Actual lessons have id >= 0

  const handleClick = () => {
    if (isLesson) {
      onSelect(node.id)
    } else if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: level * 0.1 }}
        className="relative"
      >
        {/* Card */}
        <motion.div
          whileHover={{ scale: isLesson ? 1.05 : 1.02 }}
          onClick={handleClick}
          className={`
            relative p-4 rounded-xl shadow-lg border-2 backdrop-blur-sm
            ${isLesson ? 'cursor-pointer' : hasChildren ? 'cursor-pointer' : ''}
            ${isCompleted ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'}
            transition-all duration-300 hover:shadow-xl
            min-w-[280px] max-w-[320px]
          `}
          style={{
            marginLeft: level * 20,
          }}
        >
          {/* Status Icon */}
          {isLesson && (
            <div className="absolute -top-2 -right-2">
              {isCompleted ? (
                <CheckCircle className="w-6 h-6 text-green-500 fill-green-100" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400" />
              )}
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{node.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>{node.year}</span>
              </div>
            </div>
          </div>

          {/* Type Badge */}
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border mb-2 ${typeColors[node.type]}`}>
            {node.type === 'on-policy' && '📈'}
            {node.type === 'off-policy' && '🔄'}
            {node.type === 'exploration' && '🎯'}
            {node.type === 'framework' && '🏗️'}
            <span>{node.type}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3">{node.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {node.features.map((feature, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Action hint */}
          {isLesson && (
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">Click to learn</span>
              <BookOpen className="w-4 h-4 text-gray-400" />
            </div>
          )}

          {hasChildren && !isLesson && (
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-center">
              <motion.button
                className="text-xs text-blue-600 font-semibold"
                animate={{ rotate: isExpanded ? 180 : 0 }}
              >
                ▼
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Connection Line to Children */}
        {hasChildren && isExpanded && (
          <div className="w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent mx-auto" />
        )}
      </motion.div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className={`flex ${node.children!.length > 1 ? 'gap-6' : ''} mt-4 relative`}>
          {node.children!.length > 1 && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent -translate-y-4" />
          )}
          {node.children!.map((child, idx) => (
            <TreeNodeCard
              key={child.id}
              node={child}
              level={level + 1}
              isCompleted={isCompleted}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AlgorithmTree() {
  const navigate = useNavigate()
  const completedChapters = useAppStore((state) => state.completedChapters)

  const handleSelectLesson = (id: number) => {
    navigate(`/learn/${id}`)
  }

  const completedSet = completedChapters instanceof Set
    ? completedChapters
    : new Set(completedChapters)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
            RL Algorithm Family Tree
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Explore the evolution and relationships of reinforcement learning algorithms
          </p>

          {/* Legend */}
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600">Foundation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">Value-Based</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500" />
              <span className="text-sm text-gray-600">Policy Gradient</span>
            </div>
          </div>

          <div className="flex justify-center gap-6 flex-wrap mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm px-2 py-1 bg-orange-100 text-orange-700 rounded-full border border-orange-300">
                📈 On-policy
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full border border-cyan-300">
                🔄 Off-policy
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-12 p-6 bg-white rounded-2xl shadow-lg"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">Total Algorithms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{completedSet.size}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {Math.round((completedSet.size / 8) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
        </motion.div>

        {/* Tree Visualization */}
        <div className="overflow-x-auto pb-12">
          <div className="min-w-max flex justify-center">
            <TreeNodeCard
              node={algorithmTree}
              level={0}
              isCompleted={false}
              onSelect={handleSelectLesson}
            />
          </div>
        </div>

        {/* Timeline indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Timeline View</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>📊 <strong>Depth</strong> in the tree represents chronological progression</p>
            <p>🌳 <strong>Branches</strong> show how algorithms evolved from foundational concepts</p>
            <p>🎯 <strong>Click on lessons</strong> to start learning that algorithm</p>
            <p>✨ <strong>Framework nodes</strong> can be expanded to explore their descendants</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

