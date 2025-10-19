import { motion } from 'framer-motion'
import { Play, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PlaygroundButtonProps {
  algorithm: string
  environment: string
  parameters?: Record<string, any>
  gridConfig?: any[]
  label?: string
  description?: string
  size?: 'small' | 'medium' | 'large'
}

export default function PlaygroundButton({
  algorithm,
  environment,
  parameters,
  gridConfig,
  label = 'Try This in Playground',
  description,
  size = 'medium',
}: PlaygroundButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    const preset = {
      algorithm,
      environment,
      parameters: parameters || {},
      gridConfig: gridConfig || [],
    }
    
    localStorage.setItem('playground_preset', JSON.stringify(preset))
    navigate('/playground')
  }

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  }

  return (
    <div className="my-6">
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative overflow-hidden rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all
          ${sizeClasses[size]}
          bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white
        `}
      >
        {/* Animated background */}
        <motion.div
          animate={{
            x: ['0%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
        />

        <div className="relative z-10 flex items-center justify-center gap-2">
          <Play className="w-5 h-5" />
          <span>{label}</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </motion.button>

      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-sm text-gray-600 text-center"
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}

// Quick action buttons for common scenarios
export function QuickTryButton({ 
  config, 
  label 
}: { 
  config: Omit<PlaygroundButtonProps, 'label' | 'size'>; 
  label: string 
}) {
  return (
    <PlaygroundButton
      {...config}
      label={label}
      size="small"
    />
  )
}

