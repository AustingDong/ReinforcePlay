import { useState } from 'react'
import { motion } from 'framer-motion'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

export default function REINFORCELesson() {
  const [learningRate, setLearningRate] = useState(0.001)
  const [gamma, setGamma] = useState(0.99)
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Introduction */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-4">REINFORCE: The Foundation of Policy Gradients (1992)</h2>
        <p className="text-gray-700 mb-4">
          REINFORCE, introduced by Ronald Williams in 1992, was the first practical policy gradient method.
          Unlike value-based methods (Q-Learning, SARSA), it learns the policy <InlineMath math="\pi_\theta(a|s)" /> directly!
        </p>
        
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
          <p className="font-semibold text-purple-900">Paradigm Shift:</p>
          <p className="text-purple-800">
            Instead of learning Q-values and deriving a policy, REINFORCE directly optimizes the policy
            parameters <InlineMath math="\theta" /> to maximize expected return.
          </p>
        </div>
      </section>
      
      {/* Key Concept */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">Value-Based vs Policy-Based Methods</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-blue-900">Value-Based (Q-Learning, SARSA)</h4>
            <div className="space-y-2 text-sm">
              <p>1. Learn Q-values: <InlineMath math="Q(s,a)" /></p>
              <p>2. Derive policy: <InlineMath math="\pi(s) = \arg\max_a Q(s,a)" /></p>
              <p className="text-blue-700">✓ Works well for discrete actions</p>
              <p className="text-blue-700">✗ Hard for continuous actions</p>
            </div>
          </div>
          
          <div className="border border-purple-200 bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-purple-900">Policy-Based (REINFORCE)</h4>
            <div className="space-y-2 text-sm">
              <p>1. Parameterize policy: <InlineMath math="\pi_\theta(a|s)" /></p>
              <p>2. Optimize directly: <InlineMath math="\max_\theta \mathbb{E}[R]" /></p>
              <p className="text-purple-700">✓ Works for continuous actions</p>
              <p className="text-purple-700">✓ Can learn stochastic policies</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* The Algorithm */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">The REINFORCE Algorithm</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Policy Gradient Theorem:</h4>
            <BlockMath math="\nabla_\theta J(\theta) = \mathbb{E}_{\pi_\theta} \left[ \sum_{t=0}^T \nabla_\theta \log \pi_\theta(a_t|s_t) \cdot G_t \right]" />
            
            <div className="mt-4 space-y-2 text-sm">
              <p><InlineMath math="\theta" />: <strong>Policy parameters</strong> (neural network weights)</p>
              <p><InlineMath math="\pi_\theta(a|s)" />: <strong>Policy</strong> - probability of action a in state s</p>
              <p><InlineMath math="G_t" />: <strong>Return</strong> - discounted cumulative reward from time t</p>
              <p><InlineMath math="\nabla_\theta \log \pi_\theta" />: <strong>Policy gradient</strong> - direction to increase probability</p>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Intuition:</h4>
            <p className="text-sm text-gray-700">
              If an action leads to high return <InlineMath math="G_t" />, increase its probability.
              If it leads to low return, decrease its probability. The gradient tells us how to adjust <InlineMath math="\theta" />.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Return Calculation (Monte Carlo):</h4>
            <BlockMath math="G_t = \sum_{k=t}^T \gamma^{k-t} r_k = r_t + \gamma r_{t+1} + \gamma^2 r_{t+2} + \cdots" />
            <p className="text-sm text-gray-600 mt-2">
              REINFORCE waits until the episode ends to calculate full returns.
            </p>
          </div>
        </div>
      </section>
      
      {/* Pseudocode */}
      <section className="card bg-gray-50">
        <h3 className="text-xl font-bold mb-4">REINFORCE Pseudocode</h3>
        
        <div className="bg-white p-6 rounded-lg font-mono text-sm space-y-2">
          <div className="text-blue-600">// Initialize policy parameters θ randomly</div>
          <div className="mt-4"><strong>for</strong> episode = 1 to M <strong>do</strong></div>
          <div className="ml-4 text-green-600">// Generate episode using π<sub>θ</sub></div>
          <div className="ml-4">Initialize state s<sub>0</sub></div>
          <div className="ml-4">trajectory = []</div>
          <div className="ml-4"><strong>for</strong> t = 0 to T-1 <strong>do</strong></div>
          <div className="ml-8">Sample action a<sub>t</sub> ~ π<sub>θ</sub>(·|s<sub>t</sub>)</div>
          <div className="ml-8">Take action, observe reward r<sub>t</sub> and next state s<sub>t+1</sub></div>
          <div className="ml-8">Store (s<sub>t</sub>, a<sub>t</sub>, r<sub>t</sub>) in trajectory</div>
          <div className="ml-4"><strong>end for</strong></div>
          <div className="ml-4 mt-2 text-purple-600">// Compute returns</div>
          <div className="ml-4"><strong>for</strong> t = 0 to T-1 <strong>do</strong></div>
          <div className="ml-8">G<sub>t</sub> = Σ<sub>k=t</sub><sup>T-1</sup> γ<sup>k-t</sup> r<sub>k</sub></div>
          <div className="ml-4"><strong>end for</strong></div>
          <div className="ml-4 mt-2 text-orange-600">// Update policy parameters</div>
          <div className="ml-4"><strong>for</strong> t = 0 to T-1 <strong>do</strong></div>
          <div className="ml-8">θ ← θ + α ∇<sub>θ</sub> log π<sub>θ</sub>(a<sub>t</sub>|s<sub>t</sub>) G<sub>t</sub></div>
          <div className="ml-4"><strong>end for</strong></div>
          <div><strong>end for</strong></div>
        </div>
      </section>
      
      {/* Advantages and Limitations */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">Advantages & Limitations</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-900 mb-3">✓ Advantages</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Works for continuous actions</strong> - unlike Q-Learning</li>
              <li><strong>Learns stochastic policies</strong> - can represent uncertainty</li>
              <li><strong>Effective in high-dimensional spaces</strong></li>
              <li><strong>Convergence guarantees</strong> (with proper learning rate)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-red-900 mb-3">✗ Limitations</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>High variance</strong> - returns vary a lot between episodes</li>
              <li><strong>Sample inefficient</strong> - needs many episodes</li>
              <li><strong>Slow convergence</strong> - especially for long episodes</li>
              <li><strong>Sensitive to learning rate</strong></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="font-semibold text-blue-900">This Led To:</p>
          <p className="text-blue-800">
            The high variance problem motivated the development of Actor-Critic methods (like A2C)
            which use a value function to reduce variance, leading to more stable learning.
          </p>
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
              Step size for parameter updates (0.001 is typical for policy gradients)
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
              Importance of future rewards (0.99 is typical for policy gradients)
            </p>
          </div>
        </div>
      </section>
      
      {/* Historical Context */}
      <section className="card bg-amber-50">
        <h3 className="text-xl font-bold mb-4">📚 Historical Significance</h3>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>1992:</strong> Ronald Williams published "Simple Statistical Gradient-Following 
            Algorithms for Connectionist Reinforcement Learning"
          </p>
          <p>
            <strong>Impact:</strong> Established the foundation for modern deep RL. Led to:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Actor-Critic methods (A2C, A3C) in 2016</li>
            <li>Trust Region Policy Optimization (TRPO) in 2015</li>
            <li>Proximal Policy Optimization (PPO) in 2017</li>
            <li>AlphaGo and modern game-playing AIs</li>
          </ul>
        </div>
      </section>
      
      {/* Try It */}
      <section className="card bg-primary-50">
        <h3 className="text-xl font-bold mb-4">Try REINFORCE in Playground</h3>
        <p className="text-gray-700 mb-4">
          Experience the first policy gradient method:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>Create a gridworld environment</li>
          <li>Watch REINFORCE learn a stochastic policy</li>
          <li>Compare with Q-Learning to see the difference</li>
          <li>Notice the higher variance in episode rewards</li>
        </ul>
        <a href="/playground" className="btn btn-primary">
          Go to Playground →
        </a>
      </section>
    </div>
  )
}




