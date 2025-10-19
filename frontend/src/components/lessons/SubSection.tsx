import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SubSectionProps {
  id: string
  title: string
  icon?: string
  children: ReactNode
  variant?: 'default' | 'story' | 'concept' | 'practice'
}

const variantStyles = {
  default: 'bg-gradient-to-br from-white to-gray-50 border-gray-200',
  story: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
  concept: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
  practice: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
}

const iconBgStyles = {
  default: 'bg-gradient-to-br from-gray-500 to-gray-600',
  story: 'bg-gradient-to-br from-purple-500 to-pink-600',
  concept: 'bg-gradient-to-br from-blue-500 to-cyan-600',
  practice: 'bg-gradient-to-br from-green-500 to-emerald-600',
}

export default function SubSection({ 
  id, 
  title, 
  icon, 
  children, 
  variant = 'default' 
}: SubSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-2xl border-2 shadow-lg p-6 sm:p-8 mb-8 ${variantStyles[variant]}`}
    >
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="70" cy="30" r="40" fill="currentColor" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative flex items-center gap-4 mb-6">
        {icon && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className={`flex-shrink-0 w-12 h-12 rounded-xl ${iconBgStyles[variant]} flex items-center justify-center text-2xl shadow-lg`}
          >
            {icon}
          </motion.div>
        )}
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h3>
      </div>

      {/* Content */}
      <div className="relative space-y-4">
        {children}
      </div>
    </motion.section>
  )
}

