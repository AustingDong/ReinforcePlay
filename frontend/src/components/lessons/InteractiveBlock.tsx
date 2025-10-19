import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Lightbulb, Code, Zap, ChevronDown, ChevronUp } from 'lucide-react'

interface InteractiveBlockProps {
  type: 'story' | 'interactive' | 'code' | 'challenge' | 'insight' | 'comparison'
  title: string
  children: ReactNode
  defaultExpanded?: boolean
  icon?: ReactNode
}

const blockStyles = {
  story: {
    gradient: 'from-purple-50 to-pink-50',
    border: 'border-purple-300',
    icon: '📖',
    iconBg: 'from-purple-500 to-pink-500',
  },
  interactive: {
    gradient: 'from-blue-50 to-cyan-50',
    border: 'border-blue-300',
    icon: '🎮',
    iconBg: 'from-blue-500 to-cyan-500',
  },
  code: {
    gradient: 'from-gray-50 to-slate-50',
    border: 'border-gray-300',
    icon: '💻',
    iconBg: 'from-gray-600 to-slate-600',
  },
  challenge: {
    gradient: 'from-orange-50 to-red-50',
    border: 'border-orange-300',
    icon: '🎯',
    iconBg: 'from-orange-500 to-red-500',
  },
  insight: {
    gradient: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-300',
    icon: '💡',
    iconBg: 'from-yellow-500 to-amber-500',
  },
  comparison: {
    gradient: 'from-green-50 to-emerald-50',
    border: 'border-green-300',
    icon: '⚖️',
    iconBg: 'from-green-500 to-emerald-500',
  },
}

export default function InteractiveBlock({
  type,
  title,
  children,
  defaultExpanded = true,
  icon,
}: InteractiveBlockProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const style = blockStyles[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-gradient-to-br ${style.gradient} rounded-2xl border-2 ${style.border} shadow-lg overflow-hidden`}
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center gap-4 hover:bg-white hover:bg-opacity-30 transition-colors"
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.iconBg} flex items-center justify-center text-2xl shadow-lg`}>
          {icon || style.icon}
        </div>

        {/* Title */}
        <div className="flex-1 text-left">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>

        {/* Expand/Collapse Icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </motion.div>
      </motion.button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Specialized components for common patterns
export function StoryBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <InteractiveBlock type="story" title={title}>
      <div className="prose prose-purple max-w-none">
        {children}
      </div>
    </InteractiveBlock>
  )
}

export function InteractiveDemo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <InteractiveBlock type="interactive" title={title} icon={<Play className="w-6 h-6 text-white" />}>
      {children}
    </InteractiveBlock>
  )
}

export function CodeBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <InteractiveBlock type="code" title={title} icon={<Code className="w-6 h-6 text-white" />}>
      {children}
    </InteractiveBlock>
  )
}

export function Challenge({ title, children }: { title: string; children: ReactNode }) {
  return (
    <InteractiveBlock type="challenge" title={title} icon={<Zap className="w-6 h-6 text-white" />}>
      {children}
    </InteractiveBlock>
  )
}

export function Insight({ title, children }: { title: string; children: ReactNode }) {
  return (
    <InteractiveBlock type="insight" title={title} icon={<Lightbulb className="w-6 h-6 text-white" />}>
      {children}
    </InteractiveBlock>
  )
}

export function Comparison({ title, children }: { title: string; children: ReactNode }) {
  return (
    <InteractiveBlock type="comparison" title={title}>
      {children}
    </InteractiveBlock>
  )
}

