import { motion } from 'framer-motion'
import LessonLayout from './LessonLayout'
import SubSection from './SubSection'
import Question from './Question'
import FormulaReveal from './FormulaReveal'
import VisualConcept from './VisualConcept'
import PlaygroundButton from './PlaygroundButton'
import { Clock, Sparkles, Zap } from 'lucide-react'

export default function TDLambdaStory() {
  return (
    <LessonLayout
      title="Time Traveler&apos;s Advantage"
      subtitle="Master the art of crediting actions across time with eligibility traces"
      icon="⏰"
      difficulty="hard"
      duration="15 minutes"
      objectives={[
        'Understand the credit assignment problem',
        'Master eligibility traces concept',
        'Learn how lambda controls trace decay',
      ]}
      prerequisites={['Q-Learning', 'SARSA']}
    >
      {/* Section 1: The Story */}
      <SubSection id="story" title="The Credit Assignment Mystery" icon="🕵️" variant="story">
        <VisualConcept title="A Detective&apos;s Dilemma" emoji="🔍" color="purple">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              You&apos;re a detective. A crime happened <span className="font-bold text-purple-600">10 minutes ago</span>.
              <br />
              Who should get credit for solving it?
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-5 gap-3"
            >
              {[
                { time: '10m ago', emoji: '🚪', action: 'Entered building', credit: '????' },
                { time: '8m ago', emoji: '🔦', action: 'Found flashlight', credit: '????' },
                { time: '5m ago', emoji: '🗝️', action: 'Got key', credit: '????' },
                { time: '2m ago', emoji: '🚪', action: 'Opened door', credit: '????' },
                { time: 'Now!', emoji: '🏆', action: 'Found treasure!', credit: '+100' },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className={`p-3 rounded-xl border-2 ${
                    idx === 4
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="text-3xl text-center mb-1">{step.emoji}</div>
                  <div className="text-xs text-gray-600 text-center mb-1">{step.time}</div>
                  <div className="text-xs font-semibold text-center mb-1">{step.action}</div>
                  <div className="text-sm font-bold text-center text-purple-600">{step.credit}</div>
                </motion.div>
              ))}
            </motion.div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300">
              <p className="text-lg font-semibold text-center text-gray-900">
                <span className="text-purple-600">Every action</span> contributed to finding the treasure!<br />
                But how much credit does each deserve?
              </p>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Question 1 */}
      <Question
        id="q1"
        question="What is the credit assignment problem?"
        options={[
          'Deciding how much money to give agents',
          'Figuring out which past actions led to current rewards',
          'Assigning tasks to different agents',
          'Computing the total reward',
        ]}
        correctIndex={1}
        difficulty="easy"
        explanation="Perfect! The credit assignment problem is about determining which actions in the past deserve credit for rewards received now. It&apos;s especially tricky when there&apos;s a delay between actions and their consequences."
        hint="Think about cause and effect - which past decisions led to the current outcome?"
      />

      {/* Section 2: The Problem with TD(0) */}
      <SubSection id="td0-problem" title="The One-Step Limitation" icon="🚶" variant="concept">
        <VisualConcept title="TD(0) is Myopic" emoji="👓" color="blue">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              Regular Q-Learning and SARSA use <span className="font-bold text-blue-600">TD(0)</span>:
              <br />
              They only look <span className="font-bold">one step back</span>.
            </p>

            <div className="p-6 rounded-xl bg-white border-2 border-blue-300">
              <h5 className="font-bold text-center text-xl text-gray-900 mb-4">TD(0) Update</h5>
              <div className="flex items-center justify-center gap-4 flex-wrap text-gray-700">
                <div className="text-center">
                  <div className="text-4xl mb-1">📍</div>
                  <div className="text-sm">Previous State</div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="text-4xl mb-1">🎬</div>
                  <div className="text-sm font-bold text-blue-600">THIS action</div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="text-4xl mb-1">🎁</div>
                  <div className="text-sm">Reward</div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Only the immediately previous action gets updated!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <h5 className="font-bold text-red-900 mb-2">❌ Problem:</h5>
                <p className="text-sm text-gray-700">
                  Actions taken earlier don&apos;t get immediate credit. Learning propagates slowly, one step at a time.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <h5 className="font-bold text-green-900 mb-2">✅ TD(λ) Solution:</h5>
                <p className="text-sm text-gray-700">
                  Give credit to MULTIPLE previous actions all at once, using eligibility traces!
                </p>
              </div>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Question 2 */}
      <Question
        id="q2"
        question="What&apos;s the main limitation of TD(0) methods like standard Q-Learning?"
        options={[
          'They&apos;re too slow to compute',
          'They only update one previous step at a time, making learning slow',
          'They can&apos;t handle large state spaces',
          'They require too much memory',
        ]}
        correctIndex={1}
        difficulty="medium"
        explanation="Exactly! TD(0) only looks one step back, so credit propagates slowly through a sequence of actions. If you take 10 actions before getting a reward, it takes many episodes for the credit to propagate back to the first action."
        hint="Think about a long sequence of actions leading to a reward - how fast does each action learn it was good?"
      />

      {/* Section 3: Eligibility Traces */}
      <SubSection id="traces" title="Eligibility Traces: The Time Machine" icon="⏰" variant="concept">
        <VisualConcept title="Remember the Recent Past" emoji="🧠" color="green">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              <span className="font-bold text-green-600">Eligibility traces</span> are like a memory:
              <br />
              &quot;Which state-action pairs are <span className="font-bold">eligible</span> for credit?&quot;
            </p>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
              <h5 className="font-bold text-xl text-center text-gray-900 mb-4">How Traces Work</h5>
              <div className="space-y-3">
                {[
                  { emoji: '👆', text: 'Visit a state-action pair → trace increases to 1.0' },
                  { emoji: '⏰', text: 'Each time step → all traces decay by (γλ)' },
                  { emoji: '🎁', text: 'Get reward → update ALL states with non-zero traces!' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white border border-green-200"
                  >
                    <div className="text-2xl">{item.emoji}</div>
                    <div className="text-sm text-gray-700">{item.text}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border-2 border-purple-300">
              <h5 className="font-bold text-center text-xl mb-4">Trace Values Over Time</h5>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { step: 'Visit', value: 1.0, color: 'green' },
                  { step: '+1 step', value: 0.8, color: 'green' },
                  { step: '+2 steps', value: 0.64, color: 'yellow' },
                  { step: '+3 steps', value: 0.51, color: 'orange' },
                  { step: '+4 steps', value: 0.41, color: 'red' },
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`h-24 rounded-lg bg-gradient-to-t ${
                      item.color === 'green' ? 'from-green-200 to-green-500' :
                      item.color === 'yellow' ? 'from-yellow-200 to-yellow-500' :
                      item.color === 'orange' ? 'from-orange-200 to-orange-500' :
                      'from-red-200 to-red-500'
                    } flex items-end justify-center pb-2`} style={{ height: `${item.value * 100}px` }}>
                      <span className="font-bold text-white text-lg">{item.value}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">{item.step}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-center text-gray-600 mt-4">
                Example with λ=0.8, γ=1.0
              </p>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Question 3 */}
      <Question
        id="q3"
        question="What happens to an eligibility trace over time?"
        options={[
          'It stays constant',
          'It decays exponentially based on λ and γ',
          'It increases over time',
          'It randomly fluctuates',
        ]}
        correctIndex={1}
        difficulty="medium"
        explanation="Perfect! Eligibility traces decay exponentially over time by a factor of (γλ) at each step. This creates a 'fading memory' where recent actions have stronger traces (more credit) than older actions."
        hint="Think about memory - do you remember things from yesterday or last week better?"
      />

      {/* Section 4: The Lambda Parameter */}
      <SubSection id="lambda" title="The Magic of Lambda (λ)" icon="🎛️" variant="concept">
        <VisualConcept title="Controlling the Trace" emoji="📊" color="orange">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              Lambda (λ) controls how fast traces decay:
              <br />
              <span className="font-bold text-orange-600">λ = 0</span> to <span className="font-bold text-orange-600">λ = 1</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  value: 'λ = 0',
                  name: 'No Memory',
                  emoji: '👓',
                  desc: 'Traces disappear immediately',
                  effect: 'Same as TD(0) - only one step back',
                  color: 'blue',
                },
                {
                  value: 'λ = 0.5',
                  name: 'Balanced',
                  emoji: '⚖️',
                  desc: 'Traces decay moderately',
                  effect: 'Credit recent actions more, but remember a few steps back',
                  color: 'purple',
                },
                {
                  value: 'λ = 1',
                  name: 'Full Memory',
                  emoji: '🧠',
                  desc: 'Traces never decay (until reward)',
                  effect: 'All actions in episode get equal credit (Monte Carlo)',
                  color: 'green',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className={`p-6 rounded-xl border-2 bg-gradient-to-br ${
                    item.color === 'blue'
                      ? 'from-blue-50 to-cyan-50 border-blue-300'
                      : item.color === 'purple'
                      ? 'from-purple-50 to-pink-50 border-purple-300'
                      : 'from-green-50 to-emerald-50 border-green-300'
                  }`}
                >
                  <div className="text-5xl text-center mb-3">{item.emoji}</div>
                  <h5 className="font-bold text-center text-xl text-gray-900 mb-2">{item.value}</h5>
                  <div className="font-semibold text-center text-gray-700 mb-3">{item.name}</div>
                  <p className="text-sm text-gray-600 mb-3 text-center">{item.desc}</p>
                  <div className="p-3 rounded-lg bg-white/60 border border-gray-200">
                    <p className="text-xs text-gray-700">{item.effect}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-bold text-lg text-gray-900 mb-2">Key Insight</h5>
                  <p className="text-gray-700 leading-relaxed">
                    TD(λ) unifies TD learning and Monte Carlo! λ=0 is pure TD, λ=1 is Monte Carlo.
                    Values in between give you the best of both worlds!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Question 4 */}
      <Question
        id="q4"
        question="What does λ=1 mean in TD(λ)?"
        options={[
          'Forget everything immediately',
          'Keep all traces until end of episode (like Monte Carlo)',
          'Update very slowly',
          'Use random updates',
        ]}
        correctIndex={1}
        difficulty="medium"
        explanation="Excellent! When λ=1, traces don&apos;t decay until the episode ends. This means ALL actions in the episode get credited equally, which is exactly how Monte Carlo methods work. TD(λ) with λ=1 IS Monte Carlo!"
        hint="Think about maximum memory - what if traces never decayed during an episode?"
      />

      {/* Section 5: The Formula */}
      <SubSection id="formula" title="The Mathematics" icon="📐" variant="concept">
        <FormulaReveal
          title="TD(λ) Update Rule"
          description="TD(λ) maintains eligibility traces and updates multiple state-action pairs at once."
          formula="\begin{aligned} e_t(s,a) &\leftarrow \gamma \lambda e_{t-1}(s,a) + \mathbb{1}(s_t=s, a_t=a) \\ Q(s,a) &\leftarrow Q(s,a) + \alpha \delta_t e_t(s,a) \\ \delta_t &= r_t + \gamma Q(s_{t+1}, a_{t+1}) - Q(s_t, a_t) \end{aligned}"
          intuition="For each state-action: (1) decay its trace, (2) if we just visited it, boost trace to 1, (3) when we get TD error δ, update ALL states proportional to their traces!"
          variables={[
            { symbol: 'e(s,a)', meaning: 'Eligibility trace for state-action pair' },
            { symbol: 'λ', meaning: 'Trace decay parameter (0 to 1)' },
            { symbol: 'γ', meaning: 'Discount factor' },
            { symbol: 'δ', meaning: 'TD error (surprise)' },
            { symbol: 'α', meaning: 'Learning rate' },
          ]}
        />

        <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300">
          <h5 className="font-bold text-xl mb-3">Why This is Powerful</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white border border-purple-200">
              <div className="font-bold text-purple-900 mb-2">⚡ Faster Learning</div>
              <p className="text-sm text-gray-700">Credit propagates backwards in ONE update, not gradually over many episodes.</p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-purple-200">
              <div className="font-bold text-purple-900 mb-2">🎯 Better Credit</div>
              <p className="text-sm text-gray-700">Actions that led to the reward get immediate recognition, even if they happened many steps ago.</p>
            </div>
          </div>
        </div>
      </SubSection>

      {/* Question 5 */}
      <Question
        id="q5"
        question="How does TD(λ) achieve faster learning than TD(0)?"
        options={[
          'It uses a faster computer',
          'It updates multiple previous state-action pairs in a single step using traces',
          'It skips some states',
          'It uses larger learning rates',
        ]}
        correctIndex={1}
        difficulty="hard"
        explanation="Perfect! This is THE key advantage of TD(λ). Instead of waiting for credit to propagate one step per episode, TD(λ) updates ALL recent state-action pairs at once, proportional to their eligibility traces. This dramatically speeds up learning in problems with delayed rewards!"
        hint="Think about how many states get updated when a reward is received..."
      />

      {/* Section 6: Practice */}
      <SubSection id="practice" title="Experiment with Lambda" icon="🎮" variant="practice">
        <VisualConcept title="See Lambda in Action" emoji="🔬" color="purple">
          <div className="space-y-4 text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              Try different λ values and watch how learning speed changes!
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <PlaygroundButton
                algorithm="td_lambda"
                environment="gridworld"
                parameters={{
                  alpha: 0.1,
                  gamma: 0.9,
                  epsilon: 0.1,
                  lambda_: 0.0,
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
                λ=0 (No Memory)
              </PlaygroundButton>

              <PlaygroundButton
                algorithm="td_lambda"
                environment="gridworld"
                parameters={{
                  alpha: 0.1,
                  gamma: 0.9,
                  epsilon: 0.1,
                  lambda_: 0.7,
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
                λ=0.7 (Balanced)
              </PlaygroundButton>

              <PlaygroundButton
                algorithm="td_lambda"
                environment="gridworld"
                parameters={{
                  alpha: 0.1,
                  gamma: 0.9,
                  epsilon: 0.1,
                  lambda_: 1.0,
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
                λ=1 (Full Memory)
              </PlaygroundButton>
            </div>

            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-left">
              <p className="font-bold text-gray-900 mb-2">🔬 Experiments:</p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• Compare convergence speed for different λ</div>
                <div>• Try a long maze - higher λ should learn faster</div>
                <div>• Notice λ=0 is slowest, λ=0.7-0.9 often best</div>
                <div>• Watch the learning curve differences!</div>
              </div>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl"
      >
        <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
          <Clock className="w-8 h-8" />
          TD(λ) Mastery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { emoji: '🧠', text: 'Eligibility traces remember recent actions' },
            { emoji: '⚡', text: 'Updates multiple steps at once' },
            { emoji: '🎛️', text: 'λ controls memory length' },
            { emoji: '🚀', text: 'Faster learning than TD(0)' },
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
