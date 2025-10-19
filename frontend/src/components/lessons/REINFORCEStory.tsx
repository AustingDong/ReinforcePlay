import { useState } from 'react'
import { motion } from 'framer-motion'
import LessonLayout from './LessonLayout'
import { StoryBlock, InteractiveDemo, Insight, Challenge, Comparison } from './InteractiveBlock'
import PlaygroundButton, { QuickTryButton } from './PlaygroundButton'
import { Brain, Zap, TrendingUp } from 'lucide-react'

export default function REINFORCEStory() {
  const [evolutionStep, setEvolutionStep] = useState(0)

  const evolutionSteps = [
    { stage: 'Random', emoji: '🎲', desc: 'Moving randomly, no strategy' },
    { stage: 'Learning', emoji: '🧠', desc: 'Starting to see patterns' },
    { stage: 'Improving', emoji: '📈', desc: 'Getting better at decisions' },
    { stage: 'Mastery', emoji: '🏆', desc: 'Found the optimal path!' },
  ]

  return (
    <LessonLayout
      title="Evolution of Intelligence"
      subtitle="Watch an AI evolve from random to genius"
      icon="🧬"
      difficulty="intermediate"
      estimatedTime="20 min"
      learningObjectives={[
        'Understand how policy gradient methods work',
        'See the difference between value-based and policy-based learning',
        'Learn why REINFORCE uses full episodes',
        'Master the concept of credit assignment',
      ]}
      playgroundConfig={{
        algorithm: 'reinforce',
        environment: 'classic-grid',
        parameters: {
          learning_rate: 0.001,
          gamma: 0.99,
          n_episodes: 200,
        },
        gridConfig: [
          { x: 4, y: 4, type: 'goal', value: 10 },
          { x: 2, y: 2, type: 'obstacle', value: 0 },
        ],
      }}
      prerequisites={['Understanding of Q-Learning', 'Basic probability']}
    >
      {/* Epic Opening */}
      <StoryBlock title="🌟 The Birth of Intelligence">
        <div className="space-y-6">
          <p className="text-xl leading-relaxed">
            Imagine you could watch intelligence emerge from nothing. A brain that starts knowing <strong className="text-red-600">absolutely nothing</strong>, 
            then through trial and error, becomes a master strategist.
          </p>

          <div className="relative overflow-hidden rounded-2xl">
            {/* Animated Evolution Timeline */}
            <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-cyan-900 p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">The Evolution Timeline</h3>
              <div className="grid grid-cols-4 gap-4">
                {evolutionSteps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    onClick={() => setEvolutionStep(idx)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`
                      cursor-pointer rounded-xl p-4 text-center transition-all
                      ${evolutionStep === idx 
                        ? 'bg-white bg-opacity-20 ring-2 ring-white' 
                        : 'bg-white bg-opacity-5 hover:bg-opacity-10'
                      }
                    `}
                  >
                    <div className="text-5xl mb-2">{step.emoji}</div>
                    <div className="font-bold text-sm">{step.stage}</div>
                    <div className="text-xs opacity-75 mt-1">{step.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-lg">
            This is <strong className="text-purple-600">REINFORCE</strong> – the first algorithm to directly learn 
            a <strong>policy</strong> (strategy) instead of trying to learn values. It's like evolution, 
            but accelerated: try things, see what works, do more of that!
          </p>
        </div>
      </StoryBlock>

      {/* The Big Shift */}
      <Comparison title="🔄 The Paradigm Shift: Value vs Policy">
        <div className="space-y-6">
          <p className="text-gray-700 text-center text-lg mb-6">
            Everything you learned before (Q-Learning, SARSA) was about learning <strong>values</strong>. 
            REINFORCE is completely different – it learns <strong>strategies</strong> directly!
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Value-Based (Old Way) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 p-6"
            >
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                OLD WAY
              </div>
              <div className="text-5xl mb-4 text-center">📊</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Value-Based</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">→</span>
                  <span>Learn Q-values for each action</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">→</span>
                  <span>Pick action with highest Q-value</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">→</span>
                  <span>Indirect: values → policy</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500">→</span>
                  <span>Works great for simple problems</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>Metaphor:</strong> Like building a detailed map of treasure locations, 
                  then following the map to the gold.
                </p>
              </div>
            </motion.div>

            {/* Policy-Based (New Way) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 p-6"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                NEW WAY
              </div>
              <div className="text-5xl mb-4 text-center">🎯</div>
              <h3 className="text-xl font-bold text-purple-900 mb-3 text-center">Policy-Based</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-purple-500">→</span>
                  <span>Learn probabilities for each action</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500">→</span>
                  <span>Sample actions from the policy</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500">→</span>
                  <span>Direct: learn strategy itself</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500">→</span>
                  <span>Can handle continuous actions!</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                <p className="text-xs text-purple-900">
                  <strong>Metaphor:</strong> Like evolving instincts for finding treasure, 
                  no map needed – just gut feeling!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Comparison>

      {/* How It Works */}
      <InteractiveDemo title="🎬 The REINFORCE Learning Process">
        <div className="space-y-6">
          <p className="text-gray-700">
            REINFORCE works like a movie director reviewing footage. Here's the process:
          </p>

          <div className="space-y-4">
            {[
              {
                step: 1,
                icon: '🎬',
                title: 'Record the Episode',
                desc: 'Let the agent play from start to finish, recording every action and reward',
                color: 'from-blue-400 to-blue-600',
                detail: 'Unlike Q-Learning (which updates every step), REINFORCE waits for the full episode'
              },
              {
                step: 2,
                icon: '🎯',
                title: 'Calculate Returns',
                desc: 'For each action, calculate how much total reward came after it',
                color: 'from-green-400 to-green-600',
                detail: 'This is called "return" – the sum of all future rewards (discounted)'
              },
              {
                step: 3,
                icon: '⚖️',
                title: 'Assign Credit',
                desc: 'Good actions (high return) get reinforced. Bad actions (low return) get suppressed',
                color: 'from-purple-400 to-purple-600',
                detail: 'This is credit assignment – figuring out which actions led to success'
              },
              {
                step: 4,
                icon: '🔄',
                title: 'Update Policy',
                desc: 'Adjust the policy to make good actions more likely in the future',
                color: 'from-pink-400 to-pink-600',
                detail: 'The policy slowly evolves toward better and better strategies'
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="flex items-start gap-4"
              >
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${item.color} flex-shrink-0 flex items-center justify-center shadow-lg`}>
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} text-white flex items-center justify-center font-bold text-sm`}>
                      {item.step}
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                  </div>
                  <p className="text-gray-700">{item.desc}</p>
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg text-xs text-gray-600 italic">
                    💡 {item.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </InteractiveDemo>

      {/* See It In Action */}
      <div className="my-8">
        <PlaygroundButton
          algorithm="reinforce"
          environment="classic-grid"
          parameters={{ learning_rate: 0.001, gamma: 0.99, n_episodes: 200 }}
          gridConfig={[
            { x: 4, y: 4, type: 'goal', value: 10 },
            { x: 2, y: 2, type: 'obstacle', value: 0 },
          ]}
          label="🧬 Watch Intelligence Evolve!"
          description="See the agent's policy improve from random to optimal"
          size="large"
        />
      </div>

      {/* Key Insight */}
      <Insight title="🎯 Why REINFORCE Changed Everything">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-gray-900">
            REINFORCE was revolutionary because it opened the door to modern deep RL:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { 
                icon: '♾️', 
                title: 'Continuous Actions', 
                desc: 'Can handle infinite action spaces (e.g., steering angle)',
                example: '🏎️ Self-driving cars' 
              },
              { 
                icon: '🎲', 
                title: 'Stochastic Policies', 
                desc: 'Naturally handles randomness in decision-making',
                example: '🎮 Game AI with unpredictability' 
              },
              { 
                icon: '🧠', 
                title: 'Deep Learning Ready', 
                desc: 'Policy can be a neural network',
                example: '🤖 AlphaGo, ChatGPT' 
              },
              { 
                icon: '🎯', 
                title: 'Direct Optimization', 
                desc: 'Optimizes what you care about directly',
                example: '📈 Maximize cumulative reward' 
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-300 shadow-lg"
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                <div className="text-sm text-gray-700 mb-2">{item.desc}</div>
                <div className="text-xs text-orange-600 font-semibold">
                  {item.example}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-500 rounded-lg">
            <p className="text-sm text-purple-900">
              <strong>🚀 The Future:</strong> REINFORCE is the foundation of modern algorithms like A2C, PPO, and TRPO. 
              It's the ancestor of the AI that powers robots, games, and language models!
            </p>
          </div>
        </div>
      </Insight>

      {/* Challenge */}
      <Challenge title="🏆 Evolution Challenge">
        <div className="space-y-4">
          <p className="text-gray-700">
            Different "evolutionary" strategies lead to different learning speeds. Try these configurations:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <QuickTryButton
                config={{
                  algorithm: 'reinforce',
                  environment: 'classic-grid',
                  parameters: { learning_rate: 0.01, gamma: 0.99, n_episodes: 100 },
                }}
                label="⚡ Fast Evolution (lr=0.01)"
              />
              <p className="text-xs text-gray-600 pl-2">Learns quickly but might be unstable</p>
            </div>

            <div className="space-y-2">
              <QuickTryButton
                config={{
                  algorithm: 'reinforce',
                  environment: 'classic-grid',
                  parameters: { learning_rate: 0.0001, gamma: 0.95, n_episodes: 300 },
                }}
                label="🐌 Slow & Steady (lr=0.0001)"
              />
              <p className="text-xs text-gray-600 pl-2">Learns slowly but more stable</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-sm text-red-900">
              <strong>🎯 Your Mission:</strong> Which strategy reaches optimal behavior first? 
              Which one is more consistent? Why do you think that is?
            </p>
          </div>
        </div>
      </Challenge>

      {/* Epic Finale */}
      <div className="mt-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-10 text-white shadow-2xl"
        >
          {/* Animated particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                initial={{ 
                  x: Math.random() * 100 + '%', 
                  y: Math.random() * 100 + '%',
                  opacity: 0.5 
                }}
                animate={{
                  y: [null, (Math.random() - 0.5) * 200 + '%'],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              🧬
            </motion.div>
            <h3 className="text-3xl font-bold mb-3">You've Witnessed Evolution!</h3>
            <p className="text-pink-100 text-lg mb-6 max-w-2xl mx-auto">
              You now understand how modern AI learns strategies from scratch. 
              Ready to see even more advanced algorithms?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PlaygroundButton
                algorithm="reinforce"
                environment="classic-grid"
                label="Evolve Your Own AI"
                size="large"
              />
              <button
                onClick={() => window.location.href = '/learn/7'}
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all text-lg"
              >
                Next: A2C (The Dynamic Duo) →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </LessonLayout>
  )
}

