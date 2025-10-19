import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, HelpCircle, Lightbulb, Award } from 'lucide-react'

interface QuestionProps {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  hint?: string
}

const difficultyConfig = {
  easy: {
    label: 'Easy',
    color: 'green',
    icon: '🌱',
    points: 10,
  },
  medium: {
    label: 'Medium',
    color: 'yellow',
    icon: '⚡',
    points: 20,
  },
  hard: {
    label: 'Hard',
    color: 'red',
    icon: '🔥',
    points: 30,
  },
}

export default function Question({
  id,
  question,
  options,
  correctIndex,
  explanation,
  difficulty,
  hint,
}: QuestionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const config = difficultyConfig[difficulty]
  const isCorrect = selectedIndex === correctIndex
  const hasAnswered = selectedIndex !== null

  const handleSelect = (index: number) => {
    if (!hasAnswered) {
      setSelectedIndex(index)
      setTimeout(() => setRevealed(true), 300)
    }
  }

  const handleReset = () => {
    setSelectedIndex(null)
    setRevealed(false)
    setShowHint(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`relative rounded-2xl border-2 p-6 shadow-lg bg-gradient-to-br ${
        hasAnswered
          ? isCorrect
            ? 'from-green-50 to-emerald-50 border-green-300'
            : 'from-red-50 to-pink-50 border-red-300'
          : 'from-white to-gray-50 border-gray-200'
      } transition-all duration-500`}
    >
      {/* Difficulty Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-3 -right-3 z-10"
      >
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full shadow-lg text-sm font-bold ${
            difficulty === 'easy'
              ? 'bg-green-500 text-white'
              : difficulty === 'medium'
              ? 'bg-yellow-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </div>
      </motion.div>

      {/* Question */}
      <div className="flex items-start gap-3 mb-6">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-white" />
        </div>
        <p className="text-lg font-semibold text-gray-900 leading-relaxed">{question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-4">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index
          const isCorrectOption = index === correctIndex
          const showResult = revealed && hasAnswered

          return (
            <motion.button
              key={index}
              whileHover={{ scale: hasAnswered ? 1 : 1.02, x: hasAnswered ? 0 : 5 }}
              whileTap={{ scale: hasAnswered ? 1 : 0.98 }}
              onClick={() => handleSelect(index)}
              disabled={hasAnswered}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                showResult && isCorrectOption
                  ? 'border-green-500 bg-green-50 shadow-lg'
                  : showResult && isSelected && !isCorrect
                  ? 'border-red-500 bg-red-50'
                  : isSelected
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
              } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    showResult && isCorrectOption
                      ? 'border-green-500 bg-green-500'
                      : showResult && isSelected && !isCorrect
                      ? 'border-red-500 bg-red-500'
                      : isSelected
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {showResult && isCorrectOption && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    showResult && (isCorrectOption || (isSelected && !isCorrect))
                      ? 'text-gray-900'
                      : 'text-gray-700'
                  }`}
                >
                  {option}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Hint Button */}
      {hint && !hasAnswered && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800 font-medium text-sm hover:bg-yellow-200 transition-colors mb-4"
        >
          <Lightbulb className="w-4 h-4" />
          <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
        </motion.button>
      )}

      {/* Hint */}
      <AnimatePresence>
        {showHint && hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200"
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-900">{hint}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation */}
      <AnimatePresence>
        {revealed && hasAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isCorrect ? (
              <div className="p-4 rounded-xl bg-green-100 border border-green-300">
                <div className="flex items-start gap-3 mb-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Award className="w-6 h-6 text-green-600" />
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-green-900 text-lg">Excellent! 🎉</h4>
                    <p className="text-sm text-green-800 mt-1">+{config.points} points</p>
                  </div>
                </div>
                <p className="text-sm text-green-900 leading-relaxed">{explanation}</p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3 mb-3">
                  <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-blue-900 text-lg">Let's learn from this!</h4>
                  </div>
                </div>
                <p className="text-sm text-blue-900 leading-relaxed">{explanation}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="mt-4 px-4 py-2 rounded-lg bg-gray-700 text-white font-medium text-sm hover:bg-gray-800 transition-colors"
            >
              Try Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

