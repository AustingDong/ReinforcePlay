import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface VisualConceptProps {
  title: string
  emoji: string
  children: ReactNode
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'pink'
}

const colorStyles = {
  blue: {
    bg: 'from-blue-400 to-cyan-500',
    border: 'border-blue-300',
    bgLight: 'from-blue-50 to-cyan-50',
  },
  purple: {
    bg: 'from-purple-400 to-pink-500',
    border: 'border-purple-300',
    bgLight: 'from-purple-50 to-pink-50',
  },
  green: {
    bg: 'from-green-400 to-emerald-500',
    border: 'border-green-300',
    bgLight: 'from-green-50 to-emerald-50',
  },
  orange: {
    bg: 'from-orange-400 to-red-500',
    border: 'border-orange-300',
    bgLight: 'from-orange-50 to-red-50',
  },
  pink: {
    bg: 'from-pink-400 to-rose-500',
    border: 'border-pink-300',
    bgLight: 'from-pink-50 to-rose-50',
  },
}

export default function VisualConcept({
  title,
  emoji,
  children,
  color = 'blue',
}: VisualConceptProps) {
  const styles = colorStyles[color]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-2xl border-2 ${styles.border} bg-gradient-to-br ${styles.bgLight} p-6 sm:p-8 shadow-lg overflow-hidden`}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at center, currentColor 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative flex flex-col items-center text-center mb-6">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-6xl sm:text-7xl mb-4"
        >
          {emoji}
        </motion.div>
        <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{title}</h3>
      </div>

      {/* Content */}
      <div className="relative">
        {children}
      </div>

      {/* Decorative Gradient Blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${styles.bg} blur-3xl`}
      />
    </motion.div>
  )
}

