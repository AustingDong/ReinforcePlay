import { useState } from 'react'
import { motion } from 'framer-motion'
import LessonLayout from './LessonLayout'
import { StoryBlock, InteractiveDemo, Insight, Challenge, Comparison } from './InteractiveBlock'
import PlaygroundButton, { QuickTryButton } from './PlaygroundButton'
import { ArrowRight, Zap, Brain, Target } from 'lucide-react'

export default function QLearningLessonNew() {
  const [selectedAction, setSelectedAction] = useState<number | null>(null)
  const [qValues, setQValues] = useState({
    up: 0,
    right: 5,
    down: -2,
    left: 1,
  })

  // Simple grid for demonstration
  const simpleGrid = [
    { x: 4, y: 0, type: 'goal' as const, value: 10 },
    { x: 2, y: 1, type: 'obstacle' as const, value: 0 },
  ]

  return (
    <LessonLayout
      title="Q-Learning"
      subtitle="Learn to make optimal decisions through trial and error"
      icon="🧠"
      difficulty="beginner"
      estimatedTime="15 min"
      learningObjectives={[
        'Understand how agents learn from experience',
        'Master the Q-Learning update rule intuitively',
        'See how exploration leads to better strategies',
        'Apply Q-Learning to solve maze problems',
      ]}
      playgroundConfig={{
        algorithm: 'qlearning',
        environment: 'classic-grid',
        parameters: {
          alpha: 0.1,
          gamma: 0.9,
          epsilon: 0.1,
          n_episodes: 100,
        },
        gridConfig: simpleGrid,
      }}
      prerequisites={['Understanding of Markov Decision Processes']}
    >
      {/* Story Introduction */}
      <StoryBlock title="🎮 Imagine You're a Game Character">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            You're a robot 🤖 trapped in a mysterious maze. You don't have a map, and you don't know where the treasure 🏆 is.
            But you can move around, and every time you make a move, something happens:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 my-6">
            {[
              { emoji: '💎', label: 'Find gems', reward: '+1', color: 'from-yellow-400 to-orange-500' },
              { emoji: '🧱', label: 'Hit walls', reward: '-1', color: 'from-gray-400 to-gray-600' },
              { emoji: '🏆', label: 'Reach goal', reward: '+10', color: 'from-green-400 to-emerald-500' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-white shadow-lg text-center`}
              >
                <div className="text-4xl mb-2">{item.emoji}</div>
                <div className="font-semibold">{item.label}</div>
                <div className="text-2xl font-bold mt-1">{item.reward}</div>
              </motion.div>
            ))}
          </div>

          <p className="text-lg leading-relaxed">
            <strong className="text-purple-600">Q-Learning is like being that robot.</strong> You learn by trying different paths,
            remembering which moves led to treasure, and which led to dead ends. Over time, you build a mental map of what to do in each situation.
          </p>
        </div>
      </StoryBlock>

      {/* Interactive Q-Value Demo */}
      <InteractiveDemo title="🎯 Interactive: How Q-Values Work">
        <div className="space-y-4">
          <p className="text-gray-700">
            At every position, you have <strong>Q-values</strong> for each possible action. Think of them as your "gut feeling" about how good each move is.
          </p>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
            <div className="text-center mb-6">
              <div className="inline-block relative">
                <div className="text-6xl">🤖</div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  ?
                </div>
              </div>
              <p className="mt-2 text-gray-600">Which way should I go?</p>
            </div>

            {/* Action buttons with Q-values */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { action: 'up', emoji: '⬆️', label: 'Move Up', q: qValues.up },
                { action: 'right', emoji: '➡️', label: 'Move Right', q: qValues.right },
                { action: 'down', emoji: '⬇️', label: 'Move Down', q: qValues.down },
                { action: 'left', emoji: '⬅️', label: 'Move Left', q: qValues.left },
              ].map((item) => {
                const isSelected = selectedAction === item.action
                const isBest = item.q === Math.max(...Object.values(qValues))
                
                return (
                  <motion.button
                    key={item.action}
                    onClick={() => setSelectedAction(item.action)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all
                      ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-gray-50'}
                      ${isBest ? 'ring-2 ring-green-400' : ''}
                    `}
                  >
                    {isBest && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        ✓
                      </div>
                    )}
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="text-sm font-semibold text-gray-700">{item.label}</div>
                    <div className={`text-2xl font-bold mt-1 ${item.q > 0 ? 'text-green-600' : item.q < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      Q = {item.q}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <p className="text-sm text-green-900">
                <strong>💡 The robot chooses the action with the highest Q-value!</strong> In this case, moving right (Q=5) looks most promising.
              </p>
            </div>
          </div>
        </div>
      </InteractiveDemo>

      {/* The Learning Process */}
      <StoryBlock title="🎓 How Does Learning Happen?">
        <div className="space-y-4">
          <p className="text-lg">
            Here's the magic: <strong className="text-purple-600">Q-values start at zero</strong> (the robot knows nothing). 
            Then, through experience, they get updated based on:
          </p>

          <div className="my-6 space-y-4">
            {[
              {
                step: 1,
                icon: '🎯',
                title: 'Take an action',
                desc: 'The robot moves and sees what happens',
                color: 'from-blue-400 to-blue-600',
              },
              {
                step: 2,
                icon: '🎁',
                title: 'Get a reward',
                desc: 'Did it find treasure or hit a wall?',
                color: 'from-green-400 to-green-600',
              },
              {
                step: 3,
                icon: '👀',
                title: 'Look ahead',
                desc: 'From the new position, what\'s the best future move?',
                color: 'from-purple-400 to-purple-600',
              },
              {
                step: 4,
                icon: '📝',
                title: 'Update knowledge',
                desc: 'Adjust the Q-value based on what was learned',
                color: 'from-pink-400 to-pink-600',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex-shrink-0 flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} text-white flex items-center justify-center font-bold text-sm`}>
                      {item.step}
                    </span>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                  </div>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </StoryBlock>

      {/* Quick Playground Try */}
      <div className="my-8">
        <PlaygroundButton
          algorithm="qlearning"
          environment="classic-grid"
          parameters={{ alpha: 0.1, gamma: 0.9, epsilon: 0.1, n_episodes: 100 }}
          gridConfig={simpleGrid}
          label="🎮 See Q-Learning in Action!"
          description="Watch the robot learn to navigate a simple maze"
          size="large"
        />
      </div>

      {/* Key Insight */}
      <Insight title="🔑 The Key Insight">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-gray-900">
            Q-Learning is <strong className="text-yellow-600">off-policy</strong>. What does that mean?
          </p>
          <p className="text-gray-700">
            The robot can learn about the best strategy even while exploring randomly! It's like a student who learns by watching what
            the best students do, even while trying their own experiments.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
              <div className="text-2xl mb-2">🎲 While Exploring...</div>
              <p className="text-sm text-gray-700">Robot tries random moves (epsilon-greedy)</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <div className="text-2xl mb-2">🧠 While Learning...</div>
              <p className="text-sm text-gray-700">Updates assume best future actions</p>
            </div>
          </div>
        </div>
      </Insight>

      {/* Challenge */}
      <Challenge title="🎯 Challenge: Tune the Parameters">
        <div className="space-y-4">
          <p className="text-gray-700">
            Ready to experiment? Try different configurations to see how they affect learning:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <QuickTryButton
                config={{
                  algorithm: 'qlearning',
                  environment: 'classic-grid',
                  parameters: { alpha: 0.5, gamma: 0.9, epsilon: 0.3, n_episodes: 100 },
                }}
                label="🚀 Fast Learner (α=0.5, ε=0.3)"
              />
              <p className="text-xs text-gray-600 pl-2">High learning rate + lots of exploration</p>
            </div>

            <div className="space-y-2">
              <QuickTryButton
                config={{
                  algorithm: 'qlearning',
                  environment: 'classic-grid',
                  parameters: { alpha: 0.01, gamma: 0.99, epsilon: 0.05, n_episodes: 200 },
                }}
                label="🐢 Careful Learner (α=0.01, ε=0.05)"
              />
              <p className="text-xs text-gray-600 pl-2">Slow learning + minimal exploration</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
            <p className="text-sm text-orange-900">
              <strong>Question:</strong> Which one finds the goal faster? Which one finds the BEST path?
            </p>
          </div>
        </div>
      </Challenge>

      {/* The Math (But Make It Optional) */}
      <InteractiveDemo title="🔢 For the Math Curious: The Update Rule" defaultExpanded={false}>
        <div className="space-y-4">
          <p className="text-gray-700">
            If you want to see the formula, here it is. But remember: the intuition above is what really matters!
          </p>

          <div className="bg-gray-900 rounded-xl p-6 text-white font-mono overflow-x-auto">
            <div className="text-center text-lg mb-4">
              Q(s, a) ← Q(s, a) + α [<span className="text-yellow-300">r</span> + γ max Q(s', a') - Q(s, a)]
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm mt-4">
              <div>
                <strong className="text-blue-300">Q(s, a)</strong> = Q-value for state s, action a
              </div>
              <div>
                <strong className="text-green-300">α (alpha)</strong> = Learning rate (0-1)
              </div>
              <div>
                <strong className="text-yellow-300">r</strong> = Reward received
              </div>
              <div>
                <strong className="text-purple-300">γ (gamma)</strong> = Discount factor (0-1)
              </div>
              <div>
                <strong className="text-pink-300">s'</strong> = Next state
              </div>
              <div>
                <strong className="text-cyan-300">max Q(s', a')</strong> = Best Q-value in next state
              </div>
            </div>
          </div>

          <p className="text-gray-700 italic">
            💡 Translation: "Update your estimate by learning from the difference between what you expected and what you got (plus what you can get next)."
          </p>
        </div>
      </InteractiveDemo>

      {/* Comparison */}
      <Comparison title="⚖️ Q-Learning vs Other Methods">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-3 font-bold text-gray-900">Feature</th>
                <th className="text-left p-3 font-bold text-purple-600">Q-Learning</th>
                <th className="text-left p-3 font-bold text-blue-600">SARSA</th>
                <th className="text-left p-3 font-bold text-green-600">REINFORCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-semibold">Learning Type</td>
                <td className="p-3">Off-policy</td>
                <td className="p-3">On-policy</td>
                <td className="p-3">On-policy</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-semibold">Best For</td>
                <td className="p-3">Finding optimal path</td>
                <td className="p-3">Safe exploration</td>
                <td className="p-3">Complex policies</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-semibold">Speed</td>
                <td className="p-3">⚡⚡⚡ Fast</td>
                <td className="p-3">⚡⚡ Moderate</td>
                <td className="p-3">⚡ Slower</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Comparison>

      {/* Final CTA */}
      <div className="mt-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="text-5xl mb-4">🎓</div>
          <h3 className="text-2xl font-bold mb-2">Ready to Master Q-Learning?</h3>
          <p className="text-blue-100 mb-6">
            Head to the playground and create your own mazes. Watch the agent learn from scratch!
          </p>
          <PlaygroundButton
            algorithm="qlearning"
            environment="classic-grid"
            label="Open Playground"
            size="large"
          />
        </motion.div>
      </div>
    </LessonLayout>
  )
}

