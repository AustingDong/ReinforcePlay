import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Play, Sparkles, Zap, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PlaygroundConfigProps {
  algorithm: string
  environment: string
  parameters?: Record<string, any>
  gridConfig?: any[]
}

interface LessonLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  icon?: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: string
  duration?: string
  learningObjectives?: string[]
  objectives?: string[]
  playgroundConfig?: PlaygroundConfigProps
  prerequisites?: string[]
}

const difficultyColors: Record<string, string> = {
  beginner: 'from-green-400 to-emerald-500',
  intermediate: 'from-yellow-400 to-orange-500',
  advanced: 'from-red-400 to-pink-500',
}

const difficultyLabels: Record<string, string> = {
  beginner: 'Beginner Friendly',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export default function LessonLayout({
  children,
  title,
  subtitle,
  icon,
  difficulty,
  estimatedTime,
  duration,
  learningObjectives,
  objectives,
  playgroundConfig,
  prerequisites,
}: LessonLayoutProps) {
  const navigate = useNavigate()
  
  // Use the simpler prop names if provided, otherwise fall back to the original names
  const timeEstimate = duration || estimatedTime || '15 min'
  const objectives_list = objectives || learningObjectives || []
  const difficultyLevel = (difficulty.toLowerCase() as 'beginner' | 'intermediate' | 'advanced')

  const handleTryInPlayground = () => {
    if (playgroundConfig) {
      // Store config in localStorage for playground to pick up
      localStorage.setItem('playground_preset', JSON.stringify(playgroundConfig))
      navigate('/playground')
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-8 text-white shadow-2xl"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 flex items-start gap-6">
          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl"
          >
            {icon}
          </motion.div>

          <div className="flex-1">
            {/* Difficulty & Time Badge */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${difficultyColors[difficultyLevel]} text-white text-xs font-bold shadow-lg flex items-center gap-1`}>
                <Sparkles className="w-3 h-3" />
                {difficultyLabels[difficultyLevel]}
              </div>
              <div className="px-3 py-1 rounded-full bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {timeEstimate}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">{title}</h1>
            {subtitle && <p className="text-xl text-blue-100 mb-4">{subtitle}</p>}

            {/* Try in Playground Button */}
            {playgroundConfig && (
              <motion.button
                onClick={handleTryInPlayground}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Try in Playground
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Learning Objectives */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-green-900">What You'll Learn</h3>
          </div>
          <ul className="space-y-2">
            {objectives_list.map((objective, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-start gap-2 text-sm text-green-800"
              >
                <span className="text-green-500 mt-1">✓</span>
                <span>{objective}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Prerequisites (if any) */}
        {prerequisites && prerequisites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-blue-900">Prerequisites</h3>
            </div>
            <ul className="space-y-2">
              {prerequisites.map((prereq, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-start gap-2 text-sm text-blue-800"
                >
                  <span className="text-blue-500 mt-1">→</span>
                  <span>{prereq}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Lesson Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-8"
      >
        {children}
      </motion.div>
    </div>
  )
}

