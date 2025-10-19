import { motion } from 'framer-motion'
import LessonLayout from './LessonLayout'
import SubSection from './SubSection'
import Question from './Question'
import VisualConcept from './VisualConcept'
import { Bot, Target, Sparkles, Brain } from 'lucide-react'

export default function IntroToRLLesson() {
  return (
    <LessonLayout
      title="Welcome to Reinforcement Learning"
      subtitle="Begin your journey into the world of intelligent agents"
      icon="📚"
      difficulty="beginner"
      duration="10 minutes"
      objectives={[
        'Understand what Reinforcement Learning is',
        'See how RL differs from other learning approaches',
        'Recognize real-world RL applications',
      ]}
    >
      {/* Section 1: What is RL? */}
      <SubSection id="what-is-rl" title="What is Reinforcement Learning?" icon="🧠" variant="story">
        <VisualConcept title="Learning by Doing" emoji="🎮" color="blue">
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg text-gray-700 text-center leading-relaxed"
            >
              Imagine learning to ride a bike. Nobody gives you a rulebook. You just...{' '}
              <span className="font-bold text-blue-600">try, fall, adjust, and improve</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center gap-6 flex-wrap"
            >
              <div className="text-center p-4">
                <div className="text-6xl mb-2">🚲</div>
                <div className="text-sm font-semibold text-gray-600">Try</div>
              </div>
              <div className="text-4xl">→</div>
              <div className="text-center p-4">
                <div className="text-6xl mb-2">😣</div>
                <div className="text-sm font-semibold text-gray-600">Fall</div>
              </div>
              <div className="text-4xl">→</div>
              <div className="text-center p-4">
                <div className="text-6xl mb-2">💡</div>
                <div className="text-sm font-semibold text-gray-600">Learn</div>
              </div>
              <div className="text-4xl">→</div>
              <div className="text-center p-4">
                <div className="text-6xl mb-2">🏆</div>
                <div className="text-sm font-semibold text-gray-600">Master</div>
              </div>
            </motion.div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300">
              <p className="text-lg font-semibold text-center text-gray-900">
                That's <span className="text-blue-600">Reinforcement Learning</span>: learning through trial, error, and feedback.
              </p>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Question 1 */}
      <Question
        id="q1"
        question="What is the key characteristic of Reinforcement Learning?"
        options={[
          'Following a pre-defined set of rules',
          'Learning from labeled examples',
          'Learning through interaction and feedback',
          'Memorizing all possible solutions',
        ]}
        correctIndex={2}
        difficulty="easy"
        explanation="Exactly! RL is all about learning through interaction with an environment and receiving feedback (rewards or penalties) to improve over time."
        hint="Think about how you learned to ride a bike - was it from reading a book or from doing it?"
      />

      {/* Section 2: The Three Pillars */}
      <SubSection id="pillars" title="The Three Pillars of RL" icon="🏛️" variant="concept">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: '🤖',
              title: 'Agent',
              desc: 'The learner/decision-maker',
              examples: ['Robot', 'AI player', 'Trading bot'],
              color: 'blue',
            },
            {
              emoji: '🌍',
              title: 'Environment',
              desc: 'The world the agent interacts with',
              examples: ['Game level', 'Real world', 'Simulation'],
              color: 'green',
            },
            {
              emoji: '🎁',
              title: 'Reward',
              desc: 'Feedback signal (good/bad)',
              examples: ['+10 points', '-5 penalty', '+100 win'],
              color: 'purple',
            },
          ].map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className={`p-6 rounded-2xl border-2 bg-gradient-to-br ${
                pillar.color === 'blue'
                  ? 'from-blue-50 to-cyan-50 border-blue-300'
                  : pillar.color === 'green'
                  ? 'from-green-50 to-emerald-50 border-green-300'
                  : 'from-purple-50 to-pink-50 border-purple-300'
              }`}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl text-center mb-4"
              >
                {pillar.emoji}
              </motion.div>
              <h4 className="text-xl font-bold text-gray-900 text-center mb-2">{pillar.title}</h4>
              <p className="text-gray-700 text-center mb-4">{pillar.desc}</p>
              <div className="space-y-2">
                {pillar.examples.map((ex, i) => (
                  <div key={i} className="text-sm text-center px-3 py-1 rounded-full bg-white/60 border border-gray-200">
                    {ex}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300"
        >
          <h4 className="font-bold text-xl mb-3 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            The RL Loop
          </h4>
          <div className="flex items-center justify-center gap-4 flex-wrap text-lg font-semibold text-gray-800">
            <span>🤖 Agent</span>
            <span>→</span>
            <span>🎬 Action</span>
            <span>→</span>
            <span>🌍 Environment</span>
            <span>→</span>
            <span>🎁 Reward</span>
            <span>→</span>
            <span>🔄 Repeat</span>
          </div>
        </motion.div>
      </SubSection>

      {/* Question 2 */}
      <Question
        id="q2"
        question="In the RL loop, what does the environment provide to the agent?"
        options={[
          'Only the next possible actions',
          'A reward signal and the new state',
          'The optimal action to take',
          'A complete map of all states',
        ]}
        correctIndex={1}
        difficulty="easy"
        explanation="Perfect! After the agent takes an action, the environment responds with two things: a reward (feedback) and the new state (where the agent ended up)."
        hint="Think about what you need to know after taking an action - did it work (reward), and where are you now (new state)?"
      />

      {/* Section 3: RL vs Other Learning */}
      <SubSection id="comparison" title="How is RL Different?" icon="🔍" variant="concept">
        <VisualConcept title="Three Types of Learning" emoji="🎓" color="purple">
          <div className="space-y-4">
            {[
              {
                type: 'Supervised Learning',
                emoji: '👨‍🏫',
                desc: 'Learn from labeled examples with a teacher',
                example: 'Showing cat photos labeled "cat"',
                color: 'bg-blue-100 border-blue-300',
              },
              {
                type: 'Unsupervised Learning',
                emoji: '🔎',
                desc: 'Find patterns in unlabeled data',
                example: 'Grouping similar photos together',
                color: 'bg-green-100 border-green-300',
              },
              {
                type: 'Reinforcement Learning',
                emoji: '🎮',
                desc: 'Learn through trial and error with rewards',
                example: 'Playing a game and getting points',
                color: 'bg-purple-100 border-purple-300',
                highlight: true,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className={`p-4 rounded-xl border-2 ${item.color} ${
                  item.highlight ? 'ring-4 ring-purple-300 ring-offset-2' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{item.emoji}</div>
                  <div className="flex-1">
                    <h5 className="font-bold text-lg text-gray-900 mb-1">{item.type}</h5>
                    <p className="text-gray-700 mb-2">{item.desc}</p>
                    <div className="text-sm text-gray-600 italic">Example: {item.example}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </VisualConcept>
      </SubSection>

      {/* Question 3 */}
      <Question
        id="q3"
        question="What makes Reinforcement Learning unique compared to supervised learning?"
        options={[
          'RL is faster',
          'RL learns from interaction and delayed rewards, not labeled examples',
          'RL requires less data',
          'RL is only for games',
        ]}
        correctIndex={1}
        difficulty="medium"
        explanation="Exactly! Unlike supervised learning where you have labeled examples, RL learns through interaction with an environment and must deal with delayed rewards - actions taken now might not show their effects until much later!"
        hint="In RL, there's no teacher telling you the 'correct' answer for each situation."
      />

      {/* Section 4: Real World Applications */}
      <SubSection id="applications" title="Where is RL Used?" icon="🌟" variant="story">
        <VisualConcept title="RL Powers Modern AI" emoji="🚀" color="orange">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { emoji: '🎮', title: 'Game AI', desc: 'AlphaGo, Dota 2, Atari games' },
              { emoji: '🤖', title: 'Robotics', desc: 'Robot walking, manipulation, navigation' },
              { emoji: '💬', title: 'ChatGPT', desc: 'RLHF (Reinforcement Learning from Human Feedback)' },
              { emoji: '🚗', title: 'Self-Driving', desc: 'Autonomous vehicles learning to drive' },
              { emoji: '📈', title: 'Trading', desc: 'Stock trading bots making decisions' },
              { emoji: '⚡', title: 'Energy', desc: 'Optimizing power grid efficiency' },
            ].map((app, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-2 text-center">{app.emoji}</div>
                <h5 className="font-bold text-center text-gray-900 mb-1">{app.title}</h5>
                <p className="text-sm text-center text-gray-600">{app.desc}</p>
              </motion.div>
            ))}
          </div>
        </VisualConcept>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 p-6 rounded-xl bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300"
        >
          <div className="flex items-start gap-3">
            <Brain className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-bold text-lg text-gray-900 mb-2">Fun Fact!</h5>
              <p className="text-gray-700 leading-relaxed">
                ChatGPT and other large language models use RL (specifically RLHF) in their training to learn from human preferences.
                When you thumbs up or down a response, you're helping the RL algorithm learn!
              </p>
            </div>
          </div>
        </motion.div>
      </SubSection>

      {/* Question 4 */}
      <Question
        id="q4"
        question="Why is RL particularly well-suited for game playing and robotics?"
        options={[
          'Because they have unlimited data',
          'Because they can try many actions and learn from the outcomes in a trial-and-error manner',
          'Because they don&apos;t need rewards',
          'Because they are simple problems',
        ]}
        correctIndex={1}
        difficulty="medium"
        explanation="Excellent! Games and robotics are perfect for RL because agents can try many different actions, see what happens, and learn from the outcomes. A robot can try walking different ways, and a game AI can try different strategies until it finds what works best!"
        hint="Think about how you'd teach a robot to walk - could you write down exact instructions, or would trial-and-error work better?"
      />

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl"
      >
        <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
          <Target className="w-8 h-8" />
          Your RL Foundation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { emoji: '🤖', text: 'Agent interacts with environment' },
            { emoji: '🎁', text: 'Learns from reward feedback' },
            { emoji: '🔄', text: 'Trial and error over time' },
            { emoji: '🌟', text: 'Powers modern AI systems' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className="font-semibold text-lg">{item.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-white/20 backdrop-blur-sm">
          <p className="text-center text-lg font-semibold">
            Ready to dive deeper? Let's explore specific algorithms! 🚀
          </p>
        </div>
      </motion.div>
    </LessonLayout>
  )
}
