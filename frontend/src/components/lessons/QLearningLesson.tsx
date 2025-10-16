import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import ParameterSlider from '@/components/ParameterSlider'

export default function QLearningLesson() {
  const [alpha, setAlpha] = useState(0.1)
  const [gamma, setGamma] = useState(0.95)
  const [epsilon, setEpsilon] = useState(0.1)
  const [nEpisodes, setNEpisodes] = useState(500)
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Introduction */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-4">Q-Learning: Temporal Difference Learning</h2>
        <p className="text-gray-700 mb-4">
          Q-Learning is a model-free reinforcement learning algorithm that learns the value of 
          state-action pairs (<InlineMath math="Q(s,a)" />) without needing to know the environment's 
          dynamics (<InlineMath math="P" /> and <InlineMath math="R" />).
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
          <p className="font-semibold text-blue-900">Key Innovation:</p>
          <p className="text-blue-800">
            Q-Learning combines ideas from dynamic programming and Monte Carlo methods, 
            learning from every step rather than waiting for episode completion.
          </p>
        </div>
      </section>
      
      {/* Algorithm */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">The Q-Learning Algorithm</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Q-Value Update Rule:</h4>
            <BlockMath math="Q(s,a) \leftarrow Q(s,a) + \alpha [r + \gamma \max_{a'} Q(s',a') - Q(s,a)]" />
            
            <div className="mt-4 space-y-2 text-sm">
              <p><InlineMath math="\alpha" /> (alpha): <strong>Learning rate</strong> - how much to update from new information (0 to 1)</p>
              <p><InlineMath math="\gamma" /> (gamma): <strong>Discount factor</strong> - importance of future rewards (0 to 1)</p>
              <p><InlineMath math="r" />: <strong>Immediate reward</strong> from transition</p>
              <p><InlineMath math="\max_{a'} Q(s',a')" />: <strong>Best future Q-value</strong> from next state</p>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">TD Error (Temporal Difference):</h4>
            <BlockMath math="\delta = r + \gamma \max_{a'} Q(s',a') - Q(s,a)" />
            <p className="text-sm text-gray-600 mt-2">
              The difference between the new estimate and the old estimate. This is what drives learning.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Action Selection (ε-greedy):</h4>
            <BlockMath math="a = \begin{cases} \arg\max_{a'} Q(s,a') & \text{with probability } 1-\varepsilon \\ \text{random} & \text{with probability } \varepsilon \end{cases}" />
          </div>
        </div>
      </section>
      
      {/* Algorithm Pseudocode */}
      <section className="card bg-gray-50">
        <h3 className="text-xl font-bold mb-4">Pseudocode</h3>
        
        <div className="bg-white p-6 rounded-lg font-mono text-sm space-y-2">
          <div className="text-blue-600">// Initialize Q(s,a) arbitrarily for all s,a</div>
          <div className="text-blue-600">// Initialize Q(terminal_state, ·) = 0</div>
          <div className="mt-4"><strong>for</strong> episode = 1 to M <strong>do</strong></div>
          <div className="ml-4">Initialize state s</div>
          <div className="ml-4"><strong>while</strong> s is not terminal <strong>do</strong></div>
          <div className="ml-8">Choose action a using ε-greedy policy from Q</div>
          <div className="ml-8">Take action a, observe reward r and next state s'</div>
          <div className="ml-8 text-green-600">Q(s,a) ← Q(s,a) + α[r + γ max<sub>a'</sub> Q(s',a') - Q(s,a)]</div>
          <div className="ml-8">s ← s'</div>
          <div className="ml-4"><strong>end while</strong></div>
          <div><strong>end for</strong></div>
        </div>
      </section>
      
      {/* Interactive Parameters */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">Interactive Q-Learning Simulation</h3>
        <p className="text-gray-600 mb-6">
          Adjust the hyperparameters below and run the simulation to see how Q-Learning finds the optimal path in a grid world.
        </p>
        
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <ParameterSlider
            label="Alpha (α)"
            value={alpha}
            onChange={setAlpha}
            min={0.01}
            max={1}
            step={0.05}
            description="Learning rate"
          />
          
          <ParameterSlider
            label="Gamma (γ)"
            value={gamma}
            onChange={setGamma}
            min={0}
            max={1}
            step={0.05}
            description="Discount factor"
          />
          
          <ParameterSlider
            label="Epsilon (ε)"
            value={epsilon}
            onChange={setEpsilon}
            min={0}
            max={1}
            step={0.05}
            description="Exploration rate"
          />
          
          <ParameterSlider
            label="Episodes"
            value={nEpisodes}
            onChange={setNEpisodes}
            min={50}
            max={1000}
            step={50}
            description="Training episodes"
          />
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="font-semibold text-yellow-900">TODO: Add Interactive GridWorld</p>
          <p className="text-yellow-800 text-sm mt-2">
            The full interactive visualization will show:
            <ul className="list-disc list-inside mt-2 ml-2">
              <li>Agent moving through grid world</li>
              <li>Q-value heatmap for each cell</li>
              <li>Learned policy (arrows showing best action per state)</li>
              <li>Reward curve over episodes</li>
              <li>Real-time Q-table updates</li>
            </ul>
            For now, see the Playground for full interactive environment editing.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="btn btn-primary flex items-center gap-2">
            <Play className="w-5 h-5" />
            Run Q-Learning
          </button>
          
          <button className="btn btn-secondary flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </section>
      
      {/* Key Properties */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">Why Q-Learning Works</h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold">1. Off-Policy Learning</h4>
            <p className="text-gray-700 text-sm">
              Q-Learning learns the optimal policy even while following an exploratory (ε-greedy) policy. 
              The <InlineMath math="\max" /> operator in the update targets the greedy action.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold">2. Model-Free</h4>
            <p className="text-gray-700 text-sm">
              No need to know <InlineMath math="P(s'|s,a)" /> or <InlineMath math="R(s,a,s')" />. 
              The algorithm learns directly from experience.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold">3. Convergence Guarantee</h4>
            <p className="text-gray-700 text-sm">
              Under certain conditions (all state-action pairs visited infinitely often, learning rate decay), 
              Q-Learning converges to <InlineMath math="Q^*" />.
            </p>
          </div>
        </div>
      </section>
      
      {/* Hyperparameter Guide */}
      <section className="card bg-gradient-to-br from-purple-50 to-blue-50">
        <h3 className="text-xl font-bold mb-4">🎛️ Hyperparameter Tuning Guide</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-purple-900">Learning Rate (α)</h4>
            <ul className="text-sm text-gray-700 space-y-1 mt-2">
              <li><strong>Too high (α → 1):</strong> Unstable learning, forgets old knowledge</li>
              <li><strong>Too low (α → 0):</strong> Learns very slowly</li>
              <li><strong>Good range:</strong> 0.1 - 0.3 for most problems</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-900">Discount Factor (γ)</h4>
            <ul className="text-sm text-gray-700 space-y-1 mt-2">
              <li><strong>Low (γ → 0):</strong> Short-sighted, only cares about immediate rewards</li>
              <li><strong>High (γ → 1):</strong> Far-sighted, plans for long-term rewards</li>
              <li><strong>Good range:</strong> 0.9 - 0.99 for most problems</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-green-900">Exploration Rate (ε)</h4>
            <ul className="text-sm text-gray-700 space-y-1 mt-2">
              <li><strong>High (ε → 1):</strong> Random actions, explores but doesn't exploit</li>
              <li><strong>Low (ε → 0):</strong> Greedy, might get stuck in local optima</li>
              <li><strong>Strategy:</strong> Start high (0.3-1.0), decay over time to 0.01-0.1</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Key Insights */}
      <section className="card bg-gradient-to-br from-green-50 to-blue-50">
        <h3 className="text-xl font-bold mb-3">💡 Key Insights</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Q-Learning is one of the most important RL algorithms and foundation for Deep Q-Networks (DQN)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>The algorithm bootstraps: uses estimates to update other estimates</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Works well for discrete state and action spaces</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>For continuous spaces, consider function approximation (neural networks) → DQN</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Try the Playground to build custom environments and see Q-Learning in action!</span>
          </li>
        </ul>
      </section>
    </div>
  )
}

