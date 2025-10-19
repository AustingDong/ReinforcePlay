import { motion } from 'framer-motion'
import { Shield, Rocket, TrendingUp, Zap, Target, Brain, Scale } from 'lucide-react'
import LessonLayout from './LessonLayout'
import InteractiveBlock from './InteractiveBlock'
import PlaygroundButton from './PlaygroundButton'
import 'katex/dist/katex.min.css'

export default function PPOStory() {
  return (
    <LessonLayout
      title="The Safety Revolution 🛡️"
      difficulty="Advanced"
      duration="22 min"
      objectives={[
        'Understand why PPO became the dominant RL algorithm',
        'Learn the trust region concept and clipping mechanism',
        'Compare TRPO and PPO approaches to safe policy updates',
        'Discover how PPO powers ChatGPT and modern AI systems'
      ]}
      prerequisites={['REINFORCE', 'A2C', 'Actor-Critic']}
    >
      {/* Story Introduction */}
      <InteractiveBlock type="story" title="⚠️ The Catastrophic Update Problem" defaultExpanded>
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Imagine you're training a robot to walk. After 1000 hours of practice, it's finally learned to take smooth, 
            stable steps. Then you make one <strong>small update</strong> to its policy and... 
            it forgets everything, flailing wildly and falling over.
          </p>

          <motion.div 
            className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-300"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-lg font-semibold text-red-900 mb-3">
              🚨 This is the catastrophic update problem
            </p>
            <p className="text-gray-700">
              In deep reinforcement learning, gradient updates can <strong>radically change</strong> the policy. 
              A single bad update can destroy hours of training progress. We need a way to improve the policy 
              while ensuring updates are <em>safe</em> and <em>conservative</em>.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              {
                emoji: '❌',
                title: 'Vanilla PG',
                desc: 'Can take huge, destructive steps',
                color: 'border-red-300 bg-red-50'
              },
              {
                emoji: '🐢',
                title: 'TRPO',
                desc: 'Safe but complex & slow',
                color: 'border-blue-300 bg-blue-50'
              },
              {
                emoji: '✨',
                title: 'PPO',
                desc: 'Safe, simple, fast—the best of both worlds',
                color: 'border-green-300 bg-green-50'
              }
            ].map((method, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className={`rounded-lg p-5 shadow-md border-2 ${method.color}`}
              >
                <div className="text-4xl mb-2">{method.emoji}</div>
                <h4 className="font-bold text-lg mb-1">{method.title}</h4>
                <p className="text-sm text-gray-600">{method.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </InteractiveBlock>

      {/* Trust Regions */}
      <InteractiveBlock type="interactive" title="🎯 The Trust Region Concept">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            Imagine you're navigating in fog with a map that's only accurate within a 10-meter radius. 
            You can trust the map within this <strong>"trust region"</strong>, but beyond it, the terrain might be different. 
            Similarly, in RL, our gradient estimates are only reliable for <em>small</em> policy changes.
          </p>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-indigo-300">
            <h3 className="text-xl font-bold mb-4 text-indigo-900">
              <Shield className="inline w-6 h-6 mr-2" />
              The Core Idea
            </h3>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-5 shadow-md">
                <p className="font-semibold mb-2">🎯 Goal:</p>
                <p className="text-gray-700">
                  Maximize expected reward: improve the policy as much as possible
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-md">
                <p className="font-semibold mb-2">⚖️ Constraint:</p>
                <p className="text-gray-700">
                  The new policy can't be too different from the old policy
                </p>
                <div className="bg-indigo-100 rounded p-3 font-mono text-sm mt-3">
                  KL(π_old || π_new) ≤ δ  {/* Keep KL divergence small */}
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-md">
                <p className="font-semibold mb-2">💡 Result:</p>
                <p className="text-gray-700">
                  Monotonic improvement—every update makes the policy <strong>at least as good</strong> as before, 
                  never catastrophically worse
                </p>
              </div>
            </div>
          </div>

          <motion.div 
            className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-300"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-yellow-900 mb-2">KL Divergence Explained</h4>
                <p className="text-gray-700">
                  KL divergence measures "how different" two probability distributions are. 
                  If the old policy says "60% left, 40% right" and the new policy says "61% left, 39% right," 
                  KL divergence is tiny (small change). But if it suddenly says "10% left, 90% right," 
                  KL divergence is huge (dangerous change).
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </InteractiveBlock>

      {/* TRPO Approach */}
      <InteractiveBlock type="interactive" title="🐢 TRPO: The Careful Optimizer">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            <strong>Trust Region Policy Optimization (TRPO)</strong> was the first major algorithm to enforce 
            the trust region constraint mathematically. It directly solves the constrained optimization problem.
          </p>

          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-300">
            <h4 className="text-lg font-bold mb-4 text-blue-900">TRPO's Approach</h4>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold mb-2">Step 1: Compute natural gradient</p>
                <p className="text-sm text-gray-600">
                  Find the direction that improves the policy the most
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold mb-2">Step 2: Apply KL constraint</p>
                <p className="text-sm text-gray-600">
                  Scale the update so KL(π_old || π_new) ≤ δ (typically δ = 0.01)
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold mb-2">Step 3: Line search</p>
                <p className="text-sm text-gray-600">
                  Test multiple step sizes to find the best one that satisfies the constraint
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-green-50 rounded-lg p-5 border-2 border-green-300">
              <h4 className="font-bold text-green-900 mb-3">✅ TRPO Pros</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Strong theoretical guarantees (monotonic improvement)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Very stable training
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Works well on continuous control tasks
                </li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-2 border-red-300">
              <h4 className="font-bold text-red-900 mb-3">❌ TRPO Cons</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  Complex to implement (conjugate gradients, Fisher matrix)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  Computationally expensive (line search)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  Requires second-order optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </InteractiveBlock>

      {/* PPO's Brilliant Simplification */}
      <InteractiveBlock type="interactive" title="✨ PPO: The Elegant Solution">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            OpenAI researchers asked: <em>"What if we could get TRPO's stability without all the complexity?"</em> 
            The answer was <strong>Proximal Policy Optimization (PPO)</strong>—a simple clipping trick that achieves 
            similar results with far less computation.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-300">
            <h3 className="text-xl font-bold mb-4 text-purple-900">
              <Rocket className="inline w-6 h-6 mr-2" />
              PPO's Clipped Objective
            </h3>

            <div className="bg-white rounded-lg p-6 mb-4">
              <div className="text-center text-2xl font-mono mb-4">
                L = E[ min(r(θ)·A, clip(r(θ), 1-ε, 1+ε)·A) ]
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>r(θ):</strong> Probability ratio = π_new(a|s) / π_old(a|s)</p>
                <p><strong>A:</strong> Advantage (how good this action was)</p>
                <p><strong>ε:</strong> Clipping parameter (typically 0.2)</p>
                <p><strong>clip(r, 1-ε, 1+ε):</strong> Constrain r to [0.8, 1.2]</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  scenario: 'r = 0.7',
                  meaning: 'New policy much less likely',
                  result: 'Clipped to 0.8 (don\'t go too far)',
                  color: 'from-red-400 to-red-600'
                },
                {
                  scenario: 'r = 1.0',
                  meaning: 'Policies are identical',
                  result: 'No clipping (safe zone)',
                  color: 'from-green-400 to-green-600'
                },
                {
                  scenario: 'r = 2.5',
                  meaning: 'New policy much more likely',
                  result: 'Clipped to 1.2 (don\'t go too far)',
                  color: 'from-red-400 to-red-600'
                }
              ].map((example, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-gradient-to-br ${example.color} rounded-lg p-4 text-white shadow-lg`}
                >
                  <div className="font-mono font-bold mb-2">{example.scenario}</div>
                  <div className="text-xs opacity-90 mb-2">{example.meaning}</div>
                  <div className="text-xs bg-white/20 rounded px-2 py-1">{example.result}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            className="bg-blue-50 rounded-xl p-6 border-2 border-blue-300"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-blue-900 mb-2">The Genius of Clipping</h4>
                <p className="text-gray-700">
                  Instead of computing complex KL constraints, PPO simply <strong>ignores</strong> updates that would 
                  change the policy too much. If an action becomes way more (or less) likely, we cap the update. 
                  This achieves TRPO-like stability with just a min() and clip() operation!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </InteractiveBlock>

      {/* TRPO vs PPO Comparison */}
      <InteractiveBlock type="comparison" title="⚔️ TRPO vs PPO Showdown">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-4 text-left">Aspect</th>
                <th className="border border-gray-300 p-4 text-left bg-blue-50">TRPO</th>
                <th className="border border-gray-300 p-4 text-left bg-purple-50">PPO</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  aspect: 'Constraint Method',
                  trpo: 'Hard KL divergence constraint',
                  ppo: 'Clipped surrogate objective'
                },
                {
                  aspect: 'Implementation',
                  trpo: 'Complex (conjugate gradients, Fisher matrix)',
                  ppo: 'Simple (just clip operation)'
                },
                {
                  aspect: 'Computation Cost',
                  trpo: 'High (second-order optimization)',
                  ppo: 'Low (first-order only)'
                },
                {
                  aspect: 'Stability',
                  trpo: 'Very stable (theoretical guarantees)',
                  ppo: 'Very stable (empirically proven)'
                },
                {
                  aspect: 'Sample Efficiency',
                  trpo: 'Good',
                  ppo: 'Good (similar to TRPO)'
                },
                {
                  aspect: 'Popularity',
                  trpo: 'Important historically',
                  ppo: 'Current industry standard'
                }
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 p-4 font-semibold">{row.aspect}</td>
                  <td className="border border-gray-300 p-4 text-sm">{row.trpo}</td>
                  <td className="border border-gray-300 p-4 text-sm">{row.ppo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InteractiveBlock>

      {/* PPO Powers ChatGPT */}
      <InteractiveBlock type="insight" title="🌟 PPO Powers Modern AI">
        <div className="space-y-4">
          <motion.div 
            className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-8 border-2 border-cyan-300"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-cyan-900">
              💬 The ChatGPT Connection
            </h3>
            <p className="text-lg text-gray-700 mb-4">
              When OpenAI trained ChatGPT with human feedback (RLHF), they used <strong>PPO</strong> as the 
              core algorithm. The language model is the "policy," human preferences are the "rewards," 
              and PPO ensures the model improves without forgetting its language abilities.
            </p>
            <div className="bg-white rounded-lg p-5">
              <p className="text-sm text-gray-700 mb-2"><strong>RLHF with PPO:</strong></p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Human ranks model outputs: "Response A is better than B"</li>
                <li>Train a reward model to predict human preferences</li>
                <li>Use PPO to optimize the language model policy</li>
                <li>Clipping prevents the model from deviating too far (staying coherent)</li>
              </ol>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                emoji: '🤖',
                title: 'Robotics',
                description: 'Robot locomotion, manipulation, humanoid control (e.g., Boston Dynamics-style)'
              },
              {
                emoji: '🎮',
                title: 'Game AI',
                description: 'Dota 2 (OpenAI Five), StarCraft, complex strategy games'
              },
              {
                emoji: '🚁',
                title: 'Drone Control',
                description: 'Autonomous flight, obstacle avoidance, acrobatic maneuvers'
              },
              {
                emoji: '💰',
                title: 'Trading & Finance',
                description: 'Portfolio optimization, market making, risk management'
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

      {/* Try It Section */}
      <InteractiveBlock type="interactive" title="🎮 Experience PPO">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Try PPO in the playground and experiment with the clip ratio (ε). 
            Notice how smaller ε gives more conservative updates!
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-300">
              <h4 className="text-lg font-bold mb-3 text-purple-900">
                <Shield className="inline w-5 h-5 mr-2" />
                Conservative PPO
              </h4>
              <p className="text-sm text-gray-700 mb-4">
                Clip ratio = 0.1 (very safe, slow improvement)
              </p>
              <PlaygroundButton
                algorithm="ppo"
                environment="gridworld"
                parameters={{
                  learning_rate: 0.001,
                  gamma: 0.99,
                  clip_ratio: 0.1,
                  entropy_coef: 0.01,
                  value_coef: 0.5,
                  n_episodes: 200
                }}
                gridConfig={{
                  width: 6,
                  height: 6,
                  start: [0, 0],
                  goal: [5, 5],
                  obstacles: [[2, 2], [2, 3], [3, 2]],
                  rewards: []
                }}
              />
            </div>

            <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-300">
              <h4 className="text-lg font-bold mb-3 text-orange-900">
                <Rocket className="inline w-5 h-5 mr-2" />
                Aggressive PPO
              </h4>
              <p className="text-sm text-gray-700 mb-4">
                Clip ratio = 0.3 (faster improvement, less stable)
              </p>
              <PlaygroundButton
                algorithm="ppo"
                environment="gridworld"
                parameters={{
                  learning_rate: 0.001,
                  gamma: 0.99,
                  clip_ratio: 0.3,
                  entropy_coef: 0.01,
                  value_coef: 0.5,
                  n_episodes: 200
                }}
                gridConfig={{
                  width: 6,
                  height: 6,
                  start: [0, 0],
                  goal: [5, 5],
                  obstacles: [[2, 2], [2, 3], [3, 2]],
                  rewards: []
                }}
              />
            </div>
          </div>
        </div>
      </InteractiveBlock>

      {/* Key Takeaways */}
      <motion.div 
        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300"
        whileHover={{ scale: 1.01 }}
      >
        <h3 className="text-2xl font-bold mb-4 text-green-900">
          <Target className="inline w-7 h-7 mr-2" />
          Key Takeaways
        </h3>
        <ul className="space-y-3">
          {[
            'Trust regions prevent catastrophic policy updates by constraining change',
            'TRPO uses KL divergence constraints but is complex to implement',
            'PPO achieves similar stability with simple clipping: r(θ) ∈ [1-ε, 1+ε]',
            'PPO is the current industry standard for policy gradient RL',
            'PPO powers ChatGPT\'s RLHF, robotics, game AI, and more',
            'Clip ratio ε controls the trade-off between safety and learning speed'
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

      {/* Congratulations */}
      <motion.div 
        className="bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 rounded-xl p-8 border-2 border-yellow-400"
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-3xl font-bold mb-4 text-orange-900 text-center">
          🎉 Congratulations!
        </h3>
        <p className="text-lg text-gray-700 text-center mb-4">
          You've journeyed from simple bandits to the state-of-the-art algorithms powering modern AI. 
          You now understand the core ideas behind <strong>ChatGPT</strong>, <strong>AlphaGo</strong>, 
          and cutting-edge robotics!
        </p>
        <div className="text-center">
          <p className="text-gray-600">
            🚀 Keep exploring in the Playground, and consider diving deeper into advanced topics like 
            model-based RL, offline RL, and meta-learning!
          </p>
        </div>
      </motion.div>
    </LessonLayout>
  )
}

