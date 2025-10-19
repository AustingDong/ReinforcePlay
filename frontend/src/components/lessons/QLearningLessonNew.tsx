import { useState } from 'react'
import { motion } from 'framer-motion'
import LessonLayout from './LessonLayout'
import SubSection from './SubSection'
import Question from './Question'
import FormulaReveal from './FormulaReveal'
import VisualConcept from './VisualConcept'
import PlaygroundButton from './PlaygroundButton'
import { Sparkles, Target, Map, Zap } from 'lucide-react'

export default function QLearningLessonNew() {
  const [qValues, setQValues] = useState<{ [key: string]: number }>({
    'home-park': 0,
    'home-store': 0,
    'park-home': 0,
    'park-lake': 0,
    'store-home': 0,
    'store-mall': 0,
  })

  const [step, setStep] = useState(0)

  const scenarios = [
    {
      location: 'Home 🏠',
      action: 'Go to Park',
      reward: -1,
      nextBest: 9,
      key: 'home-park',
    },
    {
      location: 'Park 🌳',
      action: 'Go to Lake',
      reward: 10,
      nextBest: 0,
      key: 'park-lake',
    },
    {
      location: 'Home 🏠',
      action: 'Go to Store',
      reward: -1,
      nextBest: 5,
      key: 'home-store',
    },
  ]

  const handleLearn = () => {
    if (step >= scenarios.length) return

    const scenario = scenarios[step]
    const alpha = 0.5
    const gamma = 0.9

    const oldQ = qValues[scenario.key]
    const newQ = oldQ + alpha * (scenario.reward + gamma * scenario.nextBest - oldQ)

    setQValues({ ...qValues, [scenario.key]: newQ })
    setStep(step + 1)
  }

  const handleReset = () => {
    setQValues({
      'home-park': 0,
      'home-store': 0,
      'park-home': 0,
      'park-lake': 0,
      'store-home': 0,
      'store-mall': 0,
    })
    setStep(0)
  }

  return (
    <LessonLayout
      title="The Learning Robot"
      subtitle="Watch how Q-Learning discovers the perfect path"
      icon="🤖"
      difficulty="medium"
      duration="15 minutes"
      objectives={[
        'Understand Q-values through visual metaphors',
        'See the learning process step-by-step',
        'Master the Q-Learning update rule',
      ]}
      prerequisites={['Multi-Armed Bandit', 'Markov Decision Process']}
    >
      {/* Section 1: The Story */}
      <SubSection id="story" title="The Lost Robot" icon="🤖" variant="story">
        <VisualConcept title="A Robot's Journey" emoji="🗺️" color="blue">
          <div className="space-y-4 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-700 leading-relaxed"
            >
              Imagine a robot waking up in an unfamiliar city. It has a mission: <span className="font-bold text-blue-600">find the best ice cream shop</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center items-center gap-6 py-6"
            >
              <div className="text-center">
                <div className="text-5xl mb-2">🤖</div>
                <div className="text-sm font-semibold text-gray-600">Robot</div>
              </div>
              <div className="text-4xl">→</div>
              <div className="text-center">
                <div className="text-5xl mb-2">❓</div>
                <div className="text-sm font-semibold text-gray-600">Unknown City</div>
              </div>
              <div className="text-4xl">→</div>
              <div className="text-center">
                <div className="text-5xl mb-2">🍦</div>
                <div className="text-sm font-semibold text-gray-600">Goal</div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-700 leading-relaxed"
            >
              The robot doesn't have a map. It must <span className="font-bold text-purple-600">explore, learn, and remember</span> which paths lead to rewards.
            </motion.p>
          </div>
        </VisualConcept>

        <div className="mt-6 p-4 rounded-xl bg-purple-100 border border-purple-300">
          <p className="text-gray-800">
            <span className="font-bold">The Challenge:</span> How does the robot learn which actions are good without a teacher telling it what to do?
          </p>
        </div>
      </SubSection>

      {/* Question 1 - Easy */}
      <Question
        id="q1"
        question="What does the robot need to learn?"
        options={[
          'The name of every street in the city',
          'Which actions from each location lead to the best rewards',
          'How to walk faster',
          'The exact coordinates of the ice cream shop',
        ]}
        correctIndex={1}
        difficulty="easy"
        explanation="Exactly! The robot needs to learn which actions (like 'go left' or 'go right') from each location will eventually lead it to the best rewards. This is the essence of Q-Learning!"
        hint="Think about what would help the robot make better decisions at each location."
      />

      {/* Section 2: Q-Values Concept */}
      <SubSection id="q-values" title="The Quality Score" icon="⭐" variant="concept">
        <VisualConcept title="What is a Q-Value?" emoji="🎯" color="purple">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              A <span className="font-bold text-purple-600">Q-value</span> is like a <span className="font-bold">quality rating</span> for each action the robot can take.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                { emoji: '📍', label: 'Location', desc: 'Where am I?' },
                { emoji: '🎬', label: 'Action', desc: 'What can I do?' },
                { emoji: '⭐', label: 'Q-Value', desc: 'How good is it?' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="p-4 rounded-xl bg-white border-2 border-purple-200 text-center"
                >
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <div className="font-bold text-gray-900 mb-1">{item.label}</div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                </motion.div>
              ))}
            </motion.div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200">
              <p className="text-center text-lg font-semibold text-gray-800">
                Q(State, Action) = <span className="text-purple-600">"Expected future reward"</span>
              </p>
            </div>
          </div>
        </VisualConcept>

        <div className="mt-6">
          <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Think of it like restaurant ratings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="text-2xl mb-2">🍕 High Q-Value (9.5/10)</div>
              <p className="text-sm text-gray-700">"Going to this restaurant usually leads to great meals!"</p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="text-2xl mb-2">🥗 Low Q-Value (3.2/10)</div>
              <p className="text-sm text-gray-700">"This place often disappoints..."</p>
            </div>
          </div>
        </div>
      </SubSection>

      {/* Question 2 - Easy */}
      <Question
        id="q2"
        question="If a Q-value is high, what does that mean?"
        options={[
          'The action is quick to perform',
          'The action will likely lead to good rewards in the future',
          'The action has been tried many times',
          'The action is difficult',
        ]}
        correctIndex={1}
        difficulty="easy"
        explanation="Perfect! A high Q-value means the action is expected to lead to good rewards. It's like a recommendation: 'This is a good choice!'"
        hint="Think about what a high rating on a restaurant review means."
      />

      {/* Section 3: Learning Process */}
      <SubSection id="learning" title="How Does Learning Happen?" icon="🧠" variant="concept">
        <VisualConcept title="The Learning Cycle" emoji="🔄" color="green">
          <div className="space-y-4">
            <p className="text-center text-gray-700 text-lg leading-relaxed">
              The robot improves its Q-values through <span className="font-bold text-green-600">experience</span>:
            </p>

            <div className="relative">
              {[
                { num: '1', emoji: '👀', title: 'Observe', desc: 'Where am I now?', color: 'blue' },
                { num: '2', emoji: '🎲', title: 'Act', desc: 'Try an action', color: 'purple' },
                { num: '3', emoji: '🎁', title: 'Receive', desc: 'Get a reward', color: 'green' },
                { num: '4', emoji: '📝', title: 'Update', desc: 'Adjust Q-value', color: 'orange' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-gray-200 mb-3"
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 flex items-center justify-center text-white font-black text-xl`}>
                    {item.num}
                  </div>
                  <div className="text-3xl">{item.emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.desc}</div>
                  </div>
                  {idx < 3 && <div className="text-2xl text-gray-400">→</div>}
                </motion.div>
              ))}
            </div>
          </div>
        </VisualConcept>

        {/* Interactive Learning Demo */}
        <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300">
          <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Interactive Learning Demo
          </h4>

          <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(qValues).map(([key, value]) => (
              <motion.div
                key={key}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5 }}
                className="p-3 rounded-lg bg-white border border-gray-200 text-center"
              >
                <div className="text-xs text-gray-500 mb-1">{key.replace('-', ' → ')}</div>
                <div className="text-2xl font-bold text-purple-600">{value.toFixed(2)}</div>
              </motion.div>
            ))}
          </div>

          {step < scenarios.length && (
            <div className="mb-4 p-4 rounded-lg bg-yellow-100 border border-yellow-300">
              <p className="font-semibold text-gray-900 mb-2">Step {step + 1}:</p>
              <p className="text-gray-700">
                At <span className="font-bold">{scenarios[step].location}</span>, try action{' '}
                <span className="font-bold">{scenarios[step].action}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Reward: {scenarios[step].reward}, Best future: {scenarios[step].nextBest}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLearn}
              disabled={step >= scenarios.length}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step >= scenarios.length ? 'All Steps Complete! 🎉' : 'Learn from Experience'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-6 py-3 rounded-lg bg-gray-600 text-white font-bold shadow-lg"
            >
              Reset
            </motion.button>
          </div>
        </div>
      </SubSection>

      {/* Question 3 - Medium */}
      <Question
        id="q3"
        question="After taking an action and receiving a reward, what should the robot do with its Q-value?"
        options={[
          'Replace it completely with the reward',
          'Keep it unchanged',
          'Update it by combining the old value with new information',
          'Delete it and start over',
        ]}
        correctIndex={2}
        difficulty="medium"
        explanation="Excellent! The robot updates the Q-value by combining old knowledge with new information. This gradual learning is more stable than completely replacing the value each time."
        hint="Think about how you learn - do you forget everything you knew before, or do you adjust your beliefs?"
      />

      {/* Section 4: The Formula */}
      <SubSection id="formula" title="The Mathematics" icon="📐" variant="concept">
        <FormulaReveal
          title="Q-Learning Update Rule"
          description="Now that you understand the intuition, let's see the mathematical formula that makes it all work."
          formula="Q(s, a) \leftarrow Q(s, a) + \alpha \left[ r + \gamma \max_{a'} Q(s', a') - Q(s, a) \right]"
          intuition="Take your current belief (old Q-value), see what actually happened (reward + best future), and adjust your belief a little bit based on the difference."
          variables={[
            { symbol: 's', meaning: 'Current state (location)' },
            { symbol: 'a', meaning: 'Action taken' },
            { symbol: 'α', meaning: 'Learning rate (how fast to learn)' },
            { symbol: 'r', meaning: 'Reward received' },
            { symbol: 'γ', meaning: 'Discount factor (value future vs now)' },
            { symbol: "s'", meaning: 'Next state' },
            { symbol: "a'", meaning: 'Possible next actions' },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <h5 className="font-bold text-blue-900 mb-2">🐢 Small α (e.g., 0.1)</h5>
            <p className="text-sm text-gray-700">Learns slowly, more stable, less sensitive to outliers</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
            <h5 className="font-bold text-purple-900 mb-2">🐇 Large α (e.g., 0.9)</h5>
            <p className="text-sm text-gray-700">Learns quickly, adapts fast, but can be unstable</p>
          </div>
        </div>
      </SubSection>

      {/* Question 4 - Medium */}
      <Question
        id="q4"
        question="In the Q-Learning formula, what does the term 'max Q(s', a')' represent?"
        options={[
          'The maximum reward ever received',
          'The best Q-value from the next state',
          'The average of all Q-values',
          'The current state&apos;s Q-value',
        ]}
        correctIndex={1}
        difficulty="medium"
        explanation="Perfect! The max Q(s', a') is the highest Q-value available from the next state. This represents the best possible future the robot can expect, which helps it evaluate whether its current action was worthwhile."
        hint="Think about looking ahead - what's the best outcome the robot could achieve from where it lands?"
      />

      {/* Question 5 - Hard */}
      <Question
        id="q5"
        question="Why does Q-Learning use the MAX operation instead of the actual next action?"
        options={[
          'To make the math easier',
          'Because it learns off-policy: evaluates optimal actions even while exploring',
          'To avoid negative rewards',
          'Because it&apos;s faster to compute',
        ]}
        correctIndex={1}
        difficulty="hard"
        explanation="Outstanding! This is the KEY insight of Q-Learning. It's 'off-policy' because it learns about the optimal policy (max) while actually following an exploratory policy (like epsilon-greedy). This separation allows it to learn the best actions even while trying random actions!"
        hint="Consider: what if the robot explores randomly, but still wants to learn what the BEST action would have been?"
      />

      {/* Section 5: Try it Yourself */}
      <SubSection id="practice" title="Practice in the Playground" icon="🎮" variant="practice">
        <VisualConcept title="Time to Experiment!" emoji="🚀" color="green">
          <div className="space-y-4 text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              You now understand Q-Learning! Let's see it in action on a real grid world.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <PlaygroundButton
                algorithm="qlearning"
                environment="gridworld"
                parameters={{
                  alpha: 0.1,
                  gamma: 0.9,
                  epsilon: 0.1,
                  n_episodes: 100,
                }}
                gridConfig={{
                  width: 5,
                  height: 5,
                  start: { x: 0, y: 0 },
                  goal: { x: 4, y: 4 },
                  obstacles: [
                    { x: 2, y: 1 },
                    { x: 2, y: 2 },
                    { x: 2, y: 3 },
                  ],
                  rewards: [{ x: 4, y: 0, value: 5 }],
                }}
              >
                🎯 Try Simple Maze
              </PlaygroundButton>

              <PlaygroundButton
                algorithm="qlearning"
                environment="gridworld"
                parameters={{
                  alpha: 0.2,
                  gamma: 0.95,
                  epsilon: 0.2,
                  n_episodes: 200,
                }}
                gridConfig={{
                  width: 6,
                  height: 6,
                  start: { x: 0, y: 0 },
                  goal: { x: 5, y: 5 },
                  obstacles: [
                    { x: 1, y: 2 },
                    { x: 2, y: 2 },
                    { x: 3, y: 2 },
                    { x: 3, y: 3 },
                    { x: 3, y: 4 },
                  ],
                  rewards: [],
                }}
              >
                🏆 Try Hard Maze
              </PlaygroundButton>
            </div>
          </div>
        </VisualConcept>

        <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300">
          <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Experiments to Try:
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span className="text-gray-800">Set α=0.1 vs α=0.9 - which learns better?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span className="text-gray-800">Set γ=0.1 (short-sighted) vs γ=0.99 (far-sighted) - what changes?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span className="text-gray-800">Add multiple reward cells - does the agent find all of them?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span className="text-gray-800">Watch how Q-values change over episodes in the visualization!</span>
            </li>
          </ul>
        </div>
      </SubSection>

      {/* Final Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl"
      >
        <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          What You've Mastered
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { emoji: '⭐', text: 'Q-values represent expected future rewards' },
            { emoji: '🔄', text: 'Learning happens through trial and error' },
            { emoji: '📊', text: 'Updates blend old knowledge with new experiences' },
            { emoji: '🎯', text: 'Off-policy: learns optimal while exploring' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </LessonLayout>
  )
}
