import { useState } from 'react'
import { motion } from 'framer-motion'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

export default function SARSALesson() {
  const [alpha, setAlpha] = useState(0.1)
  const [gamma, setGamma] = useState(0.95)
  const [epsilon, setEpsilon] = useState(0.1)
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Introduction */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-4">SARSA: On-Policy Temporal Difference Learning</h2>
        <p className="text-gray-700 mb-4">
          SARSA (State-Action-Reward-State-Action) is an on-policy TD learning algorithm that learns
          from the actions it actually takes, making it more conservative than Q-Learning.
        </p>
        
        <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
          <p className="font-semibold text-green-900">Key Difference from Q-Learning:</p>
          <p className="text-green-800">
            SARSA uses the <strong>actual next action</strong> taken by the policy, while Q-Learning 
            uses the <strong>maximum Q-value</strong>. This makes SARSA learn a safer, more conservative policy.
          </p>
        </div>
      </section>
      
      {/* Algorithm Comparison */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">SARSA vs Q-Learning</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-900">Q-Learning (Off-policy)</h4>
            <BlockMath math="Q(s,a) \leftarrow Q(s,a) + \alpha [r + \gamma \max_{a'} Q(s',a') - Q(s,a)]" />
            <p className="text-sm mt-2 text-blue-800">
              Uses the <strong>best possible</strong> next action (greedy)
            </p>
          </div>
          
          <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-green-900">SARSA (On-policy)</h4>
            <BlockMath math="Q(s,a) \leftarrow Q(s,a) + \alpha [r + \gamma Q(s',a') - Q(s,a)]" />
            <p className="text-sm mt-2 text-green-800">
              Uses the <strong>actual</strong> next action taken (ε-greedy)
            </p>
          </div>
        </div>
        
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="font-semibold text-yellow-900">Practical Implication:</p>
          <p className="text-yellow-800">
            In environments with "cliffs" or dangerous states, SARSA learns to stay away from danger
            because it learns from exploration mistakes. Q-Learning might learn a riskier path.
          </p>
        </div>
      </section>
      
      {/* Algorithm Pseudocode */}
      <section className="card bg-gray-50">
        <h3 className="text-xl font-bold mb-4">SARSA Algorithm</h3>
        
        <div className="bg-white p-6 rounded-lg font-mono text-sm space-y-2">
          <div className="text-blue-600">// Initialize Q(s,a) arbitrarily</div>
          <div className="mt-4"><strong>for</strong> episode = 1 to M <strong>do</strong></div>
          <div className="ml-4">Initialize state s</div>
          <div className="ml-4 text-green-600">Choose action a using ε-greedy from Q(s,·)</div>
          <div className="ml-4"><strong>while</strong> s is not terminal <strong>do</strong></div>
          <div className="ml-8">Take action a, observe reward r and next state s'</div>
          <div className="ml-8 text-green-600">Choose next action a' using ε-greedy from Q(s',·)</div>
          <div className="ml-8 text-purple-600">Q(s,a) ← Q(s,a) + α[r + γ Q(s',a') - Q(s,a)]</div>
          <div className="ml-8">s ← s', a ← a'</div>
          <div className="ml-4"><strong>end while</strong></div>
          <div><strong>end for</strong></div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p className="font-semibold">Note the key difference:</p>
          <p className="mt-2">
            • Q-Learning: <InlineMath math="\max_{a'} Q(s',a')" /> - chooses the best action theoretically<br/>
            • SARSA: <InlineMath math="Q(s',a')" /> - uses the action actually taken by the agent
          </p>
        </div>
      </section>
      
      {/* When to Use */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">When to Use SARSA vs Q-Learning</h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-green-900">Use SARSA when:</h4>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>You want the agent to learn a safe policy during training</li>
              <li>The environment has dangerous states with high penalties</li>
              <li>You want the policy to account for exploration uncertainty</li>
              <li>Online learning where safety matters</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-blue-900">Use Q-Learning when:</h4>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>You want the optimal policy regardless of exploration</li>
              <li>The environment penalties are not catastrophic</li>
              <li>You want faster convergence to the optimal policy</li>
              <li>Offline learning from fixed datasets</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Parameters */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">Key Parameters</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Learning Rate (α): {alpha.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-1">
              How quickly the agent updates its knowledge (0.1 is typical)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">
              Discount Factor (γ): {gamma.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-1">
              Importance of future rewards (0.95-0.99 is typical)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">
              Exploration Rate (ε): {epsilon.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-1">
              Probability of random exploration (0.1 is typical)
            </p>
          </div>
        </div>
      </section>
      
      {/* Interactive Demo */}
      <section className="card bg-primary-50">
        <h3 className="text-xl font-bold mb-4">Try It in Playground</h3>
        <p className="text-gray-700 mb-4">
          Compare SARSA and Q-Learning side-by-side in the Playground:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>Create a grid with a "cliff" (high-penalty path)</li>
          <li>Run SARSA - watch it learn a safer route</li>
          <li>Run Q-Learning - it may take the risky shortcut</li>
          <li>Compare their trajectories and total rewards</li>
        </ul>
        <a href="/playground" className="btn btn-primary">
          Go to Playground →
        </a>
      </section>
    </div>
  )
}




