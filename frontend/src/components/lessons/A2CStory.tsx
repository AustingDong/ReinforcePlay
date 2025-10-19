import { motion } from 'framer-motion'
import { Users, Brain, TrendingUp, Sparkles, Target, Zap } from 'lucide-react'
import LessonLayout from './LessonLayout'
import InteractiveBlock from './InteractiveBlock'
import PlaygroundButton from './PlaygroundButton'
import 'katex/dist/katex.min.css'

export default function A2CStory() {
  return (
    <LessonLayout
      title="The Dynamic Duo 🎭"
      difficulty="Advanced"
      duration="20 min"
      objectives={[
        'Understand the Actor-Critic architecture',
        'Learn how the Actor and Critic collaborate',
        'Master the Advantage function for better learning',
        'Compare Actor-Critic with pure policy gradient methods'
      ]}
      prerequisites={['REINFORCE', 'Q-Learning', 'Policy Gradients']}
    >
      {/* Story Introduction */}
      <InteractiveBlock type="story" title="🎬 Two Minds, One Goal" defaultExpanded>
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Imagine a movie production: the <strong>Director</strong> (Actor) makes creative decisions—
            "Let's shoot this scene from this angle!" Meanwhile, the <strong>Critic</strong> watches and provides feedback: 
            "That angle works brilliantly!" or "Hmm, we can do better."
          </p>

          <motion.div 
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-lg font-semibold text-purple-900">
              This is <strong>Actor-Critic</strong>: a two-network system where the Actor chooses actions 
              (the policy), and the Critic evaluates how good those actions are (the value function). 
              They train each other, creating a powerful learning loop!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300"
              whileHover={{ scale: 1.03 }}
            >
              <div className="text-4xl mb-3">🎭 Actor</div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">The Decision Maker</h3>
              <p className="text-gray-700 mb-3">
                A neural network that outputs action probabilities: "30% go left, 70% go right"
              </p>
              <div className="bg-blue-100 rounded-lg p-3 text-sm">
                <strong>Job:</strong> Choose actions (the policy π(a|s))
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300"
              whileHover={{ scale: 1.03 }}
            >
              <div className="text-4xl mb-3">🧠 Critic</div>
              <h3 className="text-xl font-bold text-green-900 mb-2">The Evaluator</h3>
              <p className="text-gray-700 mb-3">
                A neural network that estimates value: "This state is worth +45 points"
              </p>
              <div className="bg-green-100 rounded-lg p-3 text-sm">
                <strong>Job:</strong> Evaluate states/actions (the value V(s))
              </div>
            </motion.div>
          </div>
        </div>
      </InteractiveBlock>

      {/* The Problem with Pure Policy Gradients */}
      <InteractiveBlock type="insight" title="🤔 Why Not Just REINFORCE?">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Remember REINFORCE? It worked by running full episodes and adjusting the policy based on total rewards. 
            But it had <strong>high variance</strong>—sometimes you get lucky, sometimes you don't, making learning slow and unstable.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-300">
              <h4 className="font-bold text-red-900 mb-3">❌ REINFORCE Problems</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  High variance in gradient estimates
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  Waits for episode to finish (slow feedback)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  Can't learn from partial episodes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  Unstable training, needs many samples
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
              <h4 className="font-bold text-green-900 mb-3">✅ Actor-Critic Solutions</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Critic reduces variance with value baseline
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Updates every step (fast feedback)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Bootstraps from value estimates (like TD)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  More stable and sample-efficient
                </li>
              </ul>
            </div>
          </div>
        </div>
      </InteractiveBlock>

      {/* The Advantage Function */}
      <InteractiveBlock type="interactive" title="💎 The Secret Sauce: Advantage">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            The key insight is using the <strong>Advantage function</strong> instead of raw returns:
          </p>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-indigo-300">
            <div className="text-center mb-6">
              <div className="text-3xl font-mono mb-4">
                A(s,a) = Q(s,a) - V(s)
              </div>
              <p className="text-gray-700 text-lg">
                "How much better is action <em>a</em> compared to the average action in state <em>s</em>?"
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  value: '+5',
                  color: 'from-green-400 to-green-600',
                  label: 'Great Action!',
                  desc: 'Much better than average'
                },
                {
                  value: '0',
                  color: 'from-gray-400 to-gray-600',
                  label: 'Average Action',
                  desc: 'As expected'
                },
                {
                  value: '-8',
                  color: 'from-red-400 to-red-600',
                  label: 'Bad Action',
                  desc: 'Worse than average'
                }
              ].map((adv, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-gradient-to-br ${adv.color} rounded-xl p-5 text-white shadow-lg`}
                >
                  <div className="text-4xl font-bold mb-2">{adv.value}</div>
                  <div className="text-sm font-semibold mb-1">{adv.label}</div>
                  <div className="text-xs bg-white/20 rounded px-2 py-1">{adv.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-300"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-yellow-900 mb-2">Why Advantage Works</h4>
                <p className="text-gray-700">
                  Instead of saying "This state gave +50 reward, increase probability of all actions," 
                  Advantage says "Going right was +5 better than expected, going left was -8 worse." 
                  This <strong>reduces variance</strong> by comparing to a baseline (V(s))!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </InteractiveBlock>

      {/* The A2C Algorithm */}
      <InteractiveBlock type="interactive" title="⚙️ How A2C Works">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            A2C (Advantage Actor-Critic) runs multiple agents in parallel and updates every few steps:
          </p>

          <div className="space-y-4">
            {[
              {
                step: '1',
                title: 'Collect Experience',
                icon: Users,
                color: 'from-blue-400 to-blue-600',
                description: 'Multiple agents explore the environment simultaneously, gathering trajectories'
              },
              {
                step: '2',
                title: 'Compute Advantages',
                icon: Brain,
                color: 'from-purple-400 to-purple-600',
                description: 'For each state-action: A(s,a) = r + γ·V(s\') - V(s)'
              },
              {
                step: '3',
                title: 'Update Critic',
                icon: TrendingUp,
                color: 'from-green-400 to-green-600',
                description: 'Train the value network to predict returns better: minimize (V(s) - target)²'
              },
              {
                step: '4',
                title: 'Update Actor',
                icon: Zap,
                color: 'from-orange-400 to-orange-600',
                description: 'Adjust policy to favor actions with positive advantage: increase log π(a|s) · A(s,a)'
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 flex items-start gap-4"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className="w-5 h-5 text-gray-600" />
                    <h4 className="font-bold text-lg">{step.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="bg-blue-50 rounded-xl p-6 border-2 border-blue-300"
            whileHover={{ scale: 1.01 }}
          >
            <p className="text-lg font-semibold text-blue-900 mb-2">
              <Users className="inline w-6 h-6 mr-2" />
              The "A2" in A2C: Advantage + Asynchronous
            </p>
            <p className="text-gray-700">
              While modern implementations are often synchronous, the original idea was to run multiple agents 
              asynchronously (at their own pace) to decorrelate experiences and stabilize learning.
            </p>
          </motion.div>
        </div>
      </InteractiveBlock>

      {/* Comparison Table */}
      <InteractiveBlock type="comparison" title="📊 Actor-Critic vs Alternatives">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-4 text-left">Method</th>
                <th className="border border-gray-300 p-4 text-left">Update Frequency</th>
                <th className="border border-gray-300 p-4 text-left">Variance</th>
                <th className="border border-gray-300 p-4 text-left">Sample Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  method: 'REINFORCE',
                  freq: 'End of episode',
                  variance: 'High',
                  efficiency: 'Low'
                },
                {
                  method: 'Q-Learning',
                  freq: 'Every step',
                  variance: 'Low (but only discrete actions)',
                  efficiency: 'High'
                },
                {
                  method: 'A2C',
                  freq: 'Every N steps',
                  variance: 'Medium',
                  efficiency: 'High'
                },
                {
                  method: 'PPO (next lesson!)',
                  freq: 'Every N steps',
                  variance: 'Low',
                  efficiency: 'Very High'
                }
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 p-4 font-semibold">{row.method}</td>
                  <td className="border border-gray-300 p-4 text-sm">{row.freq}</td>
                  <td className="border border-gray-300 p-4 text-sm">{row.variance}</td>
                  <td className="border border-gray-300 p-4 text-sm">{row.efficiency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InteractiveBlock>

      {/* Try It Section */}
      <InteractiveBlock type="interactive" title="🎮 See A2C in Action">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Watch A2C learn to navigate! Notice how it balances exploration and exploitation smoothly.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
            <h4 className="text-xl font-bold mb-4 text-purple-900">
              <Target className="inline w-6 h-6 mr-2" />
              Try A2C in the Playground
            </h4>
            <p className="text-gray-700 mb-4">
              Experiment with learning rate, value coefficient, and entropy coefficient to see 
              how they affect the Actor-Critic balance!
            </p>

            <PlaygroundButton
              algorithm="a2c"
              environment="gridworld"
              parameters={{
                learning_rate: 0.001,
                gamma: 0.99,
                entropy_coef: 0.01,
                value_coef: 0.5,
                n_episodes: 150
              }}
              gridConfig={{
                width: 6,
                height: 6,
                start: [0, 0],
                goal: [5, 5],
                obstacles: [[2, 2], [2, 3], [3, 2], [3, 3]],
                rewards: [[4, 4, 3]]
              }}
            />
          </div>
        </div>
      </InteractiveBlock>

      {/* Real-World Applications */}
      <InteractiveBlock type="insight" title="🌍 Where A2C Excels">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Actor-Critic methods power many modern AI systems:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                emoji: '🎮',
                title: 'AlphaGo & AlphaZero',
                description: 'Used actor-critic architecture to master Go, Chess, and Shogi at superhuman levels'
              },
              {
                emoji: '🤖',
                title: 'Robot Control',
                description: 'Continuous control tasks like robot locomotion benefit from policy gradient methods'
              },
              {
                emoji: '🎬',
                title: 'Recommendation Systems',
                description: 'Sequential content recommendations modeled as an RL problem'
              },
              {
                emoji: '🚁',
                title: 'Autonomous Drones',
                description: 'Real-time flight control requires fast, stable policy updates'
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
            'Actor-Critic combines policy gradients (Actor) with value estimation (Critic)',
            'The Advantage function A(s,a) = Q(s,a) - V(s) reduces variance',
            'Actor learns what to do, Critic learns how good actions are',
            'A2C updates every N steps and runs multiple agents in parallel',
            'Actor-Critic is more stable and sample-efficient than pure policy gradients'
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

