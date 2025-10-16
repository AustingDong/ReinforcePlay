import { motion } from 'framer-motion'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

export default function MDPLesson() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Introduction */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-4">Markov Decision Process (MDP)</h2>
        <p className="text-gray-700 mb-4">
          An MDP provides a mathematical framework for modeling decision-making in situations 
          where outcomes are partly random and partly under the control of a decision-maker (agent).
        </p>
        
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
          <p className="font-semibold text-purple-900">Core Idea:</p>
          <p className="text-purple-800">
            The future depends only on the current state and action, not on how we arrived at this state 
            (Markov Property).
          </p>
        </div>
      </section>
      
      {/* Components of an MDP */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">Components of an MDP</h3>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-lg mb-2">1. State Space <InlineMath math="\mathcal{S}" /></h4>
            <p className="text-gray-700">
              The set of all possible states the agent can be in. For example, positions on a grid.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-lg mb-2">2. Action Space <InlineMath math="\mathcal{A}" /></h4>
            <p className="text-gray-700">
              The set of all possible actions. For example: up, down, left, right.
            </p>
          </div>
          
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold text-lg mb-2">3. Transition Function <InlineMath math="P(s'|s,a)" /></h4>
            <p className="text-gray-700 mb-2">
              The probability of transitioning to state <InlineMath math="s'" /> from state <InlineMath math="s" /> after taking action <InlineMath math="a" />.
            </p>
            <BlockMath math="P(s'|s,a) = Pr\{S_{t+1} = s' | S_t = s, A_t = a\}" />
          </div>
          
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-lg mb-2">4. Reward Function <InlineMath math="R(s,a,s')" /></h4>
            <p className="text-gray-700 mb-2">
              The immediate reward received after transitioning from <InlineMath math="s" /> to <InlineMath math="s'" /> via action <InlineMath math="a" />.
            </p>
            <BlockMath math="R(s,a,s') = \mathbb{E}[R_{t+1} | S_t = s, A_t = a, S_{t+1} = s']" />
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-lg mb-2">5. Discount Factor <InlineMath math="\gamma" /></h4>
            <p className="text-gray-700 mb-2">
              A value between 0 and 1 that determines the importance of future rewards.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><InlineMath math="\gamma = 0" />: Only immediate rewards matter</li>
              <li><InlineMath math="\gamma = 1" />: All future rewards are equally important</li>
              <li><InlineMath math="\gamma \approx 0.9-0.99" />: Common practical values</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Returns and Value Functions */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">Returns and Value Functions</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Return (Cumulative Discounted Reward):</h4>
            <BlockMath math="G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \cdots = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}" />
            <p className="text-sm text-gray-600 mt-2">
              The total discounted reward from time step <InlineMath math="t" /> onwards.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">State-Value Function <InlineMath math="V^\pi(s)" />:</h4>
            <BlockMath math="V^\pi(s) = \mathbb{E}_\pi[G_t | S_t = s]" />
            <p className="text-sm text-gray-600 mt-2">
              Expected return when starting in state <InlineMath math="s" /> and following policy <InlineMath math="\pi" />.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Action-Value Function <InlineMath math="Q^\pi(s,a)" />:</h4>
            <BlockMath math="Q^\pi(s,a) = \mathbb{E}_\pi[G_t | S_t = s, A_t = a]" />
            <p className="text-sm text-gray-600 mt-2">
              Expected return when starting in state <InlineMath math="s" />, taking action <InlineMath math="a" />, 
              then following policy <InlineMath math="\pi" />.
            </p>
          </div>
        </div>
      </section>
      
      {/* Bellman Equations */}
      <section className="card bg-gradient-to-br from-blue-50 to-purple-50">
        <h3 className="text-xl font-bold mb-4">🎯 The Bellman Equations</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Bellman Expectation Equation for <InlineMath math="V^\pi" />:</h4>
            <BlockMath math="V^\pi(s) = \sum_a \pi(a|s) \sum_{s'} P(s'|s,a)[R(s,a,s') + \gamma V^\pi(s')]" />
            <p className="text-sm text-gray-600 mt-2">
              The value of a state equals the expected immediate reward plus the discounted value of the next state.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Bellman Optimality Equation for <InlineMath math="V^*" />:</h4>
            <BlockMath math="V^*(s) = \max_a \sum_{s'} P(s'|s,a)[R(s,a,s') + \gamma V^*(s')]" />
            <p className="text-sm text-gray-600 mt-2">
              The optimal value of a state is obtained by taking the action that maximizes expected return.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Bellman Optimality Equation for <InlineMath math="Q^*" />:</h4>
            <BlockMath math="Q^*(s,a) = \sum_{s'} P(s'|s,a)[R(s,a,s') + \gamma \max_{a'} Q^*(s',a')]" />
            <p className="text-sm text-gray-600 mt-2">
              This is the foundation of Q-Learning, which we'll explore in the next chapter!
            </p>
          </div>
        </div>
      </section>
      
      {/* Visual Example */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">Example: GridWorld</h3>
        
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
            {[
              { label: 'Start', color: 'bg-blue-200', reward: '0' },
              { label: '', color: 'bg-white', reward: '0' },
              { label: '', color: 'bg-white', reward: '0' },
              { label: '', color: 'bg-white', reward: '0' },
              { label: '', color: 'bg-white', reward: '0' },
              { label: 'Wall', color: 'bg-gray-800', reward: '-' },
              { label: '', color: 'bg-white', reward: '0' },
              { label: '', color: 'bg-white', reward: '0' },
              { label: '', color: 'bg-white', reward: '0' },
              { label: '', color: 'bg-white', reward: '0' },
              { label: '', color: 'bg-white', reward: '0' },
              { label: 'Trap', color: 'bg-red-200', reward: '-10' },
              { label: '', color: 'bg-white', reward: '0' },
              { label: '', color: 'bg-white', reward: '0' },
              { label: '', color: 'bg-white', reward: '0' },
              { label: 'Goal', color: 'bg-green-200', reward: '+10' },
            ].map((cell, idx) => (
              <div
                key={idx}
                className={`${cell.color} h-20 rounded flex flex-col items-center justify-center text-xs font-semibold`}
              >
                <div>{cell.label}</div>
                {cell.reward && <div className="text-gray-600 mt-1">R: {cell.reward}</div>}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 space-y-2 text-sm text-gray-700">
          <p><strong>States:</strong> Each grid cell (16 total)</p>
          <p><strong>Actions:</strong> Up, Down, Left, Right</p>
          <p><strong>Rewards:</strong> Goal = +10, Trap = -10, Steps = 0 (or -1 for faster convergence)</p>
          <p><strong>Goal:</strong> Find the optimal path from Start to Goal</p>
        </div>
      </section>
      
      {/* Key Takeaways */}
      <section className="card bg-gradient-to-br from-green-50 to-blue-50">
        <h3 className="text-xl font-bold mb-3">💡 Key Takeaways</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>MDPs formalize sequential decision-making problems</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>The Markov property: future depends only on present, not past</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Value functions tell us how good a state or state-action pair is</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Bellman equations provide recursive relationships for computing values</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Next: Q-Learning will use these concepts to learn optimal policies!</span>
          </li>
        </ul>
      </section>
    </div>
  )
}

