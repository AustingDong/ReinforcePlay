import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle } from 'lucide-react'

interface ParameterInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  description: string
  emoji?: string
}

export default function ParameterInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  description,
  emoji = '⚙️',
}: ParameterInputProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    // Show tooltip after hovering for 500ms
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true)
    }, 500)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setShowTooltip(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between mb-0.5">
        <label className="text-[10px] font-medium text-gray-700 flex items-center gap-0.5">
          <span className="text-xs">{emoji}</span>
          <span>{label}</span>
        </label>
        <HelpCircle className="w-2.5 h-2.5 text-gray-400" />
      </div>
      
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all"
      />

      {/* Tooltip - Compact */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 bottom-full mb-1.5 w-52 pointer-events-none"
          >
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 text-white rounded-lg p-2 shadow-xl border border-purple-400">
              <div className="flex items-start gap-1.5">
                <span className="text-base">{emoji}</span>
                <div className="flex-1">
                  <div className="font-bold text-[10px] mb-0.5">{label}</div>
                  <div className="text-[9px] opacity-90 leading-snug">
                    {description}
                  </div>
                </div>
              </div>
              
              {/* Arrow - Smaller */}
              <div className="absolute left-3 bottom-0 translate-y-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-purple-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

