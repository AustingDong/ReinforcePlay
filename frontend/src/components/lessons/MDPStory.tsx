import { motion } from 'framer-motion'
import { Map, Target, TrendingUp, Zap, Brain, ChevronRight } from 'lucide-react'
import LessonLayout from './LessonLayout'
import InteractiveBlock from './InteractiveBlock'
import PlaygroundButton from './PlaygroundButton'
import 'katex/dist/katex.min.css'

export default function MDPStory() {
  return (
    <LessonLayout
      title="The Master Blueprint 🗺️"
      difficulty="Intermediate"
      duration="20 min"
      objectives={[
        'Understand what makes a problem a Markov Decision Process',
        'Learn the components: States, Actions, Rewards, Transitions',
        'Master the Bellman Equation for optimal decision-making',
        'Connect MDPs to real-world sequential decisions'
      ]}
      prerequisites={['Multi-Armed Bandit', 'Basic probability']}
    >
      {/* Story Introduction */}
      <InteractiveBlock type="story" title="🏛️ The Grand Strategy" defaultExpanded>
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Imagine you're the commander of an ancient empire. Every decision you make—where to send your armies, 
            which alliances to form, what to build—affects not just the present, but <strong>shapes your future options</strong>.
          </p>
          
          <p className="text-lg leading-relaxed">
            Unlike the slot machines in the casino, where each pull was independent, <strong>your choices now echo through time</strong>. 
            Moving your knight to square B3 in chess opens new possibilities and closes others. 
            Investing in education today pays dividends decades later.
          </p>

          <motion.div 
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-lg font-semibold text-purple-900">
              This is the world of <span className="text-2xl">Markov Decision Processes</span> — 
              where decisions cascade through time, and the art of strategy is choosing actions that maximize not just immediate rewards, 
              but the <strong>entire future</strong>.
            </p>
          </motion.div>
        </div>
      </InteractiveBlock>

      {/* The MDP Framework */}
      <InteractiveBlock type="interactive" title="🧩 The Four Pillars of Strategy">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Map,
              title: 'States (S)',
              description: 'Every possible situation you could find yourself in',
              example: 'Your position on the board, inventory, health points',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: Zap,
              title: 'Actions (A)',
              description: 'The choices available to you in each state',
              example: 'Move up/down/left/right, buy/sell, attack/defend',
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: TrendingUp,
              title: 'Rewards (R)',
              description: 'Immediate feedback for your actions',
              example: '+100 for reaching goal, -1 for each step, -10 for hitting wall',
              color: 'from-green-500 to-emerald-500'
            },
            {
              icon: ChevronRight,
              title: 'Transitions (P)',
              description: 'The probability of ending up in each next state',
              example: '90% go where intended, 10% slip to adjacent cell',
              color: 'from-orange-500 to-red-500'
            }
          ].map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:border-gray-300 transition-all"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4`}>
                <pillar.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{pillar.title}</h3>
              <p className="text-gray-700 mb-3">{pillar.description}</p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 border-l-4 border-gray-300">
                <strong>Example:</strong> {pillar.example}
              </div>
            </motion.div>
          ))}
        </div>
      </InteractiveBlock>

      {/* The Markov Property */}
      <InteractiveBlock type="insight" title="🔮 The Power of the Present" defaultExpanded>
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Here's the beautiful simplification that makes MDPs tractable:
          </p>

          <motion.div 
            className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xl font-bold text-orange-900 mb-3">
              "The future depends only on the present, not the past."
            </p>
            <p className="text-gray-700">
              If you know your <strong>current state</strong>, you don't need to remember the entire history 
              of how you got there. This is called the <strong>Markov Property</strong>.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-green-50 rounded-lg p-5 border-2 border-green-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✅</span>
                <h4 className="font-bold text-green-900">Markov (Good!)</h4>
              </div>
              <p className="text-sm text-gray-700">
                Chess position on the board tells you everything needed for the next move. 
                History doesn't matter—only current piece positions.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-2 border-red-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">❌</span>
                <h4 className="font-bold text-red-900">Non-Markov (Complex!)</h4>
              </div>
              <p className="text-sm text-gray-700">
                Poker hand evaluation requires remembering betting patterns, previous rounds, 
                and opponent tells—current cards alone aren't enough.
              </p>
            </div>
          </div>
        </div>
      </InteractiveBlock>

      {/* Interactive Value Function */}
      <InteractiveBlock type="interactive" title="💎 What is a State Worth?">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            Imagine you're playing a game. Some positions are clearly better than others. 
            A state's <strong>value</strong> is the <em>expected total reward</em> you'll get from that point onwards, 
            if you play optimally.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Near Goal', value: '95', color: 'from-green-400 to-green-600', reward: '+100 soon!' },
              { label: 'Mid Game', value: '45', color: 'from-yellow-400 to-yellow-600', reward: 'Many steps left' },
              { label: 'Dead End', value: '5', color: 'from-red-400 to-red-600', reward: 'Hard to win' }
            ].map((state, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative"
              >
                <div className={`bg-gradient-to-br ${state.color} rounded-xl p-6 text-white shadow-lg`}>
                  <div className="text-4xl font-bold mb-2">{state.value}</div>
                  <div className="text-sm opacity-90 mb-1">{state.label}</div>
                  <div className="text-xs bg-white/20 rounded px-2 py-1">{state.reward}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="bg-blue-50 rounded-xl p-6 border-2 border-blue-300"
            whileHover={{ scale: 1.01 }}
          >
            <p className="text-lg font-semibold text-blue-900 mb-2">
              <Brain className="inline w-6 h-6 mr-2" />
              The Agent's Goal: Learn which states are valuable!
            </p>
            <p className="text-gray-700">
              Once you know the value of every state, choosing actions becomes simple: 
              <strong> Pick the action that takes you to the highest-value next state!</strong>
            </p>
          </motion.div>
        </div>
      </InteractiveBlock>

      {/* The Bellman Equation */}
      <InteractiveBlock type="challenge" title="🧮 The Bellman Equation (Optional Deep Dive)">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Richard Bellman discovered a recursive relationship that defines optimal decision-making:
          </p>

          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-8 text-center border-2 border-purple-300">
            <div className="text-2xl font-mono mb-4">
              V(s) = max<sub>a</sub> [ R(s,a) + γ · Σ P(s'|s,a) · V(s') ]
            </div>
            <div className="text-sm text-gray-700 space-y-2 text-left max-w-2xl mx-auto">
              <p><strong>V(s):</strong> Value of current state</p>
              <p><strong>R(s,a):</strong> Immediate reward for taking action a</p>
              <p><strong>γ (gamma):</strong> Discount factor (how much we value future vs now)</p>
              <p><strong>P(s'|s,a):</strong> Probability of reaching state s' after action a</p>
              <p><strong>V(s'):</strong> Value of next state</p>
            </div>
          </div>

          <p className="text-lg leading-relaxed">
            In plain English: <strong>"A state's value is the best you can do right now, 
            plus the (discounted) value of where you'll end up."</strong>
          </p>

          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-400">
            <p className="text-sm text-gray-700">
              💡 <strong>Why discount (γ)?</strong> A reward today is worth more than the same reward far in the future. 
              γ = 0.9 means a reward 10 steps away is worth only 35% of an immediate reward (0.9<sup>10</sup> ≈ 0.35).
            </p>
          </div>
        </div>
      </InteractiveBlock>

      {/* Try It Section */}
      <InteractiveBlock type="interactive" title="🎮 See MDPs in Action">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Every algorithm you'll learn (Q-Learning, SARSA, etc.) is trying to solve an MDP. 
            They differ in <em>how</em> they learn values and policies, but they all share the MDP framework.
          </p>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-300">
            <h4 className="text-xl font-bold mb-4 text-indigo-900">
              <Target className="inline w-6 h-6 mr-2" />
              Ready to See an MDP Solver?
            </h4>
            <p className="text-gray-700 mb-4">
              Jump into the playground and watch Q-Learning navigate a GridWorld MDP. 
              Notice how it learns which states are valuable and which paths lead to success!
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
                width: 5,
                height: 5,
                start: [0, 0],
                goal: [4, 4],
                obstacles: [[1, 1], [2, 2], [3, 1]],
                rewards: []
              }}
            />
          </div>
        </div>
      </InteractiveBlock>

      {/* Real World Connection */}
      <InteractiveBlock type="insight" title="🌍 MDPs Everywhere">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Once you see the MDP framework, you'll recognize it everywhere:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                emoji: '🚗',
                title: 'Self-Driving Cars',
                description: 'States: position, speed, nearby objects. Actions: accelerate, brake, steer. Rewards: safe arrival.'
              },
              {
                emoji: '💰',
                title: 'Investment Strategy',
                description: 'States: portfolio value, market conditions. Actions: buy/sell/hold. Rewards: profit minus risk.'
              },
              {
                emoji: '🎮',
                title: 'Game AI',
                description: 'States: game screen pixels. Actions: button presses. Rewards: score increase, level completion.'
              },
              {
                emoji: '🏥',
                title: 'Medical Treatment',
                description: 'States: patient vitals, symptoms. Actions: prescribe medication. Rewards: health improvement.'
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
            'MDPs model sequential decision problems with states, actions, rewards, and transitions',
            'The Markov Property means the future only depends on the present state',
            'Value functions tell us how good each state is for long-term success',
            'The Bellman Equation connects immediate rewards with future consequences',
            'All RL algorithms are solving MDPs—they just use different strategies'
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

