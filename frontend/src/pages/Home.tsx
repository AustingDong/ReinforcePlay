import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, Gamepad2, Sparkles, Brain, TrendingUp } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: 'Interactive Learning',
      description: 'Learn RL algorithms through visual, step-by-step lessons with live simulations',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Visualization',
      description: 'Watch algorithms learn in real-time with reward curves and Q-value heatmaps',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Sparkles,
      title: 'Hands-on Practice',
      description: 'Experiment with different parameters and environments in the playground',
      color: 'from-orange-500 to-red-500',
    },
  ]
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
              Learn Reinforcement Learning
            </h1>
            <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Master RL algorithms through interactive visualizations and hands-on experimentation
            </p>
            
            <div className="flex justify-center gap-4">
              <Link to="/learn">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Start Learning
                </motion.button>
              </Link>
              
              <Link to="/playground">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-secondary text-lg px-8 py-4 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Gamepad2 className="w-5 h-5" />
                  Try Playground
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-200 rounded-full opacity-20 blur-3xl" />
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Why ReinforcePlay?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card hover:shadow-xl transition-shadow duration-300"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* Algorithms Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12">What You'll Learn</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Multi-Armed Bandits',
                description: 'Explore vs. Exploit tradeoff with ε-greedy strategies',
                level: 'Beginner',
                color: 'bg-green-100 text-green-800',
              },
              {
                title: 'Markov Decision Process',
                description: 'Understand states, actions, rewards, and transitions',
                level: 'Beginner',
                color: 'bg-green-100 text-green-800',
              },
              {
                title: 'Q-Learning',
                description: 'Master value-based RL with temporal difference learning',
                level: 'Intermediate',
                color: 'bg-yellow-100 text-yellow-800',
              },
              {
                title: 'Policy Gradient (PPO)',
                description: 'Learn modern policy optimization techniques',
                level: 'Advanced',
                color: 'bg-red-100 text-red-800',
              },
            ].map((algo, index) => (
              <motion.div
                key={algo.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{algo.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${algo.color}`}>
                    {algo.level}
                  </span>
                </div>
                <p className="text-gray-600">{algo.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your RL Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners mastering Reinforcement Learning through interactive exploration
          </p>
          <Link to="/learn">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 px-10 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Begin Learning Now
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  )
}

