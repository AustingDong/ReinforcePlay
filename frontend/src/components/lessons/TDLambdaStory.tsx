import { motion } from 'framer-motion'
import { Clock, Zap, TrendingUp, Sparkles, Target, Timer } from 'lucide-react'
import LessonLayout from './LessonLayout'
import InteractiveBlock from './InteractiveBlock'
import PlaygroundButton from './PlaygroundButton'
import 'katex/dist/katex.min.css'

export default function TDLambdaStory() {
  return (
    <LessonLayout
      title="Time Traveler's Advantage ⏰"
      difficulty="Advanced"
      duration="18 min"
      objectives={[
        'Understand the TD(λ) spectrum between TD(0) and Monte Carlo',
        'Learn how eligibility traces credit past actions',
        'Master the λ parameter for balancing bias vs variance',
        'Apply TD(λ) to accelerate learning'
      ]}
      prerequisites={['Q-Learning', 'SARSA', 'MDP Basics']}
    >
      {/* Story Introduction */}
      <InteractiveBlock type="story" title="🕰️ The Credit Assignment Problem" defaultExpanded>
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            You're playing chess. You make a brilliant move that sets up a checkmate—but it takes 
            <strong> 10 more moves</strong> before you win. When victory comes, how much credit does that early brilliant move deserve?
          </p>

          <motion.div 
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-lg font-semibold text-purple-900">
              This is the <strong>credit assignment problem</strong>: figuring out which past actions were responsible 
              for current rewards. TD(λ) solves this by maintaining an "eligibility trace" — a fading memory 
              of recent actions that share credit when rewards arrive.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              {
                emoji: '⚡',
                title: 'TD(0) - Myopic',
                desc: 'Only credits the immediate last action',
                color: 'from-red-400 to-orange-400'
              },
              {
                emoji: '✨',
                title: 'TD(λ) - Balanced',
                desc: 'Credits recent actions with exponential decay',
                color: 'from-purple-400 to-pink-400'
              },
              {
                emoji: '🎯',
                title: 'Monte Carlo - Patient',
                desc: 'Waits until episode ends to credit all actions',
                color: 'from-blue-400 to-cyan-400'
              }
            ].map((method, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white rounded-lg p-5 shadow-md border-2 border-gray-100"
              >
                <div className={`text-4xl mb-2`}>{method.emoji}</div>
                <h4 className="font-bold text-lg mb-1">{method.title}</h4>
                <p className="text-sm text-gray-600">{method.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </InteractiveBlock>

      {/* Eligibility Traces */}
      <InteractiveBlock type="interactive" title="👣 The Trail of Breadcrumbs">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            Imagine you're walking through a forest, leaving glowing breadcrumbs. Each crumb you drop 
            <strong> slowly fades over time</strong>. When you find treasure, you can trace back the glowing trail 
            and reward all the steps that led you there!
          </p>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-indigo-300">
            <h3 className="text-xl font-bold mb-4 text-indigo-900">
              <Clock className="inline w-6 h-6 mr-2" />
              How Eligibility Traces Work
            </h3>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-5 shadow-md">
                <p className="font-semibold mb-2">Step 1: Visit a state-action pair (s, a)</p>
                <div className="bg-indigo-100 rounded p-3 font-mono text-sm">
                  e(s,a) ← 1.0  {/* Set eligibility to maximum */}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Mark this action as "eligible for credit"
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-md">
                <p className="font-semibold mb-2">Step 2: Each time step passes</p>
                <div className="bg-indigo-100 rounded p-3 font-mono text-sm">
                  e(s,a) ← γ · λ · e(s,a)  {/* Decay by gamma * lambda */}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Traces fade exponentially (λ controls decay speed)
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-md">
                <p className="font-semibold mb-2">Step 3: When reward arrives</p>
                <div className="bg-indigo-100 rounded p-3 font-mono text-sm">
                  Q(s,a) ← Q(s,a) + α · TD_error · e(s,a)  {/* for all (s,a) */}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Update all state-actions proportional to their trace strength
                </p>
              </div>
            </div>
          </div>

          <motion.div 
            className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-300"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-yellow-900 mb-2">The Magic of λ (Lambda)</h4>
                <p className="text-gray-700">
                  <strong>λ = 0:</strong> Only immediate predecessor gets credit (TD(0))<br/>
                  <strong>λ = 0.5:</strong> Recent actions get more credit, older ones less<br/>
                  <strong>λ = 0.9:</strong> Credit spreads far back in time<br/>
                  <strong>λ = 1.0:</strong> All actions in episode get equal treatment (Monte Carlo)
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </InteractiveBlock>

      {/* Visual Timeline */}
      <InteractiveBlock type="interactive" title="📊 Visualizing Credit Distribution">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            Let's see how different λ values distribute credit across a 5-step sequence leading to a reward:
          </p>

          {[
            { lambda: 0, label: 'λ = 0 (TD)', color: 'from-red-400 to-orange-400', values: [0, 0, 0, 0, 1] },
            { lambda: 0.5, label: 'λ = 0.5', color: 'from-purple-400 to-pink-400', values: [0.06, 0.13, 0.25, 0.5, 1] },
            { lambda: 0.9, label: 'λ = 0.9', color: 'from-blue-400 to-cyan-400', values: [0.66, 0.73, 0.81, 0.9, 1] }
          ].map((config, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-white font-bold`}>
                  {config.lambda}
                </div>
                <h4 className="text-lg font-bold">{config.label}</h4>
              </div>

              <div className="flex gap-2 items-end h-32">
                {config.values.map((value, stepIdx) => (
                  <div key={stepIdx} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${value * 100}%` }}
                      transition={{ delay: idx * 0.2 + stepIdx * 0.1, duration: 0.5 }}
                      className={`w-full bg-gradient-to-t ${config.color} rounded-t-lg relative`}
                      style={{ minHeight: '8px' }}
                    >
                      <div className="absolute -top-6 left-0 right-0 text-center text-xs font-semibold">
                        {value.toFixed(2)}
                      </div>
                    </motion.div>
                    <div className="text-xs text-gray-500">t-{4 - stepIdx}</div>
                  </div>
                ))}
                <div className="flex flex-col items-center">
                  <div className="text-2xl mb-1">🎁</div>
                  <div className="text-xs text-gray-500">Reward</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </InteractiveBlock>

      {/* The Bias-Variance Trade-off */}
      <InteractiveBlock type="insight" title="⚖️ The Bias-Variance Spectrum">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Choosing λ is about balancing two competing forces:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-red-600" />
                <h3 className="text-xl font-bold text-red-900">Low λ (Fast & Biased)</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  <strong>Pros:</strong> Fast updates, learns quickly from immediate feedback, low variance
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Cons:</strong> High bias—relies on inaccurate initial value estimates
                </p>
                <div className="bg-red-100 rounded-lg p-3 text-xs">
                  ⚡ Best for: Simple environments, when value estimates are already good
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">High λ (Slow & Accurate)</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  <strong>Pros:</strong> Low bias—uses actual returns, more accurate credit assignment
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Cons:</strong> Slower learning, higher variance, needs episode completion
                </p>
                <div className="bg-blue-100 rounded-lg p-3 text-xs">
                  🎯 Best for: Complex environments with delayed rewards, when accuracy matters
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="bg-purple-50 rounded-xl p-6 border-2 border-purple-300 mt-4"
            whileHover={{ scale: 1.01 }}
          >
            <p className="text-lg font-semibold text-purple-900">
              <TrendingUp className="inline w-6 h-6 mr-2" />
              The Sweet Spot: λ ≈ 0.8-0.95
            </p>
            <p className="text-gray-700 mt-2">
              Most practitioners use λ between 0.8 and 0.95 as a compromise: enough trace memory 
              to handle delayed rewards, but not so much that learning becomes slow and noisy.
            </p>
          </motion.div>
        </div>
      </InteractiveBlock>

      {/* Try It Section */}
      <InteractiveBlock type="interactive" title="🎮 Experiment with λ">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Try TD(λ) with different lambda values and see how it affects learning speed and path quality!
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { lambda: 0.1, desc: 'Fast but myopic' },
              { lambda: 0.5, desc: 'Balanced approach' },
              { lambda: 0.9, desc: 'Deep memory' }
            ].map((config, idx) => (
              <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-300">
                <h4 className="text-lg font-bold mb-2 text-indigo-900">
                  <Timer className="inline w-5 h-5 mr-2" />
                  λ = {config.lambda}
                </h4>
                <p className="text-sm text-gray-700 mb-4">{config.desc}</p>
                <PlaygroundButton
                  algorithm="td_lambda"
                  environment="gridworld"
                  parameters={{
                    alpha: 0.1,
                    gamma: 0.95,
                    epsilon: 0.1,
                    lambda_: config.lambda,
                    n_episodes: 100
                  }}
                  gridConfig={{
                    width: 6,
                    height: 6,
                    start: [0, 0],
                    goal: [5, 5],
                    obstacles: [[2, 2], [2, 3], [3, 2]],
                    rewards: [[4, 4, 5]]
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </InteractiveBlock>

      {/* Real-World Applications */}
      <InteractiveBlock type="insight" title="🌍 Where TD(λ) Shines">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            TD(λ) is particularly powerful in scenarios with complex credit assignment:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                emoji: '🎮',
                title: 'Game Playing',
                description: 'A single strategic move early in the game can determine victory 20 turns later'
              },
              {
                emoji: '🚗',
                title: 'Autonomous Driving',
                description: 'Smooth lane changes require coordinating multiple steering adjustments over time'
              },
              {
                emoji: '💰',
                title: 'Trading Algorithms',
                description: 'Investment decisions compound over weeks/months before showing profit or loss'
              },
              {
                emoji: '🤖',
                title: 'Robot Manipulation',
                description: 'Grasping an object requires a precise sequence of finger movements'
              }
            ].map((example, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg p-5 shadow-md border-2 border-gray-100 hover:border-purple-300 transition-all"
              >
                <div className="text-4xl mb-3">{example.emoji}</div>
                <h4 className="font-bold text-lg mb-2">{example.title}</h4>
                <p className="text-sm text-gray-600">{example.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </InteractiveBlock>

      {/* Key Takeaways */}
      <motion.div 
        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300"
        whileHover={{ scale: 1.01 }}
      >
        <h3 className="text-2xl font-bold mb-4 text-green-900">
          🎓 Key Takeaways
        </h3>
        <ul className="space-y-3">
          {[
            'TD(λ) uses eligibility traces to credit past actions for current rewards',
            'λ controls how far back in time credit is distributed (0 = one step, 1 = entire episode)',
            'Low λ gives fast, biased learning; high λ gives slow, accurate learning',
            'Eligibility traces decay exponentially: recent actions get more credit',
            'λ ≈ 0.8-0.95 works well for most practical applications'
          ].map((takeaway, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-3 text-gray-800"
            >
              <span className="text-green-600 font-bold text-xl">✓</span>
              <span className="flex-1">{takeaway}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </LessonLayout>
  )
}

