import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Info } from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

export default function TDLambdaLesson() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [lambda, setLambda] = useState(0.5)
  const [showExplanation, setShowExplanation] = useState(false)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-4">TD(λ) - Eligibility Traces</h1>
        <p className="text-xl text-gray-600">
          Bridge between TD(0) and Monte Carlo using eligibility traces
        </p>
      </div>

      {/* Introduction */}
      <section className="card">
        <h2 className="text-2xl font-semibold mb-4">What is TD(λ)?</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          TD(λ) is a family of Temporal Difference algorithms that use <strong>eligibility traces</strong> to 
          bridge between one-step TD learning (TD(0)) and Monte Carlo methods. The parameter <InlineMath math="\lambda" /> 
          (lambda) controls how much credit is assigned to past state-action pairs.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
          <p className="text-sm text-blue-900">
            <strong>Key Insight:</strong> TD(λ) solves the credit assignment problem by maintaining a "memory" 
            of recently visited states through eligibility traces, allowing more effective learning from delayed rewards.
          </p>
        </div>
      </section>

      {/* Lambda Parameter */}
      <section className="card">
        <h2 className="text-2xl font-semibold mb-4">Understanding Lambda (λ)</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Lambda Value: <span className="text-blue-600 font-bold">{lambda.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={lambda}
            onChange={(e) => setLambda(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>0 (TD(0))</span>
            <span>0.5 (Balance)</span>
            <span>1 (Monte Carlo)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg border-2 ${lambda === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <h3 className="font-semibold mb-2">λ = 0 (TD(0))</h3>
            <p className="text-sm text-gray-600">
              Only uses immediate next state for updates. Fast but high bias.
            </p>
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${lambda > 0 && lambda < 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <h3 className="font-semibold mb-2">0 &lt; λ &lt; 1</h3>
            <p className="text-sm text-gray-600">
              Balances between bias and variance. Exponentially decaying credit.
            </p>
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${lambda === 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <h3 className="font-semibold mb-2">λ = 1 (Monte Carlo)</h3>
            <p className="text-sm text-gray-600">
              Uses full episode return. Low bias but high variance.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Current Setting Interpretation:</h3>
          {lambda === 0 && (
            <p className="text-sm text-gray-700">
              <strong>Pure TD(0):</strong> Updates based only on the immediate next state. No eligibility traces used.
            </p>
          )}
          {lambda > 0 && lambda < 0.3 && (
            <p className="text-sm text-gray-700">
              <strong>Mostly TD(0):</strong> Emphasizes recent states with rapid trace decay. Good for quickly changing environments.
            </p>
          )}
          {lambda >= 0.3 && lambda < 0.7 && (
            <p className="text-sm text-gray-700">
              <strong>Balanced:</strong> Good trade-off between bias and variance. Moderate credit assignment to past states.
            </p>
          )}
          {lambda >= 0.7 && lambda < 1 && (
            <p className="text-sm text-gray-700">
              <strong>Mostly MC:</strong> Emphasizes full episode returns with slow trace decay. Better for sparse rewards.
            </p>
          )}
          {lambda === 1 && (
            <p className="text-sm text-gray-700">
              <strong>Pure Monte Carlo:</strong> Full episode return used. All states in an episode receive equal credit.
            </p>
          )}
        </div>
      </section>

      {/* Eligibility Traces */}
      <section className="card">
        <h2 className="text-2xl font-semibold mb-4">Eligibility Traces</h2>
        
        <p className="text-gray-700 mb-4">
          An <strong>eligibility trace</strong> <InlineMath math="e(s,a)" /> is a temporary record of the 
          occurrence of a state-action pair. It tracks "how recently" and "how frequently" a state-action pair 
          has been visited.
        </p>

        <div className="bg-white border border-gray-200 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Trace Update Rule:</h3>
          <BlockMath math="e_t(s,a) = \begin{cases} e_{t-1}(s,a) \cdot \gamma \lambda + 1 & \text{if } s_t = s, a_t = a \\ e_{t-1}(s,a) \cdot \gamma \lambda & \text{otherwise} \end{cases}" />
          <p className="text-sm text-gray-600 mt-2">
            When a state-action pair is visited, its trace is incremented by 1. All traces decay by <InlineMath math="\gamma \lambda" /> at each time step.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-green-900">Why Traces Help:</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ Faster learning from delayed rewards</li>
              <li>✓ Better credit assignment</li>
              <li>✓ More sample-efficient</li>
              <li>✓ Handles long episodes better</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-purple-900">Memory Mechanism:</h3>
            <p className="text-sm text-purple-800">
              Traces create a "gradient" of credit assignment, where recently visited states receive 
              more credit than distant ones, controlled by λ.
            </p>
          </div>
        </div>
      </section>

      {/* TD(λ) Update Rule */}
      <section className="card">
        <h2 className="text-2xl font-semibold mb-4">TD(λ) Update Rule</h2>
        
        <div className="bg-white border border-gray-200 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">Backward View TD(λ):</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">1. Calculate TD error:</p>
              <BlockMath math="\delta_t = r_t + \gamma V(s_{t+1}) - V(s_t)" />
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">2. Update all states using their eligibility:</p>
              <BlockMath math="V(s) \leftarrow V(s) + \alpha \cdot \delta_t \cdot e_t(s) \quad \forall s" />
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">3. Decay all traces:</p>
              <BlockMath math="e_t(s) \leftarrow \gamma \lambda \cdot e_{t-1}(s) \quad \forall s" />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-sm text-blue-900">
            <strong>Key Difference from TD(0):</strong> Instead of updating only the current state, TD(λ) 
            updates <em>all</em> states proportional to their eligibility trace. This allows rewards to 
            propagate backward through recently visited states in a single step!
          </p>
        </div>
      </section>

      {/* Comparison with Other Methods */}
      <section className="card">
        <h2 className="text-2xl font-semibold mb-4">Comparison with Other Methods</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Policy</th>
                <th className="p-3 text-left">Bootstrap</th>
                <th className="p-3 text-left">Credit Assignment</th>
                <th className="p-3 text-left">Speed</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-semibold">Q-Learning</td>
                <td className="p-3">Off-policy</td>
                <td className="p-3">Yes (1-step)</td>
                <td className="p-3">Slow</td>
                <td className="p-3 text-green-600">Fast</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">SARSA</td>
                <td className="p-3">On-policy</td>
                <td className="p-3">Yes (1-step)</td>
                <td className="p-3">Slow</td>
                <td className="p-3 text-green-600">Fast</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="p-3 font-semibold">TD(λ)</td>
                <td className="p-3">On-policy</td>
                <td className="p-3">Yes (n-step)</td>
                <td className="p-3 text-green-600">Excellent</td>
                <td className="p-3 text-yellow-600">Medium</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Monte Carlo</td>
                <td className="p-3">On-policy</td>
                <td className="p-3">No</td>
                <td className="p-3">Perfect</td>
                <td className="p-3 text-red-600">Slow</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* When to Use TD(λ) */}
      <section className="card">
        <h2 className="text-2xl font-semibold mb-4">When to Use TD(λ)?</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-green-900">Good For:</h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li>✓ <strong>Sparse rewards:</strong> Credit propagates backward quickly</li>
              <li>✓ <strong>Long episodes:</strong> Eligibility traces speed up learning</li>
              <li>✓ <strong>Sequential dependencies:</strong> Better captures state relationships</li>
              <li>✓ <strong>Limited data:</strong> More sample-efficient than TD(0)</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-900">Challenges:</h3>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li>⚠ Higher memory cost (stores traces for all states)</li>
              <li>⚠ More hyperparameters to tune (λ in addition to α, γ)</li>
              <li>⚠ Can be slower per step than TD(0)</li>
              <li>⚠ Requires careful λ selection for best performance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pseudocode */}
      <section className="card">
        <h2 className="text-2xl font-semibold mb-4">Algorithm Pseudocode</h2>
        
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{`Initialize Q(s,a) arbitrarily for all s,a
For each episode:
    Initialize all e(s,a) = 0
    Initialize s, choose a from s using policy derived from Q
    
    For each step of episode:
        Take action a, observe r, s'
        Choose a' from s' using policy derived from Q
        
        δ = r + γ·Q(s',a') - Q(s,a)
        e(s,a) = e(s,a) + 1  # Accumulating trace
        
        For all s,a:
            Q(s,a) = Q(s,a) + α·δ·e(s,a)
            e(s,a) = γ·λ·e(s,a)
        
        s = s', a = a'
        
        If s' is terminal: break`}</pre>
        </div>
      </section>

      {/* Practical Tips */}
      <section className="card">
        <h2 className="text-2xl font-semibold mb-4">Practical Tips</h2>
        
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-semibold text-sm mb-1">💡 Start with λ = 0.8</h3>
            <p className="text-sm text-gray-700">
              This value often works well across different problems and provides a good balance.
            </p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-semibold text-sm mb-1">💡 Use replacing traces for sparse problems</h3>
            <p className="text-sm text-gray-700">
              Instead of accumulating (e += 1), set e = 1 when visiting a state. Better for sparse features.
            </p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-semibold text-sm mb-1">💡 Lower λ for non-Markovian environments</h3>
            <p className="text-sm text-gray-700">
              If state doesn't fully capture information, lower λ reduces harmful credit assignment.
            </p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-semibold text-sm mb-1">💡 Higher λ for delayed rewards</h3>
            <p className="text-sm text-gray-700">
              When rewards are sparse and delayed, increase λ toward 1.0 for faster credit propagation.
            </p>
          </div>
        </div>
      </section>

      {/* Mathematical Insight */}
      <section className="card">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2">Mathematical Insight: λ-Return</h3>
            <p className="text-sm text-gray-700 mb-2">
              TD(λ) can be viewed as using a <strong>λ-return</strong>, which is a weighted average of 
              n-step returns:
            </p>
            <BlockMath math="G_t^\lambda = (1-\lambda) \sum_{n=1}^{\infty} \lambda^{n-1} G_t^{(n)}" />
            <p className="text-sm text-gray-700 mt-2">
              where <InlineMath math="G_t^{(n)}" /> is the n-step return. This shows how TD(λ) 
              combines predictions at different time scales!
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="card bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-2xl font-semibold mb-4">Key Takeaways</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>TD(λ) bridges between TD(0) and Monte Carlo using eligibility traces</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>λ controls trace decay: λ=0 is TD(0), λ=1 is Monte Carlo</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Eligibility traces enable faster credit assignment to past states</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>More sample-efficient than TD(0), especially with sparse rewards</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Trade-off: Better learning but higher memory and computational cost</span>
          </li>
        </ul>
      </section>
    </div>
  )
}



