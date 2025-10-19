import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Sparkles, DollarSign, TrendingUp, Lightbulb } from 'lucide-react'
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
  const [showFormula, setShowFormula] = useState(false)
  
  const handleSimulate = () => {
    setIsSimulating(true)
    setSimulationKey(prev => prev + 1)
  }
  
  const handleReset = () => {
    setIsSimulating(false)
    setSimulationKey(prev => prev + 1)
  }
  
  const handleNArmsChange = (value: number) => {
    setNArms(value)
    // Reset simulation when changing arms
    setIsSimulating(false)
    setSimulationKey(prev => prev + 1)
  }
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Visual Introduction with Slot Machines */}
      <section className="card bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="flex items-center justify-center mb-6">
          {/* Slot Machine Visual Representation */}
          <div className="flex gap-4 items-end">
            {[1, 2, 3, 4, 5].map((machine) => (
              <motion.div
                key={machine}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: machine * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="bg-gradient-to-b from-red-500 to-red-700 rounded-lg p-4 shadow-xl relative">
                  <div className="w-12 h-16 bg-gray-900 rounded flex items-center justify-center mb-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-red-800 rounded-b"></div>
                </div>
                <div className="mt-4 text-xs font-semibold text-gray-600">Machine {machine}</div>
                <div className="text-xs text-gray-500">???</div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
          🎰 The Multi-Armed Bandit Problem
        </h2>
        
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Imagine walking into a casino and seeing a row of slot machines. Each machine pays out 
          money at different rates, but you don't know which ones are good and which are bad. 
          You have <strong>100 coins</strong> to spend. What do you do?
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-blue-900">Exploitation</h4>
            </div>
            <p className="text-sm text-gray-700">
              Keep playing the machine that seems to pay best <em>(use what you know)</em>
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border-2 border-green-300">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <h4 className="font-bold text-green-900">Exploration</h4>
            </div>
            <p className="text-sm text-gray-700">
              Try other machines to see if they're better <em>(learn something new)</em>
            </p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-900">The Big Question:</p>
              <p className="text-yellow-800">
                Should you stick with what seems to work (exploit), or try something new to potentially find something better (explore)?
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Real-World Analogies */}
      <section className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-600" />
          Real-World Examples
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🍕 Choosing a Restaurant</h4>
            <p className="text-sm text-gray-700">
              Go to your favorite place every time (exploit), or try new restaurants to find hidden gems (explore)?
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">📺 Watching Videos</h4>
            <p className="text-sm text-gray-700">
              Watch your favorite YouTubers (exploit), or discover new creators (explore)?
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">📱 A/B Testing Ads</h4>
            <p className="text-sm text-gray-700">
              Show the best-performing ad (exploit), or test new designs (explore)?
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-2">🎮 Learning New Skills</h4>
            <p className="text-sm text-gray-700">
              Practice what you're good at (exploit), or learn new techniques (explore)?
            </p>
          </div>
        </div>
      </section>
      
      {/* Think About It First */}
      <section className="card bg-gradient-to-br from-amber-50 to-orange-50">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          🤔 Think About It: What Strategy Would Work?
        </h3>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-gray-900 mb-2">Scenario:</p>
            <p className="text-gray-700 mb-3">
              You have 5 slot machines and 1000 coins. You try each machine once and get these results:
            </p>
            <div className="flex gap-2 text-sm">
              <span className="bg-gray-100 px-3 py-1 rounded">Machine 1: $0.50</span>
              <span className="bg-gray-100 px-3 py-1 rounded">Machine 2: $0.20</span>
              <span className="bg-gray-100 px-3 py-1 rounded">Machine 3: $0.80</span>
              <span className="bg-gray-100 px-3 py-1 rounded">Machine 4: $0.30</span>
              <span className="bg-gray-100 px-3 py-1 rounded">Machine 5: $0.10</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="font-semibold text-red-600 mb-2">❌ Bad Strategy: Always Stick</p>
              <p className="text-sm text-gray-700">
                Just use Machine 3 forever. But what if it was just lucky? Machine 1 might actually be better!
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <p className="font-semibold text-red-600 mb-2">❌ Bad Strategy: Keep Testing</p>
              <p className="text-sm text-gray-700">
                Keep trying all machines equally. You're wasting coins on machines you know are bad!
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
            <p className="font-semibold text-green-900 mb-2">✅ Smart Strategy: Balance Both</p>
            <p className="text-gray-700">
              <strong>Mostly</strong> use the best machine you've found (exploit), but <strong>sometimes</strong> try 
              others to make sure you haven't missed anything (explore). This is called <strong>ε-greedy</strong>!
            </p>
          </div>
        </div>
      </section>
      
      {/* Interactive Parameters with Analogies */}
      <section className="card bg-white">
        <h3 className="text-xl font-bold mb-4">🎮 Try It Yourself: Control the Experiment</h3>
        
        <p className="text-gray-700 mb-6">
          Adjust these settings to see how the agent learns which machine is best:
        </p>
        
        <div className="space-y-6 mb-6">
          {/* Number of Machines */}
          <div className="bg-purple-50 rounded-lg p-4">
            <ParameterSlider
              label="🎰 Number of Slot Machines"
              value={nArms}
              onChange={handleNArmsChange}
              min={2}
              max={10}
              step={1}
              description={`${nArms} machines to choose from`}
            />
            <div className="mt-3 text-sm text-gray-700 bg-white rounded p-3 border-l-4 border-purple-400">
              <strong>Like:</strong> How many restaurants are in your neighborhood? More options = harder to find the best one!
            </div>
          </div>
          
          {/* Epsilon (Exploration Rate) */}
          <div className="bg-blue-50 rounded-lg p-4">
            <ParameterSlider
              label="🎲 Exploration Rate (ε - epsilon)"
              value={epsilon}
              onChange={setEpsilon}
              min={0}
              max={1}
              step={0.05}
              description={`${(epsilon * 100).toFixed(0)}% chance to explore randomly`}
            />
            <div className="mt-3 text-sm text-gray-700 bg-white rounded p-3 border-l-4 border-blue-400">
              <strong>Like:</strong> How often do you try a new restaurant instead of going to your favorite?
              <ul className="mt-2 space-y-1 ml-4">
                <li>• <strong>ε = 0</strong> (0%): Never explore - always stick with what seems best</li>
                <li>• <strong>ε = 0.1</strong> (10%): Mostly exploit, occasionally explore (balanced!)</li>
                <li>• <strong>ε = 1</strong> (100%): Always explore randomly - never use what you learned!</li>
              </ul>
            </div>
          </div>
          
          {/* Number of Attempts */}
          <div className="bg-green-50 rounded-lg p-4">
            <ParameterSlider
              label="🎯 Number of Attempts (Episodes)"
              value={nEpisodes}
              onChange={setNEpisodes}
              min={100}
              max={2000}
              step={100}
              description={`${nEpisodes} pulls to learn from`}
            />
            <div className="mt-3 text-sm text-gray-700 bg-white rounded p-3 border-l-4 border-green-400">
              <strong>Like:</strong> How many times can you go out to eat? More attempts = more chances to learn which restaurant is truly the best!
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
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
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-green-600" />
          💡 What Did We Learn?
        </h3>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">🎯 Watch the "Optimal Arm Selection Rate"</p>
            <p className="text-gray-700">
              As the agent learns, it should pick the best machine more often. If this number goes up to ~90%, 
              that means it found the best machine and mostly uses it (with 10% exploration if ε = 0.1)!
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">⚖️ The Trade-off</p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>• <strong>ε = 0</strong>: Fastest at exploiting, but might pick wrong machine forever</li>
              <li>• <strong>ε = 0.1</strong>: Good balance - mostly exploit, sometimes explore</li>
              <li>• <strong>ε = 0.5</strong>: Too much exploration - wastes half the pulls randomly</li>
              <li>• <strong>ε = 1</strong>: Pure random - learns nothing!</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">🧪 Experiments to Try</p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>• Try <strong>ε = 0</strong> multiple times - notice how results vary? Sometimes you get unlucky!</li>
              <li>• Use <strong>10 machines</strong> - harder to find the best one, needs more episodes</li>
              <li>• Compare <strong>ε = 0.05 vs ε = 0.2</strong> - which finds the best machine faster?</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Mathematical Framework - Revealed at the end */}
      <section className="card bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            📐 The Math Behind It (Optional)
          </h3>
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="btn btn-secondary text-sm"
          >
            {showFormula ? 'Hide' : 'Show'} Formula
          </button>
        </div>
        
        <p className="text-gray-700 mb-4">
          Want to know the exact formulas the computer uses? Click "Show Formula" to see the mathematical details!
        </p>
        
        {showFormula && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 bg-white rounded-lg p-6"
          >
            <div>
              <h4 className="font-semibold mb-3 text-lg">1️⃣ Value of an Action</h4>
              <p className="text-sm text-gray-600 mb-2">
                The "true value" of pulling a machine is the average reward it gives:
              </p>
              <BlockMath math="q_*(a) = \mathbb{E}[R_t | A_t = a]" />
              <p className="text-xs text-gray-500 mt-2">
                Translation: q*(a) = average reward when pulling arm a
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-lg">2️⃣ Estimated Value (What We Track)</h4>
              <p className="text-sm text-gray-600 mb-2">
                We don't know the true value, so we estimate it by averaging what we've seen:
              </p>
              <BlockMath math="Q_t(a) \approx q_*(a)" />
              <p className="text-xs text-gray-500 mt-2">
                Q(a) = our current best guess for the value of arm a
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-lg">3️⃣ ε-Greedy Strategy</h4>
              <p className="text-sm text-gray-600 mb-2">
                How we decide which machine to pull next:
              </p>
              <BlockMath math="A_t = \begin{cases} \arg\max_a Q_t(a) & \text{with probability } 1-\varepsilon \\ \text{random action} & \text{with probability } \varepsilon \end{cases}" />
              <p className="text-xs text-gray-500 mt-2">
                Translation: Most of the time (1-ε), pick the best one. Sometimes (ε), pick randomly.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-lg">4️⃣ Updating Our Estimate</h4>
              <p className="text-sm text-gray-600 mb-2">
                After each pull, update our estimate towards the new reward:
              </p>
              <BlockMath math="Q_{n+1}(a) = Q_n(a) + \frac{1}{n}[R_n - Q_n(a)]" />
              <p className="text-xs text-gray-500 mt-2">
                Translation: New estimate = old estimate + (small step) × (how much we were wrong)
              </p>
              <div className="bg-blue-50 rounded p-3 mt-3 text-sm">
                <p className="font-semibold text-blue-900">Why 1/n?</p>
                <p className="text-blue-800">
                  As we try a machine more times (n gets bigger), we trust new results less because we already 
                  have a good estimate. Like: if you've eaten at a restaurant 100 times, one bad meal doesn't 
                  change your opinion much!
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-300">
              <p className="font-semibold text-green-900 mb-2">✨ The Big Picture</p>
              <p className="text-gray-700">
                These formulas let a computer learn which slot machine is best by trying them out and gradually 
                improving its estimates - just like you'd learn which restaurant is best by trying different places!
              </p>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  )
}

