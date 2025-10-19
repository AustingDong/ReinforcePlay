import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Circle, BookOpen, Sparkles, Trophy } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

interface TreeNode {
  id: number
  name: string
  year: string
  category: 'foundation' | 'value-based' | 'policy-gradient'
  type: 'on-policy' | 'off-policy' | 'exploration' | 'framework'
  description: string
  features: string[]
  icon: string
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
  icon: '🧠',
  children: [
    {
      id: 0,
      name: 'Introduction to RL',
      year: '1950s',
      category: 'foundation',
      type: 'framework',
      description: 'Start your RL journey here!',
      features: ['Basics', 'Concepts', 'Overview'],
      icon: '📚',
    },
    {
      id: 1,
      name: 'Multi-Armed Bandit',
      year: '1952',
      category: 'foundation',
      type: 'exploration',
      description: 'Exploration vs Exploitation tradeoff',
      features: ['ε-greedy', 'Action value', 'No state'],
      icon: '🎰',
    },
    {
      id: 2,
      name: 'Markov Decision Process',
      year: '1950s',
      category: 'foundation',
      type: 'framework',
      description: 'Mathematical framework for sequential decisions',
      features: ['States', 'Actions', 'Transitions', 'Rewards'],
      icon: '🗺️',
      children: [
        {
          id: -2,
          name: 'Value-Based Methods',
          year: '1980s-1990s',
          category: 'value-based',
          type: 'framework',
          description: 'Learn value of states/actions',
          features: ['Q-function', 'Value function', 'Bootstrapping'],
          icon: '📊',
          children: [
            {
              id: 3,
              name: 'Q-Learning',
              year: '1989',
              category: 'value-based',
              type: 'off-policy',
              description: 'Off-policy TD control',
              features: ['Q-table', 'Max operator', 'Model-free'],
              icon: '🎯',
            },
            {
              id: 4,
              name: 'SARSA',
              year: '1994',
              category: 'value-based',
              type: 'on-policy',
              description: 'On-policy TD control',
              features: ['On-policy', 'Safe learning', 'TD update'],
              icon: '🛡️',
            },
            {
              id: 5,
              name: 'TD(λ)',
              year: '1988',
              category: 'value-based',
              type: 'on-policy',
              description: 'Eligibility traces bridge TD and MC',
              features: ['Traces', 'λ decay', 'Credit assignment'],
              icon: '⏰',
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
          icon: '🚀',
          children: [
            {
              id: 6,
              name: 'REINFORCE',
              year: '1992',
              category: 'policy-gradient',
              type: 'on-policy',
              description: 'Monte Carlo policy gradient',
              features: ['Log likelihood', 'Full episodes', 'High variance'],
              icon: '🧬',
            },
            {
              id: -4,
              name: 'Actor-Critic Branch',
              year: '2015-2017',
              category: 'policy-gradient',
              type: 'framework',
              description: 'Combine policy and value learning',
              features: ['Actor', 'Critic', 'Lower variance'],
              icon: '🎭',
              children: [
                {
                  id: 7,
                  name: 'A2C',
                  year: '2016',
                  category: 'policy-gradient',
                  type: 'on-policy',
                  description: 'Advantage Actor-Critic',
                  features: ['Advantage', 'Synchronous', 'Baseline'],
                  icon: '⚡',
                },
                {
                  id: 8,
                  name: 'PPO',
                  year: '2017',
                  category: 'policy-gradient',
                  type: 'on-policy',
                  description: 'Clipped surrogate objective',
                  features: ['Clip ratio', 'Simple', 'SOTA'],
                  icon: '🏆',
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
  foundation: 'from-blue-400 via-blue-500 to-blue-600',
  'value-based': 'from-green-400 via-green-500 to-green-600',
  'policy-gradient': 'from-purple-400 via-purple-500 to-purple-600',
}

const typeIcons = {
  'on-policy': '📈',
  'off-policy': '🔄',
  exploration: '🎯',
  framework: '🏗️',
}

interface TreeNodeCardProps {
  node: TreeNode
  isCompleted: boolean
  onSelect: (id: number) => void
  depth: number
}

function TreeNodeCard({ node, isCompleted, onSelect, depth }: TreeNodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2)
  const hasChildren = node.children && node.children.length > 0
  const isLesson = node.id >= 0

  const handleClick = () => {
    if (isLesson) {
      onSelect(node.id)
    } else if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: depth * 0.1, type: 'spring', stiffness: 200 }}
        className="relative"
      >
        {/* Glow for lessons */}
        {isLesson && (
          <motion.div
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute -inset-1 rounded-2xl blur-xl ${
              isCompleted ? 'bg-green-400' : 'bg-purple-400'
            }`}
          />
        )}

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          onClick={handleClick}
          className={`
            relative w-44 p-4 rounded-2xl cursor-pointer
            backdrop-blur-xl border-2 shadow-2xl
            ${
              isCompleted
                ? 'border-green-400 bg-gradient-to-br from-green-50/90 to-emerald-50/90'
                : 'border-purple-300 bg-gradient-to-br from-white/90 to-purple-50/90'
            }
            ${isLesson ? 'hover:border-purple-400' : ''}
            transition-all duration-300
          `}
        >
          {/* Completion Badge */}
          {isLesson && (
            <motion.div
              animate={isCompleted ? { rotate: [0, 360] } : {}}
              transition={{ duration: 0.6 }}
              className="absolute -top-3 -right-3 z-10"
            >
              {isCompleted ? (
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-green-400 blur-md"
                  />
                  <CheckCircle className="relative w-7 h-7 text-green-500 fill-white" />
                </div>
              ) : (
                <Circle className="w-7 h-7 text-purple-400" />
              )}
            </motion.div>
          )}

          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="text-4xl mb-2 text-center"
          >
            {node.icon}
          </motion.div>

          {/* Name & Year */}
          <h3 className="font-bold text-center text-sm mb-1 text-gray-900 leading-tight">
            {node.name}
          </h3>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs text-gray-500 font-semibold">{node.year}</span>
            <span className="text-lg">{typeIcons[node.type]}</span>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 text-center mb-2 line-clamp-2">
            {node.description}
          </p>

          {/* Features Badges */}
          <div className="flex flex-wrap gap-1 justify-center">
            {node.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${categoryColors[node.category]} text-white font-medium`}
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Expand/Learn Button */}
          {hasChildren && (
            <motion.button
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold shadow-lg"
            >
              ▼
            </motion.button>
          )}

          {isLesson && (
            <motion.div
              whileHover={{ x: 3 }}
              className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-center gap-1 text-xs font-bold text-purple-600"
            >
              <BookOpen className="w-3 h-3" />
              <span>Learn</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Connection Line */}
      {hasChildren && isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 40 }}
          className="w-1 bg-gradient-to-b from-purple-400 to-transparent rounded-full"
        />
      )}

      {/* Children */}
      {hasChildren && isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative flex justify-center items-start gap-6 mt-2"
        >
          {/* Horizontal Connector */}
          {node.children!.length > 1 && (
            <svg
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ transform: 'translateY(-20px)' }}
            >
              <motion.line
                x1="20%"
                y1="0"
                x2="80%"
                y2="0"
                stroke="url(#gradient)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="rgb(168, 85, 247)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {node.children!.map((child) => (
            <TreeNodeCard
              key={child.id}
              node={child}
              isCompleted={isCompleted}
              onSelect={onSelect}
              depth={depth + 1}
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const handleSelectLesson = (id: number) => {
    navigate(`/learn/${id}`)
  }

  const completedSet = completedChapters instanceof Set ? completedChapters : new Set(completedChapters)

  // Dynamic scaling based on container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const baseWidth = 1400 // Base width for 100% scale
        const newScale = Math.min(containerWidth / baseWidth, 1)
        setScale(Math.max(newScale, 0.5)) // Min 50% scale
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, Math.random(), 0],
            }}
            transition={{
              duration: 3 + Math.random() * 7,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Radial Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1
            animate={{
              textShadow: [
                '0 0 20px rgba(168, 85, 247, 0.8)',
                '0 0 40px rgba(168, 85, 247, 1)',
                '0 0 20px rgba(168, 85, 247, 0.8)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent"
          >
            ✨ RL Universe ✨
          </motion.h1>
          <p className="text-xl text-purple-200 font-medium">
            Interactive Algorithm Journey
          </p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-8 mt-8 px-8 py-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-6 h-6 text-blue-300" />
              </motion.div>
              <div className="text-left">
                <div className="text-2xl font-black text-white">9</div>
                <div className="text-xs text-purple-200">Lessons</div>
              </div>
            </div>

            <div className="w-px h-12 bg-white/20" />

            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-6 h-6 text-green-300" />
              </motion.div>
              <div className="text-left">
                <div className="text-2xl font-black text-white">{completedSet.size}</div>
                <div className="text-xs text-purple-200">Completed</div>
              </div>
            </div>

            <div className="w-px h-12 bg-white/20" />

            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16">
                <svg className="transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="3"
                    strokeDasharray="100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - (completedSet.size / 9) * 100 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progressGradient">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
                  {Math.round((completedSet.size / 9) * 100)}%
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tree Container with Dynamic Scaling */}
        <div ref={containerRef} className="w-full overflow-x-auto overflow-y-visible pb-20">
          <motion.div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
            transition={{ duration: 0.3 }}
            className="inline-block min-w-full"
          >
            <div className="flex justify-center py-8">
              <TreeNodeCard
                node={algorithmTree}
                isCompleted={false}
                onSelect={handleSelectLesson}
                depth={0}
              />
            </div>
          </motion.div>
        </div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-12 p-6 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🌳', title: 'Tree View', desc: 'Visual hierarchy' },
              { icon: '⏱️', title: 'Timeline', desc: 'Historical order' },
              { icon: '🎯', title: 'Interactive', desc: 'Click to learn' },
              { icon: '✨', title: 'Progress', desc: 'Track completion' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-4xl">{item.icon}</span>
                <div className="text-sm font-bold text-white">{item.title}</div>
                <div className="text-xs text-purple-200">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
