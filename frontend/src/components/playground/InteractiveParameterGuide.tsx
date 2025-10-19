import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X } from 'lucide-react'

interface ParameterGuideProps {
  algorithm: string
}

export default function InteractiveParameterGuide({ algorithm }: ParameterGuideProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeParam, setActiveParam] = useState<string | null>(null)

  const paramGuides: Record<string, Record<string, {
    name: string
    visual: string
    effect: string
    tip: string
  }>> = {
    qlearning: {
      alpha: {
        name: 'Learning Rate (α)',
        visual: '🎓',
        effect: 'Higher = Learn faster (but less stable)',
        tip: 'Start with 0.1, increase if learning is too slow'
      },
      gamma: {
        name: 'Discount Factor (γ)',
        visual: '⏰',
        effect: 'Higher = Care more about future rewards',
        tip: '0.95-0.99 for most tasks'
      },
      epsilon: {
        name: 'Exploration (ε)',
        visual: '🎲',
        effect: 'Higher = Explore more randomly',
        tip: '0.1 is a good balance'
      }
    },
    bandit: {
      epsilon: {
        name: 'Explore Rate',
        visual: '🎲',
        effect: 'How often to try random machines',
        tip: 'Try 0.1 for balanced learning'
      }
    },
    ppo: {
      clip_ratio: {
        name: 'Clip Ratio',
        visual: '✂️',
        effect: 'Limits how much policy can change',
        tip: '0.2 is standard, prevents big jumps'
      },
      learning_rate: {
        name: 'Learning Rate',
        visual: '🎓',
        effect: 'Speed of learning',
        tip: '0.001 is a safe default'
      }
    }
  }

  const guide = paramGuides[algorithm] || {}

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white z-50 group"
      >
        <HelpCircle className="w-8 h-8" />
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-purple-400 rounded-full opacity-0 group-hover:opacity-30"
        />
      </motion.button>

      {/* Parameter Guide Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Parameter Guide</h2>
                    <p className="text-purple-100">Click any parameter to learn more</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {Object.keys(guide).length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">No parameters for this algorithm yet!</p>
                    <p className="mt-2">But don't worry, just experiment and see what happens 🎮</p>
                  </div>
                ) : (
                  Object.entries(guide).map(([key, param]) => (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveParam(activeParam === key ? null : key)}
                      className={`cursor-pointer rounded-2xl p-6 transition-all ${
                        activeParam === key
                          ? 'bg-gradient-to-br from-purple-50 to-pink-50 ring-2 ring-purple-400'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          animate={{ rotate: activeParam === key ? 360 : 0 }}
                          transition={{ duration: 0.5 }}
                          className="text-5xl"
                        >
                          {param.visual}
                        </motion.div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {param.name}
                          </h3>
                          
                          <AnimatePresence>
                            {activeParam === key ? (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3"
                              >
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-sm font-semibold text-purple-600 mb-1">
                                    What it does:
                                  </p>
                                  <p className="text-gray-700">{param.effect}</p>
                                </div>
                                
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border-l-4 border-green-500">
                                  <p className="text-sm font-semibold text-green-700 mb-1">
                                    💡 Pro Tip:
                                  </p>
                                  <p className="text-gray-700">{param.tip}</p>
                                </div>
                              </motion.div>
                            ) : (
                              <p className="text-gray-600">{param.effect}</p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 rounded-b-3xl">
                <p className="text-center text-gray-600 text-sm">
                  💡 Tip: The best way to learn is to experiment! Try different values and watch what happens.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

