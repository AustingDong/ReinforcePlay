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
      id: 8,
      name: 'Introduction to RL',
      year: '1950s',
      category: 'foundation',
      type: 'framework',
      description: 'Start your RL journey here!',
      features: ['Basics', 'Concepts', 'Overview'],
    },
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
        transition={{ delay: level * 0.05 }}
        className="relative"
      >
        {/* Glow Effect */}
        {isLesson && (
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className={`absolute inset-0 rounded-xl blur-lg ${
              isCompleted ? 'bg-green-400' : 'bg-purple-400'
            } opacity-30`}
          />
        )}

        {/* Card */}
        <motion.div
          whileHover={{ 
            scale: isLesson ? 1.08 : 1.03,
            rotateY: isLesson ? 5 : 0,
          }}
          onClick={handleClick}
          className={`
            relative p-3 rounded-xl shadow-2xl border backdrop-blur-md
            ${isLesson ? 'cursor-pointer' : hasChildren ? 'cursor-pointer' : ''}
            ${isCompleted 
              ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50' 
              : 'border-purple-300 bg-gradient-to-br from-white to-purple-50'
            }
            transition-all duration-300 hover:shadow-2xl
            w-[180px] sm:w-[200px]
          `}
          style={{
            marginLeft: level * 10,
          }}
        >
          {/* Status Icon */}
          {isLesson && (
            <motion.div
              animate={{ rotate: isCompleted ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              {isCompleted ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500 fill-green-100" />
                </motion.div>
              ) : (
                <Circle className="w-5 h-5 text-purple-400" />
              )}
            </motion.div>
          )}

          {/* Header - Compact */}
          <div className="mb-2">
            <h3 className="font-bold text-sm mb-1 text-gray-900">{node.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{node.year}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[node.type]}`}>
                {node.type === 'on-policy' && '📈'}
                {node.type === 'off-policy' && '🔄'}
                {node.type === 'exploration' && '🎯'}
                {node.type === 'framework' && '🏗️'}
              </span>
            </div>
          </div>

          {/* Description - Compact */}
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{node.description}</p>

          {/* Features - Compact */}
          <div className="flex flex-wrap gap-1">
            {node.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Action hint */}
          {isLesson && (
            <motion.div
              whileHover={{ x: 5 }}
              className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-xs"
            >
              <span className="text-gray-500 font-medium">Learn →</span>
              <BookOpen className="w-3 h-3 text-purple-400" />
            </motion.div>
          )}

          {hasChildren && !isLesson && (
            <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-center">
              <motion.button
                className="text-xs text-purple-600 font-semibold"
                animate={{ rotate: isExpanded ? 180 : 0 }}
              >
                ▼
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Connection Line to Children */}
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 32 }}
            className="w-0.5 bg-gradient-to-b from-purple-400 to-transparent mx-auto"
          />
        )}
      </motion.div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex flex-wrap justify-center ${node.children!.length > 1 ? 'gap-2 sm:gap-4' : ''} mt-4 relative`}
        >
          {node.children!.length > 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent -translate-y-4"
            />
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
        </motion.div>
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Floating Particles */}
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0, Math.random(), 0],
              scale: [0, Math.random() * 2, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Large Floating Shapes */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              width: 100 + Math.random() * 300,
              height: 100 + Math.random() * 300,
              background: `radial-gradient(circle, ${
                ['#60A5FA', '#A78BFA', '#F472B6'][Math.floor(Math.random() * 3)]
              }, transparent)`,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.h1
            animate={{
              textShadow: [
                '0 0 20px rgba(139, 92, 246, 0.5)',
                '0 0 40px rgba(139, 92, 246, 0.8)',
                '0 0 20px rgba(139, 92, 246, 0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl md:text-5xl font-bold mb-3 text-white"
          >
            🧠 RL Algorithm Universe
          </motion.h1>
          <p className="text-lg text-purple-200">
            Discover the evolution of reinforcement learning
          </p>

          {/* Compact Stats Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-6 mt-6 px-6 py-3 bg-white bg-opacity-10 backdrop-blur-xl rounded-full border border-white border-opacity-20"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-2 h-2 rounded-full bg-blue-400"
              />
              <span className="text-sm text-white font-semibold">10 Lessons</span>
            </div>
            <div className="w-px h-6 bg-white bg-opacity-20" />
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-400"
              />
              <span className="text-sm text-white font-semibold">{completedSet.size} Complete</span>
            </div>
            <div className="w-px h-6 bg-white bg-opacity-20" />
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-purple-400"
              />
              <span className="text-sm text-white font-semibold">
                {Math.round((completedSet.size / 10) * 100)}%
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Tree Visualization - Responsive */}
        <div className="overflow-x-auto overflow-y-visible pb-12">
          <div className="flex justify-center px-4" style={{ minWidth: 'fit-content', transformOrigin: 'center top' }}>
            <div className="scale-75 sm:scale-90 md:scale-100 origin-top">
              <TreeNodeCard
                node={algorithmTree}
                level={0}
                isCompleted={false}
                onSelect={handleSelectLesson}
              />
            </div>
          </div>
        </div>

        {/* Compact Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto mt-12 p-6 bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl border border-white border-opacity-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
            {[
              { icon: '📊', label: 'Depth = Timeline' },
              { icon: '🌳', label: 'Branches = Evolution' },
              { icon: '🎯', label: 'Click to Learn' },
              { icon: '✨', label: 'Expand Nodes' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

