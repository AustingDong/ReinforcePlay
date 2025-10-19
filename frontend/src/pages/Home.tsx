import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, Gamepad2, Sparkles, Brain, Zap, Target, Award, ChevronRight, Play } from 'lucide-react'

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <div className="overflow-hidden">
      {/* Animated Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900"
        onMouseMove={handleMouseMove}
      >
        {/* Animated background particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Floating icons */}
        {[Brain, Target, Award, Zap].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white opacity-10"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + i * 15}%`,
            }}
          >
            <Icon className="w-20 h-20" strokeWidth={1} />
          </motion.div>
        ))}

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
            className="mb-8"
          >
            <Brain className="w-32 h-32 mx-auto text-white" strokeWidth={1.5} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-7xl md:text-9xl font-bold text-white mb-6"
          >
            Reinforce<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">Play</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-2xl md:text-3xl text-cyan-200 mb-12"
          >
            Learn AI by playing 🎮
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link to="/learn">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl font-bold text-xl text-white shadow-2xl overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ scale: 0, opacity: 0.3 }}
                  whileHover={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative flex items-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  Start Learning
                </span>
              </motion.button>
            </Link>

            <Link to="/playground">
              <motion.button
                whileHover={{ scale: 1.1, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-white bg-opacity-20 backdrop-blur-lg border-2 border-white rounded-2xl font-bold text-xl text-white shadow-2xl"
              >
                <span className="flex items-center gap-3">
                  <Gamepad2 className="w-6 h-6" />
                  Playground
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white rounded-full mt-2"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Feature Cards */}
      <section className="py-20 px-4 bg-gray-50">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
        >
          Experience the Future of Learning
        </motion.h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: 'Interactive',
              emoji: '🧠',
              color: 'from-blue-500 to-cyan-500',
              features: ['Live simulations', 'Visual learning', 'Step-by-step']
            },
            {
              icon: Sparkles,
              title: 'Engaging',
              emoji: '✨',
              color: 'from-purple-500 to-pink-500',
              features: ['Animations', 'Gamification', 'Real-time feedback']
            },
            {
              icon: Zap,
              title: 'Powerful',
              emoji: '⚡',
              color: 'from-orange-500 to-red-500',
              features: ['8+ algorithms', 'Custom environments', 'Deep insights']
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredCard(idx)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
              
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <motion.div
                  animate={{ 
                    rotate: hoveredCard === idx ? 360 : 0,
                    scale: hoveredCard === idx ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.6 }}
                  className="text-7xl mb-6 text-center"
                >
                  {feature.emoji}
                </motion.div>

                <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
                  {feature.title}
                </h3>

                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: hoveredCard === idx ? 1 : 0.6,
                        x: hoveredCard === idx ? 0 : -20
                      }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`} />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Algorithms Showcase - Less Text, More Visual */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-5xl font-bold text-center mb-16"
        >
          Master 8+ Algorithms
        </motion.h2>

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { emoji: '🎰', name: 'Bandit', year: '1952' },
            { emoji: '🎯', name: 'Q-Learn', year: '1989' },
            { emoji: '🛡️', name: 'SARSA', year: '1994' },
            { emoji: '🌉', name: 'TD(λ)', year: '1988' },
            { emoji: '🚀', name: 'REINFORCE', year: '1992' },
            { emoji: '🎭', name: 'A2C', year: '2016' },
            { emoji: '⚖️', name: 'TRPO', year: '2015' },
            { emoji: '⭐', name: 'PPO', year: '2017' },
          ].map((algo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-center cursor-pointer"
            >
              <div className="text-5xl mb-3">{algo.emoji}</div>
              <div className="font-bold text-lg">{algo.name}</div>
              <div className="text-xs text-gray-400">{algo.year}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA - More Visual, Less Text */}
      <section className="relative py-32 px-4 overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
        {/* Animated background shapes */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            animate={{
              x: [Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: 50 + Math.random() * 100,
              height: 50 + Math.random() * 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        <div className="relative z-10 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
            className="text-8xl mb-8"
          >
            🚀
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl font-bold mb-6"
          >
            Start Your Journey
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl mb-12 text-white text-opacity-90"
          >
            Learn • Practice • Master
          </motion.p>

          <Link to="/learn">
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="group px-16 py-8 bg-white text-purple-600 rounded-full font-bold text-2xl shadow-2xl flex items-center gap-4 mx-auto"
            >
              <Play className="w-8 h-8" />
              Begin Now
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ChevronRight className="w-8 h-8" />
              </motion.div>
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  )
}
