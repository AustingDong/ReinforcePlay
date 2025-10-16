import { useState } from 'react'
import { motion } from 'framer-motion'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

export default function A2CLesson() {
  const [learningRate, setLearningRate] = useState(0.001)
  const [gamma, setGamma] = useState(0.99)
  const [entropyCoef, setEntropyCoef] = useState(0.01)
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Introduction */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-4">A2C: Advantage Actor-Critic (2016)</h2>
        <p className="text-gray-700 mb-4">
          A2C (Advantage Actor-Critic) combines the best of policy gradients and value-based methods.
          It's the synchronous version of A3C (Asynchronous Advantage Actor-Critic) from DeepMind.
        </p>
        
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 my-4">
          <p className="font-semibold text-indigo-900">The Breakthrough:</p>
          <p className="text-indigo-800">
            A2C solves REINFORCE's high variance problem by learning both a policy (Actor) and 
            a value function (Critic) simultaneously. The Critic reduces variance in policy gradients.
          </p>
        </div>
      </section>
      
      {/* Actor-Critic Architecture */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">The Actor-Critic Architecture</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-blue-900">🎭 Actor (Policy Network)</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Role:</strong> Decides what action to take</p>
              <p><strong>Output:</strong> <InlineMath math="\pi_\theta(a|s)" /> - action probabilities</p>
              <p><strong>Goal:</strong> Maximize expected return</p>
              <p className="text-blue-700 font-semibold">Updates: Policy gradient</p>
            </div>
          </div>
          
          <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-green-900">🎯 Critic (Value Network)</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Role:</strong> Evaluates how good the state is</p>
              <p><strong>Output:</strong> <InlineMath math="V_w(s)" /> - state value</p>
              <p><strong>Goal:</strong> Accurately predict returns</p>
              <p className="text-green-700 font-semibold">Updates: TD learning</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-purple-900">They Work Together:</h4>
          <p className="text-sm text-purple-800">
            The Critic tells the Actor whether its actions were better or worse than expected.
            The Actor uses this feedback to improve. This reduces variance compared to REINFORCE.
          </p>
        </div>
      </section>
      
      {/* The Key: Advantage Function */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">The Advantage Function</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Definition:</h4>
            <BlockMath math="A(s,a) = Q(s,a) - V(s)" />
            <p className="text-sm text-gray-700 mt-2">
              "How much better is action <InlineMath math="a" /> compared to the average action in state <InlineMath math="s" />?"
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Practical Estimate (TD Error):</h4>
            <BlockMath math="A(s,a) \approx r + \gamma V(s') - V(s)" />
            <p className="text-sm text-gray-700 mt-2">
              We don't need to learn <InlineMath math="Q(s,a)" /> separately. We can estimate the advantage
              using the TD error from the Critic!
            </p>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="font-semibold text-yellow-900">Why Advantage?</p>
            <p className="text-yellow-800 text-sm mt-2">
              • <strong>REINFORCE:</strong> Uses full return <InlineMath math="G_t" /> - high variance<br/>
              • <strong>A2C:</strong> Uses advantage <InlineMath math="A(s,a)" /> - subtracts baseline (value), reducing variance!
            </p>
          </div>
        </div>
      </section>
      
      {/* Algorithm */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">A2C Update Rules</h3>
        
        <div className="space-y-6">
          <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Actor Update (Policy Gradient):</h4>
            <BlockMath math="\theta \leftarrow \theta + \alpha_\pi \nabla_\theta \log \pi_\theta(a|s) \cdot A(s,a)" />
            <p className="text-sm text-blue-800 mt-2">
              Increase probability of actions with positive advantage, decrease for negative advantage
            </p>
          </div>
          
          <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Critic Update (TD Learning):</h4>
            <BlockMath math="w \leftarrow w + \alpha_v \nabla_w \left[ (r + \gamma V_w(s') - V_w(s))^2 \right]" />
            <p className="text-sm text-green-800 mt-2">
              Minimize prediction error (TD error squared)
            </p>
          </div>
          
          <div className="border border-purple-200 bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Entropy Bonus (Exploration):</h4>
            <BlockMath math="H(\pi_\theta(·|s)) = -\sum_a \pi_\theta(a|s) \log \pi_\theta(a|s)" />
            <p className="text-sm text-purple-800 mt-2">
              Add entropy to the objective to encourage exploration and prevent premature convergence
            </p>
          </div>
        </div>
      </section>
      
      {/* Pseudocode */}
      <section className="card bg-gray-50">
        <h3 className="text-xl font-bold mb-4">A2C Pseudocode</h3>
        
        <div className="bg-white p-6 rounded-lg font-mono text-sm space-y-2">
          <div className="text-blue-600">// Initialize Actor π<sub>θ</sub> and Critic V<sub>w</sub></div>
          <div className="mt-4"><strong>for</strong> episode = 1 to M <strong>do</strong></div>
          <div className="ml-4">Initialize state s</div>
          <div className="ml-4"><strong>while</strong> s is not terminal <strong>do</strong></div>
          <div className="ml-8">// Actor: Select action</div>
          <div className="ml-8">a ~ π<sub>θ</sub>(·|s)</div>
          <div className="ml-8">Take action, observe r and s'</div>
          <div className="ml-8 mt-2">// Critic: Compute TD error (advantage)</div>
          <div className="ml-8 text-green-600">A = r + γ V<sub>w</sub>(s') - V<sub>w</sub>(s)</div>
          <div className="ml-8 mt-2">// Update Critic</div>
          <div className="ml-8 text-blue-600">w ← w + α<sub>v</sub> A ∇<sub>w</sub> V<sub>w</sub>(s)</div>
          <div className="ml-8 mt-2">// Update Actor</div>
          <div className="ml-8 text-purple-600">θ ← θ + α<sub>π</sub> A ∇<sub>θ</sub> log π<sub>θ</sub>(a|s)</div>
          <div className="ml-8 text-purple-600">θ ← θ + β H(π<sub>θ</sub>(·|s))  // entropy bonus</div>
          <div className="ml-8 mt-2">s ← s'</div>
          <div className="ml-4"><strong>end while</strong></div>
          <div><strong>end for</strong></div>
        </div>
      </section>
      
      {/* Evolution Timeline */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">Evolution of Policy Gradient Methods</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 px-3 py-1 rounded font-semibold text-sm">1992</div>
            <div className="flex-1">
              <strong>REINFORCE</strong> - First policy gradient method
              <p className="text-sm text-gray-600">✗ High variance, slow learning</p>
            </div>
          </div>
          
          <div className="border-l-4 border-indigo-500 pl-4">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 text-white px-3 py-1 rounded font-semibold text-sm">2016</div>
              <div className="flex-1">
                <strong>A2C/A3C</strong> - Actor-Critic reduces variance
                <p className="text-sm text-gray-600">✓ Much more stable, faster convergence</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 px-3 py-1 rounded font-semibold text-sm">2017</div>
            <div className="flex-1">
              <strong>PPO</strong> - Improved sample efficiency
              <p className="text-sm text-gray-600">✓ State-of-the-art, widely used today</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* A2C vs REINFORCE */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">A2C vs REINFORCE</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Aspect</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">REINFORCE</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">A2C</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-semibold">Networks</td>
                <td className="px-4 py-3">Policy only</td>
                <td className="px-4 py-3">Policy + Value</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-semibold">Variance</td>
                <td className="px-4 py-3 text-red-600">High ✗</td>
                <td className="px-4 py-3 text-green-600">Lower ✓</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Update Frequency</td>
                <td className="px-4 py-3">After full episode</td>
                <td className="px-4 py-3">Every step (online)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-semibold">Convergence Speed</td>
                <td className="px-4 py-3">Slow</td>
                <td className="px-4 py-3">Faster</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Complexity</td>
                <td className="px-4 py-3">Simple</td>
                <td className="px-4 py-3">More complex</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Parameters */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">Key Parameters</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Learning Rate (α): {learningRate.toFixed(4)}
            </label>
            <input
              type="range"
              min="0.0001"
              max="0.01"
              step="0.0001"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-1">
              Step size for both actor and critic updates
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">
              Discount Factor (γ): {gamma.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.9"
              max="0.999"
              step="0.001"
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-1">
              Importance of future rewards
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">
              Entropy Coefficient (β): {entropyCoef.toFixed(3)}
            </label>
            <input
              type="range"
              min="0"
              max="0.1"
              step="0.001"
              value={entropyCoef}
              onChange={(e) => setEntropyCoef(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-1">
              Exploration bonus - higher values encourage more exploration
            </p>
          </div>
        </div>
      </section>
      
      {/* Try It */}
      <section className="card bg-primary-50">
        <h3 className="text-xl font-bold mb-4">Experience A2C in Playground</h3>
        <p className="text-gray-700 mb-4">
          See the power of Actor-Critic learning:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>Create a complex gridworld environment</li>
          <li>Watch both Actor and Critic learn simultaneously</li>
          <li>Compare A2C with REINFORCE - notice the stability difference</li>
          <li>Experiment with entropy coefficient for exploration</li>
        </ul>
        <a href="/playground" className="btn btn-primary">
          Go to Playground →
        </a>
      </section>
    </div>
  )
}




