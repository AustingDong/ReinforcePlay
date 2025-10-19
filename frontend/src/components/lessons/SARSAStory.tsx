import { motion } from 'framer-motion'
import LessonLayout from './LessonLayout'
import SubSection from './SubSection'
import Question from './Question'
import FormulaReveal from './FormulaReveal'
import VisualConcept from './VisualConcept'
import PlaygroundButton from './PlaygroundButton'
import { Shield, Zap, Target } from 'lucide-react'

export default function SARSAStory() {
  return (
    <LessonLayout
      title="The Cautious Explorer"
      subtitle="Learning safely while exploring dangerous territories"
      icon="🛡️"
      difficulty="medium"
      duration="12 minutes"
      objectives={[
        'Understand on-policy vs off-policy learning',
        'Master the SARSA update rule',
        'Know when to use SARSA over Q-Learning',
      ]}
      prerequisites={['Q-Learning', 'MDP Basics']}
    >
      {/* Section 1: The Story */}
      <SubSection id="story" title="Two Explorers" icon="🥾" variant="story">
        <VisualConcept title="A Tale of Two Strategies" emoji="⚖️" color="blue">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 text-center leading-relaxed mb-6">
              Two robots explore a dangerous cliff path. One is <span className="font-bold text-blue-600">bold</span>, the other{' '}
              <span className="font-bold text-green-600">cautious</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300"
              >
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">🤖</div>
                  <h4 className="text-xl font-bold text-blue-900">Q-Bot (Bold)</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Explores randomly (epsilon-greedy)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>But LEARNS about optimal risky path</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>&quot;I&apos;ll explore randomly, but learn the fastest route!&quot;</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300"
              >
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">🤖</div>
                  <h4 className="text-xl font-bold text-green-900">SARSA-Bot (Cautious)</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Explores randomly (epsilon-greedy)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>LEARNS about the safe exploring path</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>&quot;I&apos;ll learn the path I actually take!&quot;</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300">
              <p className="text-lg font-semibold text-center text-gray-900">
                The difference? <span className="text-purple-600">SARSA respects its own exploration</span> while Q-Learning assumes optimal behavior.
              </p>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Question 1 */}
      <Question
        id="q1"
        question="What's the key difference between Q-Learning and SARSA?"
        options={[
          'SARSA is faster',
          'Q-Learning learns the optimal policy, SARSA learns the policy it&apos;s following',
          'SARSA doesn&apos;t use exploration',
          'Q-Learning requires more memory',
        ]}
        correctIndex={1}
        difficulty="easy"
        explanation="Perfect! Q-Learning (off-policy) learns about the optimal policy even while exploring. SARSA (on-policy) learns about the policy it&apos;s actually following, including its exploration."
        hint="Think about what each robot learns - does it learn about the best path, or the path it actually takes?"
      />

      {/* Section 2: On-Policy vs Off-Policy */}
      <SubSection id="policy-types" title="On-Policy vs Off-Policy" icon="🎯" variant="concept">
        <VisualConcept title="Two Learning Philosophies" emoji="🧭" color="purple">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300"
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">📘</div>
                  <h5 className="font-bold text-xl text-orange-900">Off-Policy (Q-Learning)</h5>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm">
                    Learns about one policy (optimal) while following another (exploratory)
                  </p>
                  <div className="p-3 rounded-lg bg-white border border-orange-200 text-sm">
                    <div className="font-bold text-gray-900 mb-1">Behavior Policy:</div>
                    <div className="text-gray-600 mb-2">ε-greedy (90% best, 10% random)</div>
                    <div className="font-bold text-gray-900 mb-1">Target Policy:</div>
                    <div className="text-gray-600">100% optimal (greedy)</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300"
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">📗</div>
                  <h5 className="font-bold text-xl text-green-900">On-Policy (SARSA)</h5>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm">
                    Learns about the SAME policy it&apos;s following
                  </p>
                  <div className="p-3 rounded-lg bg-white border border-green-200 text-sm">
                    <div className="font-bold text-gray-900 mb-1">Behavior Policy:</div>
                    <div className="text-gray-600 mb-2">ε-greedy (90% best, 10% random)</div>
                    <div className="font-bold text-gray-900 mb-1">Target Policy:</div>
                    <div className="text-gray-600">ε-greedy (same as behavior!)</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-bold text-lg text-gray-900 mb-2">Why This Matters</h5>
                  <p className="text-gray-700 leading-relaxed">
                    SARSA learns &quot;given that I explore randomly, what&apos;s the best I can do?&quot; This makes it more conservative near dangers,
                    since it accounts for the possibility of random exploration into hazards!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Question 2 */}
      <Question
        id="q2"
        question="Why is SARSA called 'on-policy'?"
        options={[
          'Because it&apos;s always on',
          'Because it learns about the same policy it&apos;s following',
          'Because it&apos;s more accurate',
          'Because it updates more frequently',
        ]}
        correctIndex={1}
        difficulty="easy"
        explanation="Exactly! SARSA is 'on-policy' because the policy it learns about (target policy) is the same as the policy it uses to choose actions (behavior policy). It&apos;s learning about itself!"
        hint="Think about the name - what does 'on' the policy mean?"
      />

      {/* Section 3: The SARSA Algorithm */}
      <SubSection id="algorithm" title="How SARSA Works" icon="⚙️" variant="concept">
        <VisualConcept title="The SARSA Learning Cycle" emoji="🔄" color="green">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              SARSA stands for: <span className="font-bold text-green-600">State-Action-Reward-State-Action</span>
            </p>

            <div className="relative">
              {[
                { num: '1', emoji: '📍', title: 'Current State', desc: 'Where am I? (S)', color: 'blue' },
                { num: '2', emoji: '🎬', title: 'Choose Action', desc: 'What do I do? (A)', color: 'purple' },
                { num: '3', emoji: '🎁', title: 'Get Reward', desc: 'How good was it? (R)', color: 'orange' },
                { num: '4', emoji: '📍', title: 'Next State', desc: 'Where did I land? (S&apos;)', color: 'green' },
                { num: '5', emoji: '🎬', title: 'Next Action', desc: 'What will I do next? (A&apos;)', color: 'pink' },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-gray-200 mb-3"
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-${step.color}-400 to-${step.color}-600 flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                    {step.num}
                  </div>
                  <div className="text-3xl">{step.emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{step.title}</div>
                    <div className="text-sm text-gray-600">{step.desc}</div>
                  </div>
                  {idx < 4 && <div className="text-2xl text-gray-400">→</div>}
                </motion.div>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300">
              <p className="text-center text-lg font-semibold text-gray-900">
                The key: We need to <span className="text-green-600">actually choose A&apos;</span> before updating!
              </p>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Question 3 */}
      <Question
        id="q3"
        question="What does SARSA stand for?"
        options={[
          'State-Action-Reward-State-Action',
          'Safe And Reliable Safety Algorithm',
          'Simple Adaptive Reinforcement System Algorithm',
          'Sequential Action Reward State Analysis',
        ]}
        correctIndex={0}
        difficulty="easy"
        explanation="Correct! SARSA is an acronym for the sequence of information it uses: State → Action → Reward → (next) State → (next) Action. This sequence is what distinguishes it from Q-Learning."
        hint="Think about what information the algorithm uses in its update..."
      />

      {/* Section 4: The Formula */}
      <SubSection id="formula" title="The Mathematics" icon="📐" variant="concept">
        <FormulaReveal
          title="SARSA Update Rule"
          description="SARSA updates Q-values based on the action that was actually chosen next."
          formula="Q(s, a) \leftarrow Q(s, a) + \alpha \left[ r + \gamma Q(s', a') - Q(s, a) \right]"
          intuition="Take your current belief, see what reward you got plus the value of your ACTUAL next action (not the best one), and adjust. You're learning about the path you actually take."
          variables={[
            { symbol: 's', meaning: 'Current state' },
            { symbol: 'a', meaning: 'Action taken' },
            { symbol: 'α', meaning: 'Learning rate' },
            { symbol: 'r', meaning: 'Reward received' },
            { symbol: 'γ', meaning: 'Discount factor' },
            { symbol: "s'", meaning: 'Next state' },
            { symbol: "a'", meaning: 'ACTUAL next action chosen' },
          ]}
        />

        <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300">
          <h5 className="font-bold text-xl mb-3 flex items-center gap-2">
            <Zap className="w-6 h-6 text-orange-600" />
            Key Difference from Q-Learning
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white border border-orange-200">
              <div className="font-bold text-blue-900 mb-2">Q-Learning:</div>
              <code className="text-sm text-gray-700">Q(s,a) + α[r + γ max Q(s&apos;,·) - Q(s,a)]</code>
              <p className="text-xs text-gray-600 mt-2">Uses MAX (best possible action)</p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-green-200">
              <div className="font-bold text-green-900 mb-2">SARSA:</div>
              <code className="text-sm text-gray-700">Q(s,a) + α[r + γ Q(s&apos;,a&apos;) - Q(s,a)]</code>
              <p className="text-xs text-gray-600 mt-2">Uses ACTUAL next action (a&apos;)</p>
            </div>
          </div>
        </div>
      </SubSection>

      {/* Question 4 */}
      <Question
        id="q4"
        question="What&apos;s the crucial difference between SARSA and Q-Learning updates?"
        options={[
          'SARSA updates faster',
          'SARSA uses the actual next action (a\'), Q-Learning uses max',
          'SARSA doesn&apos;t use rewards',
          'Q-Learning is deterministic',
        ]}
        correctIndex={1}
        difficulty="medium"
        explanation="Perfect! This is THE key insight. SARSA uses Q(s&apos;,a&apos;) where a&apos; is the action actually chosen (including possible random exploration). Q-Learning uses max Q(s&apos;,·), assuming optimal future actions."
        hint="Look at the formulas - what&apos;s different in the term that represents future value?"
      />

      {/* Section 5: When to Use SARSA */}
      <SubSection id="use-cases" title="When to Use SARSA?" icon="🤔" variant="concept">
        <VisualConcept title="Safety Matters" emoji="🛡️" color="orange">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-green-50 border-2 border-green-300"
              >
                <div className="text-5xl text-center mb-3">✅</div>
                <h5 className="font-bold text-center text-xl text-green-900 mb-3">Use SARSA When:</h5>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Environment has dangers/penalties</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Safety during exploration matters</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Real-world robotics (avoid damage)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Training cost is high</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-blue-50 border-2 border-blue-300"
              >
                <div className="text-5xl text-center mb-3">🎯</div>
                <h5 className="font-bold text-center text-xl text-blue-900 mb-3">Use Q-Learning When:</h5>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Want fastest convergence to optimal</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Simulated environments (no real risk)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Games with restarts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Mistakes are cheap</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300">
              <h5 className="font-bold text-lg text-gray-900 mb-2">Real World Example: Cliff Walking</h5>
              <p className="text-gray-700 leading-relaxed">
                Near a cliff edge, Q-Learning learns the optimal path right along the cliff (risky but fastest).
                SARSA learns a safer path further from the edge, accounting for the risk of random exploration into the cliff!
              </p>
            </div>
          </div>
        </VisualConcept>
      </SubSection>

      {/* Question 5 */}
      <Question
        id="q5"
        question="In the cliff-walking problem, why does SARSA stay further from the cliff?"
        options={[
          'Because it&apos;s slower',
          'Because it accounts for exploration risk - it might randomly walk off the cliff',
          'Because it can&apos;t see the cliff',
          'Because it&apos;s programmed to be conservative',
        ]}
        correctIndex={1}
        difficulty="hard"
        explanation="Outstanding! This is the KEY insight. SARSA learns about its exploratory policy, so it knows there&apos;s a chance of random actions near the cliff. It learns: 'If I walk near the cliff, I might randomly fall off during exploration.' Q-Learning ignores this because it assumes optimal (non-exploratory) behavior."
        hint="Remember, SARSA considers what could happen if it explores randomly near danger..."
      />

      {/* Section 6: Practice */}
      <SubSection id="practice" title="Try It in the Playground" icon="🎮" variant="practice">
        <VisualConcept title="See the Difference" emoji="🔬" color="purple">
          <div className="space-y-4 text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              Compare SARSA vs Q-Learning behavior in dangerous environments!
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <PlaygroundButton
                algorithm="sarsa"
                environment="gridworld"
                parameters={{
                  alpha: 0.1,
                  gamma: 0.9,
                  epsilon: 0.1,
                  n_episodes: 200,
                }}
                gridConfig={{
                  width: 6,
                  height: 4,
                  start: { x: 0, y: 3 },
                  goal: { x: 5, y: 3 },
                  obstacles: [],
                  rewards: [
                    { x: 1, y: 2, value: -10 },
                    { x: 2, y: 2, value: -10 },
                    { x: 3, y: 2, value: -10 },
                    { x: 4, y: 2, value: -10 },
                  ],
                }}
              >
                🛡️ SARSA (Safe Path)
              </PlaygroundButton>

              <PlaygroundButton
                algorithm="qlearning"
                environment="gridworld"
                parameters={{
                  alpha: 0.1,
                  gamma: 0.9,
                  epsilon: 0.1,
                  n_episodes: 200,
                }}
                gridConfig={{
                  width: 6,
                  height: 4,
                  start: { x: 0, y: 3 },
                  goal: { x: 5, y: 3 },
                  obstacles: [],
                  rewards: [
                    { x: 1, y: 2, value: -10 },
                    { x: 2, y: 2, value: -10 },
                    { x: 3, y: 2, value: -10 },
                    { x: 4, y: 2, value: -10 },
                  ],
                }}
              >
                ⚡ Q-Learning (Risky Path)
              </PlaygroundButton>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-left">
              <p className="font-bold text-gray-900 mb-2">🔬 Experiment:</p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• Run both algorithms on the same grid</div>
                <div>• Watch which path each learns</div>
                <div>• Try different epsilon values (0.1, 0.3)</div>
                <div>• Notice SARSA stays safer from penalties!</div>
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
        className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl"
      >
        <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
          <Shield className="w-8 h-8" />
          SARSA Mastery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { emoji: '📗', text: 'On-policy: learns about itself' },
            { emoji: '🛡️', text: 'Safer during exploration' },
            { emoji: '🔄', text: 'Uses S-A-R-S&apos;-A&apos; sequence' },
            { emoji: '⚖️', text: 'Choose based on safety needs' },
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
