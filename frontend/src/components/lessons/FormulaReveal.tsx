import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, BookOpen } from 'lucide-react'
import 'katex/dist/katex.min.css'
import { BlockMath } from 'react-katex'

interface FormulaRevealProps {
  title: string
  description: string
  formula: string
  intuition: string
  variables?: { symbol: string; meaning: string }[]
}

export default function FormulaReveal({
  title,
  description,
  formula,
  intuition,
  variables,
}: FormulaRevealProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Intuition First */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/60 border border-purple-200">
          <p className="text-lg font-semibold text-purple-900 mb-2">💡 Intuition:</p>
          <p className="text-gray-800 leading-relaxed">{intuition}</p>
        </div>
      </div>

      {/* Reveal Button */}
      <div className="flex justify-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setRevealed(!revealed)}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
            revealed
              ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-pulse'
          }`}
        >
          {revealed ? (
            <>
              <EyeOff className="w-5 h-5" />
              <span>Hide Mathematical Formula</span>
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              <span>Reveal Mathematical Formula</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Formula */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.9 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.9 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300 shadow-xl"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="1" fill="currentColor" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              {/* Formula Display */}
              <div className="relative bg-white rounded-xl p-6 shadow-inner mb-6 overflow-x-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <BlockMath math={formula} />
                </motion.div>
              </div>

              {/* Variables Explanation */}
              {variables && variables.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <h5 className="font-bold text-gray-900 text-lg mb-3">📖 Where:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {variables.map((variable, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold">{variable.symbol}</span>
                        </div>
                        <span className="text-sm text-gray-700">{variable.meaning}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

