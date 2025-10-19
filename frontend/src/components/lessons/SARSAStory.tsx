import { motion } from 'framer-motion'
import { Shield, Zap, TrendingDown, AlertTriangle, Target, Scale } from 'lucide-react'
import LessonLayout from './LessonLayout'
import InteractiveBlock from './InteractiveBlock'
import PlaygroundButton from './PlaygroundButton'
import 'katex/dist/katex.min.css'

export default function SARSAStory() {
  return (
    <LessonLayout
      title="The Cautious Explorer 🛡️"
      difficulty="Intermediate"
      duration="15 min"
      objectives={[
        'Understand the difference between on-policy and off-policy learning',
        'Learn how SARSA respects its own exploration strategy',
        'Compare SARSA\'s cautious behavior with Q-Learning\'s boldness',
        'Know when to use SARSA vs Q-Learning in real applications'
      ]}
      prerequisites={['Q-Learning', 'MDP Basics']}
    >
      {/* Story Introduction */}
      <InteractiveBlock type="story" title="🎭 Two Explorers, Two Philosophies" defaultExpanded>
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Remember our robot learning to navigate mazes with Q-Learning? It was <strong>bold and reckless</strong>—
            always imagining the best possible future, even when that meant walking dangerously close to cliffs during training.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-300"
              whileHover={{ scale: 1.03 }}
            >
              <div className="text-4xl mb-3">🦸 Q-Learning</div>
              <h3 className="text-xl font-bold text-red-900 mb-2">The Daredevil</h3>
              <p className="text-gray-700 mb-3">
                "I&apos;ll explore randomly now, but assume I&apos;ll always make perfect decisions later!"
              </p>
              <div className="bg-red-100 rounded-lg p-3 text-sm">
                <strong>Philosophy:</strong> Learn the optimal policy, even if you don&apos;t follow it yet
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300"
              whileHover={{ scale: 1.03 }}
            >
              <div className="text-4xl mb-3">🛡️ SARSA</div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">The Realist</h3>
              <p className="text-gray-700 mb-3">
                "I&apos;ll learn a policy that accounts for my actual exploration habits!"
              </p>
              <div className="bg-blue-100 rounded-lg p-3 text-sm">
                <strong>Philosophy:</strong> Learn the value of what you actually do, mistakes and all
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300 mt-6"
            whileHover={{ scale: 1.01 }}
          >
            <p className="text-lg font-semibold text-purple-900">
              SARSA stands for <strong>S</strong>tate - <strong>A</strong>ction - <strong>R</strong>eward - 
              <strong>S</strong>tate&apos; - <strong>A</strong>ction&apos;. It uses the <em>actual next action</em> (A&apos;) 
              you plan to take, not the best possible action.
            </p>
          </motion.div>
        </div>
      </InteractiveBlock>

      {/* On-Policy vs Off-Policy */}
      <InteractiveBlock type="interactive" title="📊 The Critical Difference">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            The distinction between on-policy (SARSA) and off-policy (Q-Learning) is subtle but profound:
          </p>

          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Q-Learning Update</h3>
                </div>
                <div className="bg-red-50 rounded-lg p-4 font-mono text-sm border-2 border-red-200 mb-3">
                  Q(s,a) ← Q(s,a) + α[r + γ·<strong className="text-red-700">max</strong> Q(s&apos;,a&apos;) - Q(s,a)]
                </div>
                <p className="text-sm text-gray-600">
                  Uses <strong className="text-red-700">max Q(s&apos;,a&apos;)</strong> — the best possible next action, 
                  regardless of what you&apos;ll actually do
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">SARSA Update</h3>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 font-mono text-sm border-2 border-blue-200 mb-3">
                  Q(s,a) ← Q(s,a) + α[r + γ·<strong className="text-blue-700">Q(s&apos;,a&apos;)</strong> - Q(s,a)]
                </div>
                <p className="text-sm text-gray-600">
                  Uses <strong className="text-blue-700">Q(s&apos;,a&apos;)</strong> — the action you&apos;ll actually take next 
                  (chosen by your ε-greedy policy)
                </p>
              </div>
            </div>
          </div>

          <motion.div 
            className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-300"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-yellow-900 mb-2">Why This Matters</h4>
                <p className="text-gray-700">
                  If you&apos;re exploring randomly 10% of the time (ε = 0.1), SARSA learns &quot;I might randomly fall off the cliff,&quot; 
                  while Q-Learning learns &quot;I&apos;ll never fall if I play perfectly.&quot; SARSA is more <strong>realistic</strong> 
                  about the risks of exploration!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </InteractiveBlock>

      {/* The Cliff Walking Problem */}
      <InteractiveBlock type="interactive" title="🏔️ The Cliff Scenario">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            Imagine a gridworld with a cliff. There&apos;s a short, risky path along the cliff edge (+100 reward, but one wrong step = -100), 
            and a longer, safer path further inland (+100 reward, takes more steps).
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-red-600" />
                <h3 className="text-xl font-bold text-red-900">Q-Learning&apos;s Choice</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  <strong>During Training:</strong> &quot;I&apos;ll take the cliff path—it&apos;s optimal! Oh no, I fell... 
                  but I&apos;ll learn that&apos;s the best path anyway.&quot;
                </p>
                <p className="text-sm text-gray-700">
                  <strong>After Training:</strong> Takes the cliff edge (if ε=0) 
                  because it learned that&apos;s the optimal route
                </p>
                <div className="bg-red-100 rounded-lg p-3 text-xs">
                  ⚡ Result: <strong>Optimal but risky</strong> path during learning phase
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">SARSA&apos;s Choice</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  <strong>During Training:</strong> &quot;With my random exploration, I might fall. Better learn 
                  a path that&apos;s safe even when I explore!&quot;
                </p>
                <p className="text-sm text-gray-700">
                  <strong>After Training:</strong> Takes the safer inland route, avoiding the cliff altogether
                </p>
                <div className="bg-blue-100 rounded-lg p-3 text-xs">
                  🛡️ Result: <strong>Safer</strong> path that accounts for exploration risks
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="bg-purple-50 rounded-xl p-6 border-2 border-purple-300"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start gap-3">
              <Scale className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-purple-900 mb-2">The Trade-off</h4>
                <p className="text-gray-700">
                  SARSA learns a policy that&apos;s safer during exploration but might not find the absolute optimal path. 
                  Q-Learning learns the optimal path but can be dangerous while learning. Choose based on your priorities!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </InteractiveBlock>

      {/* Visual Comparison */}
      <InteractiveBlock type="comparison" title="🔬 Side-by-Side Comparison">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-4 text-left">Aspect</th>
                <th className="border border-gray-300 p-4 text-left bg-red-50">Q-Learning (Off-Policy)</th>
                <th className="border border-gray-300 p-4 text-left bg-blue-50">SARSA (On-Policy)</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  aspect: 'Update Rule',
                  qlearn: 'Uses max Q(s\',a\') — best possible action',
                  sarsa: 'Uses Q(s\',a\') — actual next action'
                },
                {
                  aspect: 'Policy Type',
                  qlearn: 'Off-policy: learns optimal policy while exploring',
                  sarsa: 'On-policy: learns the policy it\'s currently following'
                },
                {
                  aspect: 'Risk Behavior',
                  qlearn: 'Bold: ignores exploration risks',
                  sarsa: 'Cautious: accounts for exploration mistakes'
                },
                {
                  aspect: 'Convergence',
                  qlearn: 'Converges to optimal policy',
                  sarsa: 'Converges to policy that\'s safe under exploration'
                },
                {
                  aspect: 'Best For',
                  qlearn: 'Simulations, games, when training safely is possible',
                  sarsa: 'Real robots, safety-critical systems, expensive mistakes'
                }
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 p-4 font-semibold">{row.aspect}</td>
                  <td className="border border-gray-300 p-4 text-sm">{row.qlearn}</td>
                  <td className="border border-gray-300 p-4 text-sm">{row.sarsa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InteractiveBlock>

      {/* Try It Section */}
      <InteractiveBlock type="interactive" title="🎮 Experience the Difference">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            See SARSA&apos;s cautious approach in action! Try it on a gridworld with obstacles and compare 
            with Q-Learning. Notice how SARSA might take safer paths, especially early in training.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-300">
              <h4 className="text-lg font-bold mb-3 text-blue-900">
                <Shield className="inline w-5 h-5 mr-2" />
                Try SARSA
              </h4>
              <p className="text-sm text-gray-700 mb-4">
                Watch how SARSA learns a safe policy that respects exploration
              </p>
              <PlaygroundButton
                algorithm="sarsa"
                environment="gridworld"
                parameters={{
                  alpha: 0.1,
                  gamma: 0.95,
                  epsilon: 0.1,
                  n_episodes: 100
                }}
                gridConfig={{
                  width: 6,
                  height: 4,
                  start: [0, 0],
                  goal: [5, 3],
                  obstacles: [[2, 1], [3, 1], [4, 1]],
                  rewards: [[5, 0, -10], [5, 1, -10], [5, 2, -10]]
                }}
              />
            </div>

            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-300">
              <h4 className="text-lg font-bold mb-3 text-red-900">
                <Zap className="inline w-5 h-5 mr-2" />
                Compare with Q-Learning
              </h4>
              <p className="text-sm text-gray-700 mb-4">
                Run the same scenario with Q-Learning to see the bold approach
              </p>
              <PlaygroundButton
                algorithm="qlearning"
                environment="gridworld"
                parameters={{
                  alpha: 0.1,
                  gamma: 0.95,
                  epsilon: 0.1,
                  n_episodes: 100
                }}
                gridConfig={{
                  width: 6,
                  height: 4,
                  start: [0, 0],
                  goal: [5, 3],
                  obstacles: [[2, 1], [3, 1], [4, 1]],
                  rewards: [[5, 0, -10], [5, 1, -10], [5, 2, -10]]
                }}
              />
            </div>
          </div>
        </div>
      </InteractiveBlock>

      {/* When to Use What */}
      <InteractiveBlock type="insight" title="🎯 Choosing Your Algorithm">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
              <h4 className="font-bold text-green-900 mb-3 text-lg">✅ Use Q-Learning When:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Training in a simulator (safe failures)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  You want the absolute optimal policy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Learning from offline datasets
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Games, puzzles, discrete action spaces
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
              <h4 className="font-bold text-blue-900 mb-3 text-lg">🛡️ Use SARSA When:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Training on real hardware (robots, drones)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Mistakes are expensive or dangerous
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  You want safe behavior during training
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Environments with high-risk states
                </li>
              </ul>
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
            'SARSA is on-policy: it learns the value of the policy it\'s currently following',
            'Q-Learning is off-policy: it learns the optimal policy regardless of current behavior',
            'SARSA accounts for exploration risks, making it safer during training',
            'Q-Learning finds the true optimal policy but can be risky while learning',
            'Choose SARSA for safety-critical applications, Q-Learning for maximum performance'
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

