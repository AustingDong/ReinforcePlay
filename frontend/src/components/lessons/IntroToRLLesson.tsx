import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Target, Zap, Award, Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'

export default function IntroToRLLesson() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [dogPosition, setDogPosition] = useState({ x: 50, y: 50 })
  const [ballPosition] = useState({ x: 200, y: 50 })
  const [treats, setTreats] = useState(0)
  const [selectedCard, setSelectedCard] = useState<number | null>(null)

  // Interactive RL Loop
  const rlSteps = [
    { icon: Target, title: 'Observe', desc: 'See the situation', color: 'blue' },
    { icon: Zap, title: 'Act', desc: 'Make a choice', color: 'purple' },
    { icon: Award, title: 'Reward', desc: 'Get feedback', color: 'yellow' },
    { icon: Brain, title: 'Learn', desc: 'Improve strategy', color: 'green' }
  ]

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % 4)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [currentStep, isAnimating])

  const simulateDog = () => {
    const distance = Math.hypot(ballPosition.x - dogPosition.x, ballPosition.y - dogPosition.y)
    
    if (distance < 30) {
      // Got the ball!
      setTreats(prev => prev + 1)
      setDogPosition({ x: 50, y: 50 })
    } else {
      // Move towards ball
      const angle = Math.atan2(ballPosition.y - dogPosition.y, ballPosition.x - dogPosition.x)
      const step = 30
      setDogPosition({
        x: dogPosition.x + Math.cos(angle) * step,
        y: dogPosition.y + Math.sin(angle) * step
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Animated Hero with Floating Elements */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-12 md:p-20"
      >
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              x: [Math.random() * 400, Math.random() * 400],
              y: [Math.random() * 300, Math.random() * 300],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        <div className="relative z-10 text-center text-white">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Brain className="w-24 h-24 mx-auto" strokeWidth={1.5} />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            Reinforcement Learning
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-blue-100"
          >
            Teaching machines to learn like humans 🚀
          </motion.p>
        </div>
      </motion.section>

      {/* Interactive Dog Training Demo */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-4">🐕 Try It: Train a Dog!</h2>
        <p className="text-center text-gray-700 mb-6">
          Click the dog to make it move towards the ball. Give it a treat when it succeeds!
        </p>

        <div className="relative bg-white rounded-2xl p-8 h-64 border-4 border-amber-200">
          {/* Dog */}
          <motion.div
            animate={{ x: dogPosition.x, y: dogPosition.y }}
            transition={{ type: "spring", stiffness: 100 }}
            className="absolute cursor-pointer"
            onClick={simulateDog}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-5xl"
            >
              🐕
            </motion.div>
          </motion.div>

          {/* Ball */}
          <div
            className="absolute text-4xl"
            style={{ left: ballPosition.x, top: ballPosition.y }}
          >
            ⚽
          </div>

          {/* Treats Counter */}
          <div className="absolute top-4 right-4 bg-amber-400 text-white px-4 py-2 rounded-full font-bold shadow-lg">
            🦴 Treats: {treats}
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          This is RL! The dog <strong>learns</strong> by trying → getting rewards → improving! 🎉
        </p>
      </motion.section>

      {/* Interactive RL Loop */}
      <section className="bg-white rounded-3xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8">
          The Learning Loop
        </h2>

        <div className="flex justify-center items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAnimating(!isAnimating)}
            className={`px-6 py-3 rounded-xl font-bold text-white ${
              isAnimating ? 'bg-red-500' : 'bg-green-500'
            } shadow-lg flex items-center gap-2`}
          >
            {isAnimating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isAnimating ? 'Pause' : 'Start'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentStep(0)}
            className="px-6 py-3 rounded-xl font-bold bg-gray-500 text-white shadow-lg flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </motion.button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {rlSteps.map((step, idx) => {
            const Icon = step.icon
            const isActive = currentStep === idx
            const colorMap: Record<string, string> = {
              blue: 'from-blue-500 to-blue-600',
              purple: 'from-purple-500 to-purple-600',
              yellow: 'from-yellow-400 to-orange-500',
              green: 'from-green-500 to-emerald-600'
            }
            
            return (
              <motion.div
                key={idx}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  rotateY: isActive ? 360 : 0
                }}
                transition={{ duration: 0.5 }}
                className={`relative p-6 rounded-2xl shadow-lg cursor-pointer ${
                  isActive ? 'ring-4 ring-offset-2 ring-blue-400' : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[step.color]} rounded-2xl opacity-${isActive ? '100' : '10'}`} />
                
                <div className="relative text-center">
                  <motion.div
                    animate={{ rotate: isActive ? [0, 10, -10, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className={`w-12 h-12 mx-auto mb-3 ${isActive ? 'text-white' : 'text-gray-700'}`} />
                  </motion.div>
                  <h3 className={`font-bold text-lg ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {idx + 1}. {step.title}
                  </h3>
                  <p className={`text-sm ${isActive ? 'text-white' : 'text-gray-600'}`}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          animate={{ opacity: isAnimating ? 1 : 0 }}
          className="mt-6 text-center text-gray-600"
        >
          <p className="text-lg">
            ↻ Repeat thousands of times to master any skill!
          </p>
        </motion.div>
      </section>

      {/* Interactive Comparison Cards */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">
          How is RL Different?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              id: 0,
              emoji: '👨‍🏫', 
              title: 'Supervised', 
              short: 'Teacher shows answers',
              long: 'Like learning with flashcards - someone tells you the right answer',
              example: 'This is a cat → Learn to recognize cats',
              color: 'from-green-400 to-emerald-500'
            },
            { 
              id: 1,
              emoji: '🔍', 
              title: 'Unsupervised', 
              short: 'Find patterns alone',
              long: 'Discover hidden patterns without any guidance or labels',
              example: 'Group similar photos without being told what they are',
              color: 'from-blue-400 to-cyan-500'
            },
            { 
              id: 2,
              emoji: '🎮', 
              title: 'Reinforcement', 
              short: 'Learn by trying',
              long: 'Learn through trial, error, and rewards - like playing a game!',
              example: 'Try actions → Get points → Improve strategy',
              color: 'from-purple-400 to-pink-500',
              highlight: true
            }
          ].map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
              className={`relative cursor-pointer rounded-2xl p-6 shadow-xl overflow-hidden ${
                card.highlight ? 'ring-4 ring-purple-400' : ''
              }`}
            >
              <motion.div
                animate={{ 
                  opacity: selectedCard === card.id ? 1 : 0.2,
                  scale: selectedCard === card.id ? 1 : 0.9
                }}
                className={`absolute inset-0 bg-gradient-to-br ${card.color}`}
              />
              
              <div className="relative text-white">
                <div className="text-6xl mb-4 text-center">{card.emoji}</div>
                <h3 className="text-2xl font-bold mb-2 text-center">{card.title}</h3>
                <p className="text-center mb-4">{card.short}</p>
                
                <AnimatePresence>
                  {selectedCard === card.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur">
                        <p className="text-sm">{card.long}</p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur">
                        <p className="text-xs font-mono">{card.example}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {selectedCard !== card.id && (
                  <p className="text-center text-sm opacity-75">Click to learn more</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Real World - Visual Icons */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8">
          🌍 Where You've Seen RL
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { emoji: '🎮', label: 'AlphaGo', desc: 'Beat world champions' },
            { emoji: '🚗', label: 'Self-Driving', desc: 'Navigate roads' },
            { emoji: '🤖', label: 'Robots', desc: 'Learn to walk' },
            { emoji: '📈', label: 'Trading', desc: 'Optimize profits' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="bg-white rounded-2xl p-6 shadow-lg text-center cursor-pointer"
            >
              <div className="text-6xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-gray-900 mb-1">{item.label}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl"
      >
        <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="text-xl mb-8 text-purple-100">
          Begin with the simplest problem: the Multi-Armed Bandit! 🎰
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg shadow-xl flex items-center gap-3 mx-auto"
        >
          Start First Lesson
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </motion.section>
    </div>
  )
}
