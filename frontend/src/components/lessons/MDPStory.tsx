import { motion } from 'framer-motion'
import LessonLayout from './LessonLayout'
import SubSection from './SubSection'
import Question from './Question'
import FormulaReveal from './FormulaReveal'
import VisualConcept from './VisualConcept'
import PlaygroundButton from './PlaygroundButton'
import { Map, Target, Sparkles, Compass } from 'lucide-react'

export default function MDPStory() {
  return (
    <LessonLayout
      title="The Master Blueprint"
      subtitle="The mathematical framework behind all intelligent decisions"
      icon="🗺️"
      difficulty="medium"
      duration="12 minutes"
      objectives={[
        'Understand states, actions, and transitions',
        'Learn what makes decisions sequential',
        'Master the Markov property',
      ]}
      prerequisites={['Introduction to RL']}
    >
      {/* Section 1: The Story */}
      <SubSection id="story" title="The Strategic Mastermind" icon="🎯" variant="story">
        <VisualConcept title="Every Decision Shapes the Future" emoji="🌊" color="blue">
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg text-gray-700 text-center leading-relaxed"
            >
              You're a chess grandmaster. Each move doesn't just matter <span className="font-bold">now</span> - it changes{' '}
              <span className="font-bold text-blue-600">every future possibility</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {[
                { emoji: '♟️', label: 'Opening', desc: 'Many options' },
                { emoji: '⚔️', label: 'Middlegame', desc: 'Tactics emerge' },
                { emoji: '👑', label: 'Endgame', desc: 'Paths narrow' },
                { emoji: '🏆', label: 'Victory', desc: 'Goal reached!' },
              ].map((phase, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="p-4 rounded-xl bg-white border-2 border-blue-200 text-center"
                >
                  <div className="text-5xl mb-2">{phase.emoji}</div>
                  <div className="font-bold text-gray-900">{phase.label}</div>
                  <div className="text-sm text-gray-600">{phase.desc}</div>
                </motion.div>
              ))}
            </motion.div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300">
              <p className="text-lg font-semibold text-center text-gray-900">
                This is a <span className="text-blue-600">sequential decision process</span> - the essence of MDPs.
              </p>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Question 1 */}
      <Question
        id="q1"
        question="What makes a decision 'sequential'?"
        options={[
          'It happens in a specific order',
          'Each decision affects future situations and possibilities',
          'It takes a long time',
          'Multiple people are involved',
        ]}
        correctIndex={1}
        difficulty="easy"
        explanation="Perfect! Sequential decisions are special because each choice changes the situation you'll face next, creating a chain of cause and effect."
        hint="Think about chess - does moving a pawn affect what moves you can make later?"
      />

      {/* Section 2: The Four Elements */}
      <SubSection id="elements" title="The Four Building Blocks" icon="🧱" variant="concept">
        <div className="space-y-6">
          {[
            {
              icon: '📍',
              title: 'States (S)',
              desc: 'Where you are / Current situation',
              examples: ['Chess: board position', 'Maze: your location', 'Life: your situation'],
              color: 'blue',
            },
            {
              icon: '🎬',
              title: 'Actions (A)',
              desc: 'What you can do / Available choices',
              examples: ['Chess: legal moves', 'Maze: up/down/left/right', 'Life: your decisions'],
              color: 'purple',
            },
            {
              icon: '🎲',
              title: 'Transitions (P)',
              desc: 'What happens next / Consequences',
              examples: ['Chess: new board state', 'Maze: new position', 'Life: outcomes'],
              color: 'green',
            },
            {
              icon: '🎁',
              title: 'Rewards (R)',
              desc: 'How good is it / Feedback',
              examples: ['Chess: +1 for win', 'Maze: +10 at goal', 'Life: happiness'],
              color: 'orange',
            },
          ].map((element, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className={`relative p-6 rounded-2xl border-2 bg-gradient-to-br ${
                element.color === 'blue'
                  ? 'from-blue-50 to-cyan-50 border-blue-300'
                  : element.color === 'purple'
                  ? 'from-purple-50 to-pink-50 border-purple-300'
                  : element.color === 'green'
                  ? 'from-green-50 to-emerald-50 border-green-300'
                  : 'from-orange-50 to-red-50 border-orange-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-white to-gray-100 border-2 border-gray-300 flex items-center justify-center text-4xl shadow-lg"
                >
                  {element.icon}
                </motion.div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{element.title}</h4>
                  <p className="text-lg text-gray-700 mb-4">{element.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {element.examples.map((ex, i) => (
                      <div key={i} className="text-sm px-3 py-2 rounded-lg bg-white/60 border border-gray-200">
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300"
        >
          <h4 className="font-bold text-xl mb-4 text-center flex items-center justify-center gap-2">
            <Compass className="w-6 h-6 text-purple-600" />
            The MDP Cycle
          </h4>
          <div className="flex items-center justify-center gap-4 flex-wrap text-lg font-semibold text-gray-800">
            <span>📍 State</span>
            <span className="text-2xl">→</span>
            <span>🎬 Action</span>
            <span className="text-2xl">→</span>
            <span>🎁 Reward</span>
            <span className="text-2xl">+</span>
            <span>📍 New State</span>
            <span className="text-2xl">→</span>
            <span>🔄 Repeat</span>
          </div>
        </motion.div>
      </SubSection>

      {/* Question 2 */}
      <Question
        id="q2"
        question="In an MDP, what two things do you get after taking an action?"
        options={[
          'Only a reward',
          'A reward and the next state',
          'A list of all possible actions',
          'The optimal action to take next',
        ]}
        correctIndex={1}
        difficulty="easy"
        explanation="Exactly! After taking an action in an MDP, the environment gives you two pieces of information: a reward (how good was that action) and the new state (where did you end up)."
        hint="Think about what changes after you make a chess move - do you get points AND a new board position?"
      />

      {/* Section 3: The Markov Property */}
      <SubSection id="markov" title="The Markov Property" icon="🎯" variant="concept">
        <VisualConcept title="The Future Depends Only on NOW" emoji="⏰" color="purple">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              The <span className="font-bold text-purple-600">Markov Property</span> says: <br />
              <span className="font-bold">"The present contains all information needed to predict the future."</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-green-50 border-2 border-green-300"
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">✅</div>
                  <h5 className="font-bold text-xl text-green-900">Markov</h5>
                </div>
                <p className="text-gray-700 mb-3">Chess: Current board has everything</p>
                <div className="text-sm space-y-1 text-gray-600">
                  <div>• Where each piece is now</div>
                  <div>• What moves are legal</div>
                  <div>• Don't need to remember the entire game history!</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-red-50 border-2 border-red-300"
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">❌</div>
                  <h5 className="font-bold text-xl text-red-900">Non-Markov</h5>
                </div>
                <p className="text-gray-700 mb-3">Poker: Need to remember history</p>
                <div className="text-sm space-y-1 text-gray-600">
                  <div>• What cards were played before</div>
                  <div>• How opponents have been betting</div>
                  <div>• Current state alone isn't enough!</div>
                </div>
              </motion.div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300">
              <p className="text-center text-lg font-semibold text-gray-900">
                Markov = <span className="text-purple-600">"Memoryless"</span> → Simplifies learning dramatically!
              </p>
            </div>
          </div>
        </VisualConcept>

        <div className="mt-6 p-6 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-bold text-lg text-gray-900 mb-2">Why This Matters</h5>
              <p className="text-gray-700 leading-relaxed">
                If the Markov property holds, we don't need to track the entire history of states and actions.
                We only need to know where we are RIGHT NOW. This makes the learning problem tractable!
              </p>
            </div>
          </div>
        </div>
      </SubSection>

      {/* Question 3 */}
      <Question
        id="q3"
        question="What does the Markov property mean?"
        options={[
          'The future is random',
          'The current state contains all info needed to predict the future',
          'You must remember all past states',
          'Actions don&apos;t affect the future',
        ]}
        correctIndex={1}
        difficulty="medium"
        explanation="Perfect! The Markov property means the current state captures all relevant information from the past. You don't need to look at history - just look at NOW to decide what to do next."
        hint="Think about the chess example - do you need to remember every move that was played, or just look at the current board?"
      />

      {/* Section 4: Policies and Value Functions */}
      <SubSection id="policy" title="Policies: Your Strategy" icon="📋" variant="concept">
        <VisualConcept title="What's Your Plan?" emoji="🗺️" color="green">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              A <span className="font-bold text-green-600">Policy (π)</span> is your game plan:
              <br />
              <span className="font-bold">"In each state, what action should I take?"</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  type: 'Deterministic Policy',
                  emoji: '🎯',
                  desc: 'Always do the same action in a state',
                  example: 'State A → Always go right',
                },
                {
                  type: 'Stochastic Policy',
                  emoji: '🎲',
                  desc: 'Choose actions probabilistically',
                  example: 'State A → 70% right, 30% left',
                },
              ].map((policy, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="p-6 rounded-xl bg-white border-2 border-green-200"
                >
                  <div className="text-4xl text-center mb-3">{policy.emoji}</div>
                  <h5 className="font-bold text-center text-gray-900 mb-2">{policy.type}</h5>
                  <p className="text-gray-700 text-center mb-3">{policy.desc}</p>
                  <div className="text-sm text-center px-3 py-2 rounded-lg bg-green-50 border border-green-200 font-mono">
                    {policy.example}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300">
              <p className="text-center text-lg font-semibold text-gray-900">
                Goal of RL: Find the <span className="text-green-600">optimal policy π*</span> that maximizes total rewards!
              </p>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Question 4 */}
      <Question
        id="q4"
        question="What is a policy in reinforcement learning?"
        options={[
          'A list of all possible states',
          'A mapping from states to actions (your strategy)',
          'The reward function',
          'A sequence of actions to take',
        ]}
        correctIndex={1}
        difficulty="medium"
        explanation="Exactly! A policy is your strategy - it tells you what action to take in each state. It's the thing you're trying to learn in RL!"
        hint="Think of it as your playbook or strategy guide for the game."
      />

      {/* Section 5: The Math */}
      <SubSection id="math" title="The Mathematical Foundation" icon="📐" variant="concept">
        <FormulaReveal
          title="MDP Definition"
          description="An MDP is formally defined as a tuple of five elements that completely describe the decision problem."
          formula="\text{MDP} = (S, A, P, R, \gamma)"
          intuition="Think of it as a complete specification: what states exist (S), what actions you can take (A), how the world responds (P), what rewards you get (R), and how much you value the future (γ)."
          variables={[
            { symbol: 'S', meaning: 'Set of all possible states' },
            { symbol: 'A', meaning: 'Set of all possible actions' },
            { symbol: 'P', meaning: 'Transition probability: P(s\'|s,a)' },
            { symbol: 'R', meaning: 'Reward function: R(s,a,s\')' },
            { symbol: 'γ', meaning: 'Discount factor (0 ≤ γ ≤ 1)' },
          ]}
        />

        <FormulaReveal
          title="Return (Total Reward)"
          description="The return is the total discounted reward from a point in time onward."
          formula="G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \cdots = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}"
          intuition="Add up all future rewards, but give less weight to rewards that come later. It's like saying 'I prefer rewards now rather than later' - future rewards are discounted by γ."
          variables={[
            { symbol: 'Gₜ', meaning: 'Return (total discounted reward from time t)' },
            { symbol: 'Rₜ', meaning: 'Reward at time t' },
            { symbol: 'γ', meaning: 'Discount factor (how much to value future)' },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <h5 className="font-bold text-blue-900 mb-2">γ = 0 (Myopic)</h5>
            <p className="text-sm text-gray-700">Only care about immediate reward. No planning ahead.</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
            <h5 className="font-bold text-purple-900 mb-2">γ ≈ 1 (Farsighted)</h5>
            <p className="text-sm text-gray-700">Care about future rewards almost as much as immediate ones.</p>
          </div>
        </div>
      </SubSection>

      {/* Question 5 */}
      <Question
        id="q5"
        question="Why do we discount future rewards (use γ < 1)?"
        options={[
          'To make the math simpler',
          'Because future rewards are uncertain and we prefer rewards sooner',
          'Because future rewards don&apos;t matter',
          'To make learning faster',
        ]}
        correctIndex={1}
        difficulty="hard"
        explanation="Excellent! We discount future rewards because: (1) they're often more uncertain, (2) we generally prefer rewards sooner rather than later, and (3) it keeps the math from exploding to infinity in continuing tasks. It's like the time value of money in economics!"
        hint="Think about real life - would you rather have $100 now or $100 in 10 years?"
      />

      {/* Section 6: Practice */}
      <SubSection id="practice" title="Try It Yourself" icon="🎮" variant="practice">
        <VisualConcept title="See MDPs in Action" emoji="🚀" color="purple">
          <div className="space-y-4 text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              Every RL algorithm works within an MDP framework. Try them in the playground!
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
                  obstacles: [{ x: 2, y: 2 }],
                  rewards: [],
                }}
              >
                🗺️ Explore MDPs
              </PlaygroundButton>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl"
      >
        <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
          <Map className="w-8 h-8" />
          MDP Mastery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { emoji: '📍', text: 'States, actions, rewards, transitions' },
            { emoji: '🎯', text: 'Markov property = current state suffices' },
            { emoji: '📋', text: 'Policy = your strategy' },
            { emoji: '🎁', text: 'Goal = maximize discounted return' },
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
      </motion.div>
    </LessonLayout>
  )
}
