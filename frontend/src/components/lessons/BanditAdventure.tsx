import { useState } from 'react'
import { motion } from 'framer-motion'
import LessonLayout from './LessonLayout'
import { StoryBlock, InteractiveDemo, Insight, Challenge } from './InteractiveBlock'
import PlaygroundButton, { QuickTryButton } from './PlaygroundButton'
import { Zap, TrendingUp } from 'lucide-react'

export default function BanditAdventure() {
  const [heistProgress, setHeistProgress] = useState(0)
  const [money, setMoney] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const machines = [
    { id: 1, name: 'Lucky 7', payout: 0.3, emoji: '🍀' },
    { id: 2, name: 'Diamond Mine', payout: 0.8, emoji: '💎' },
    { id: 3, name: 'Cherry Bomb', payout: 0.2, emoji: '🍒' },
    { id: 4, name: 'Golden Bell', payout: 0.5, emoji: '🔔' },
  ]

  const pullMachine = (machineId: number) => {
    const machine = machines[machineId]
    const win = Math.random() < machine.payout
    setAttempts(attempts + 1)
    if (win) {
      setMoney(money + 10)
      setHeistProgress(prev => Math.min(100, prev + 5))
    }
  }

  return (
    <LessonLayout
      title="The Casino Heist"
      subtitle="Master the art of exploration vs exploitation"
      icon="🎰"
      difficulty="beginner"
      estimatedTime="10 min"
      learningObjectives={[
        'Understand the explore-exploit dilemma',
        'Learn epsilon-greedy strategy',
        'See how optimistic initialization works',
        'Build intuition for bandit algorithms',
      ]}
      playgroundConfig={{
        algorithm: 'bandit',
        environment: 'multi-armed-bandit',
        parameters: {
          n_arms: 5,
          epsilon: 0.1,
          n_episodes: 500,
          initial_q: 0.0,
        },
      }}
    >
      {/* Opening Story */}
      <StoryBlock title="🕵️ Your Mission: The Ultimate Casino Heist">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            You've infiltrated the most exclusive casino in Las Vegas. Your mission: <strong className="text-red-600">maximize your winnings</strong> before security catches on.
          </p>
          
          <div className="bg-gradient-to-r from-red-900 to-purple-900 rounded-xl p-6 text-white my-6">
            <div className="flex items-start gap-4">
              <div className="text-6xl">🎰</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">The Challenge</h3>
                <p className="text-red-100">
                  There are multiple slot machines, each with a different (hidden) payout rate. 
                  You have limited time before security arrives. Which machines do you play? 
                  How do you find the best one without wasting all your attempts?
                </p>
              </div>
            </div>
          </div>

          <p className="text-lg">
            This is the <strong className="text-purple-600">Multi-Armed Bandit Problem</strong> – 
            the fundamental challenge of balancing exploration (trying new machines) with exploitation (playing known good machines).
          </p>
        </div>
      </StoryBlock>

      {/* Interactive Heist Simulator */}
      <InteractiveDemo title="🎮 Quick Heist: Try Your Strategy">
        <div className="space-y-6">
          {/* Status Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl p-4 text-white text-center">
              <div className="text-3xl font-bold">${money}</div>
              <div className="text-sm opacity-90">Total Winnings</div>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl p-4 text-white text-center">
              <div className="text-3xl font-bold">{attempts}</div>
              <div className="text-sm opacity-90">Attempts Used</div>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-4 text-white text-center">
              <div className="text-3xl font-bold">{heistProgress}%</div>
              <div className="text-sm opacity-90">Heist Progress</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${heistProgress}%` }}
              className="absolute h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"
            />
          </div>

          {/* Slot Machines */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {machines.map((machine, idx) => (
              <motion.button
                key={machine.id}
                onClick={() => pullMachine(idx)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 text-white shadow-xl"
              >
                <div className="text-5xl mb-2">{machine.emoji}</div>
                <div className="font-bold text-sm">{machine.name}</div>
                <div className="text-xs opacity-75 mt-1">Click to pull!</div>
              </motion.button>
            ))}
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 <strong>Question:</strong> How do you know which machine is best without trying them all many times? 
              That's where the explore-exploit tradeoff comes in!
            </p>
          </div>
        </div>
      </InteractiveDemo>

      {/* The Dilemma Explained */}
      <StoryBlock title="⚖️ The Explore-Exploit Dilemma">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300"
            >
              <div className="text-5xl mb-4 text-center">🔍</div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Explore</h3>
              <p className="text-blue-800 text-sm">
                Try different machines to learn which ones have high payouts. 
                You might discover a goldmine! But you waste time on bad machines.
              </p>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>Risk:</strong> Waste attempts on losers<br />
                  <strong>Reward:</strong> Find hidden gems
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300"
            >
              <div className="text-5xl mb-4 text-center">💰</div>
              <h3 className="text-xl font-bold text-green-900 mb-2">Exploit</h3>
              <p className="text-green-800 text-sm">
                Stick with machines you know are good. Guaranteed wins! 
                But what if there's an even better machine you haven't tried?
              </p>
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-xs text-green-900">
                  <strong>Risk:</strong> Miss better opportunities<br />
                  <strong>Reward:</strong> Consistent payouts
                </p>
              </div>
            </motion.div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">🎯 The Perfect Balance</h3>
            <p className="text-purple-100">
              The best strategy is to <strong>explore early</strong> to learn about all machines, 
              then gradually <strong>exploit</strong> the best ones. This is called <strong>ε-greedy (epsilon-greedy)</strong> strategy!
            </p>
          </div>
        </div>
      </StoryBlock>

      {/* Epsilon-Greedy Strategy */}
      <InteractiveDemo title="🎲 The ε-Greedy Strategy">
        <div className="space-y-4">
          <p className="text-gray-700">
            With probability <strong className="text-purple-600">ε (epsilon)</strong>, explore randomly. 
            With probability <strong className="text-green-600">1-ε</strong>, exploit the best known machine.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { e: 0.0, explore: 0, exploit: 100, label: 'Pure Exploitation', color: 'from-green-400 to-emerald-500', desc: 'Always picks best known machine' },
              { e: 0.1, explore: 10, exploit: 90, label: 'Balanced (ε=0.1)', color: 'from-purple-400 to-pink-500', desc: 'Optimal for most cases' },
              { e: 1.0, explore: 100, exploit: 0, label: 'Pure Exploration', color: 'from-blue-400 to-cyan-500', desc: 'Always picks randomly' },
            ].map((strategy, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${strategy.color} rounded-xl p-5 text-white shadow-xl`}
              >
                <div className="text-2xl font-bold mb-2">ε = {strategy.e}</div>
                <div className="font-semibold mb-3">{strategy.label}</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Explore:</span>
                    <strong>{strategy.explore}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Exploit:</span>
                    <strong>{strategy.exploit}%</strong>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white border-opacity-30 text-xs opacity-90">
                  {strategy.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </InteractiveDemo>

      {/* Try It Out */}
      <div className="my-8">
        <PlaygroundButton
          algorithm="bandit"
          environment="multi-armed-bandit"
          parameters={{ n_arms: 5, epsilon: 0.1, n_episodes: 1000, initial_q: 0 }}
          label="🎰 Run Your Own Casino Heist!"
          description="See the algorithm find the best machines automatically"
          size="large"
        />
      </div>

      {/* Advanced Strategies */}
      <Challenge title="🚀 Advanced Heist Strategies">
        <div className="space-y-4">
          <p className="text-gray-700">
            Want to be a master thief? Try these advanced strategies:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <QuickTryButton
                config={{
                  algorithm: 'bandit',
                  environment: 'multi-armed-bandit',
                  parameters: { n_arms: 5, epsilon: 0.3, n_episodes: 500, initial_q: 0 },
                }}
                label="🔍 High Explorer (ε=0.3)"
              />
              <p className="text-xs text-gray-600 pl-2">Explores more, might find hidden gems</p>
            </div>

            <div className="space-y-2">
              <QuickTryButton
                config={{
                  algorithm: 'bandit',
                  environment: 'multi-armed-bandit',
                  parameters: { n_arms: 5, epsilon: 0.01, n_episodes: 500, initial_q: 5.0 },
                }}
                label="🎯 Optimistic Start (Q₀=5.0)"
              />
              <p className="text-xs text-gray-600 pl-2">Starts optimistic, encourages exploration</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg">
            <p className="text-sm text-orange-900">
              <strong>🏆 Challenge:</strong> Which strategy wins the most money in 1000 attempts? 
              Can you beat a random player?
            </p>
          </div>
        </div>
      </Challenge>

      {/* Key Insight */}
      <Insight title="🧠 Why This Matters Everywhere">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-gray-900">
            The explore-exploit tradeoff isn't just for casinos. It's everywhere:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '🍕', title: 'Restaurant Choice', desc: 'Try new places vs. your favorite spot' },
              { icon: '📱', title: 'A/B Testing', desc: 'Test new features vs. proven designs' },
              { icon: '💊', title: 'Medical Trials', desc: 'Test new treatments vs. established ones' },
              { icon: '🎵', title: 'Music Streaming', desc: 'Discover new artists vs. replay favorites' },
            ].map((example, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-md"
              >
                <div className="text-3xl mb-2">{example.icon}</div>
                <div className="font-bold text-gray-900">{example.title}</div>
                <div className="text-sm text-gray-600 mt-1">{example.desc}</div>
              </motion.div>
            ))}
          </div>

          <p className="text-gray-700 italic mt-4">
            Understanding bandits means understanding a fundamental trade-off in decision-making under uncertainty!
          </p>
        </div>
      </Insight>

      {/* Final Mission */}
      <div className="mt-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-3xl font-bold mb-3">Mission Complete!</h3>
          <p className="text-yellow-100 text-lg mb-6">
            You've mastered the casino heist. Ready to plan your next mission in the playground?
          </p>
          <PlaygroundButton
            algorithm="bandit"
            environment="multi-armed-bandit"
            label="Start Your Heist"
            size="large"
          />
        </motion.div>
      </div>
    </LessonLayout>
  )
}

