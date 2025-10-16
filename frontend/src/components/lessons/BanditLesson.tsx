import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import ParameterSlider from '@/components/ParameterSlider'
import BanditVisualization from '@/components/visualizations/BanditVisualization'

export default function BanditLesson() {
  const [nArms, setNArms] = useState(5)
  const [epsilon, setEpsilon] = useState(0.1)
  const [nEpisodes, setNEpisodes] = useState(1000)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationKey, setSimulationKey] = useState(0)
  
  const handleSimulate = () => {
    setIsSimulating(true)
    setSimulationKey(prev => prev + 1)
  }
  
  const handleReset = () => {
    setIsSimulating(false)
    setSimulationKey(prev => prev + 1)
  }
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Introduction */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-4">The Multi-Armed Bandit Problem</h2>
        <p className="text-gray-700 mb-4">
          Imagine you're in a casino facing <InlineMath math="k" /> slot machines (bandits), 
          each with an unknown probability of paying out. Your goal is to maximize your total 
          reward over time. This is the classic <strong>exploration vs. exploitation</strong> dilemma.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
          <p className="font-semibold text-blue-900">Key Question:</p>
          <p className="text-blue-800">
            Should you pull the arm that seems best (exploit), or try other arms to learn more (explore)?
          </p>
        </div>
      </section>
      
      {/* Mathematical Framework */}
      <section className="card">
        <h3 className="text-xl font-bold mb-3">Mathematical Framework</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Action-Value Function:</h4>
            <BlockMath math="q_*(a) = \mathbb{E}[R_t | A_t = a]" />
            <p className="text-sm text-gray-600 mt-2">
              The true value of action <InlineMath math="a" /> is the expected reward when taking that action.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Estimated Value:</h4>
            <BlockMath math="Q_t(a) \approx q_*(a)" />
            <p className="text-sm text-gray-600 mt-2">
              We estimate <InlineMath math="q_*(a)" /> by averaging observed rewards.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">ε-Greedy Policy:</h4>
            <BlockMath math="A_t = \begin{cases} \arg\max_a Q_t(a) & \text{with probability } 1-\varepsilon \\ \text{random action} & \text{with probability } \varepsilon \end{cases}" />
            <p className="text-sm text-gray-600 mt-2">
              With probability <InlineMath math="1-\varepsilon" />, choose the best known action (exploit). 
              Otherwise, choose randomly (explore).
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Value Update (Incremental Mean):</h4>
            <BlockMath math="Q_{n+1} = Q_n + \frac{1}{n}[R_n - Q_n]" />
            <p className="text-sm text-gray-600 mt-2">
              Update our estimate by moving towards the new reward with step size <InlineMath math="1/n" />.
            </p>
          </div>
        </div>
      </section>
      
      {/* Interactive Parameters */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4">Interactive Simulation</h3>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <ParameterSlider
            label="Number of Arms"
            value={nArms}
            onChange={setNArms}
            min={2}
            max={10}
            step={1}
            description="How many slot machines?"
          />
          
          <ParameterSlider
            label="Epsilon (ε)"
            value={epsilon}
            onChange={setEpsilon}
            min={0}
            max={1}
            step={0.05}
            description="Exploration rate (0 = greedy, 1 = random)"
          />
          
          <ParameterSlider
            label="Episodes"
            value={nEpisodes}
            onChange={setNEpisodes}
            min={100}
            max={2000}
            step={100}
            description="Number of pulls to simulate"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="btn btn-primary flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </button>
          
          <button
            onClick={handleReset}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </section>
      
      {/* Visualization */}
      <section className="card">
        <BanditVisualization
          key={simulationKey}
          nArms={nArms}
          epsilon={epsilon}
          nEpisodes={nEpisodes}
          isSimulating={isSimulating}
          onComplete={() => setIsSimulating(false)}
        />
      </section>
      
      {/* Key Insights */}
      <section className="card bg-gradient-to-br from-green-50 to-blue-50">
        <h3 className="text-xl font-bold mb-3">💡 Key Insights</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Lower ε means more exploitation (greedy), higher ε means more exploration</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>With ε = 0, the agent might never find the optimal arm if it gets unlucky early</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>The optimal arm selection rate should increase over time as we learn</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>TODO: Try different ε values and observe the tradeoff between exploration and exploitation</span>
          </li>
        </ul>
      </section>
    </div>
  )
}

