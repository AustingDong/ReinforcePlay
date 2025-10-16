import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Download, Upload, Settings, Grid3X3 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { startSimulation, streamSimulation } from '@/services/api'
import GridEditor from '@/components/playground/GridEditor'
import AlgorithmSelector from '@/components/playground/AlgorithmSelector'
import ParameterPanel from '@/components/playground/ParameterPanel'
import SimulationVisualization from '@/components/playground/SimulationVisualization'
import EnvironmentSelector from '@/components/playground/EnvironmentSelector'
import { ToastContainer } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'

export default function Playground() {
  const { toasts, removeToast, success, error, warning } = useToast()
  const {
    gridWidth,
    gridHeight,
    grid,
    setGridDimensions,
    clearGrid,
    simulationResults,
    setSimulationResults,
    addSimulationResult,
    clearSimulationResults,
    isSimulating,
    setIsSimulating,
    setCurrentSessionId,
  } = useAppStore()
  
  type AlgorithmType = 'bandit' | 'qlearning' | 'sarsa' | 'td_lambda' | 'reinforce' | 'a2c' | 'trpo' | 'ppo'
  
  const [selectedEnvironment, setSelectedEnvironment] = useState('classic-grid')
  const [showEnvironmentSelector, setShowEnvironmentSelector] = useState(false)
  
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('qlearning')
  const [parameters, setParameters] = useState<Record<string, any>>({
    // Q-Learning & SARSA defaults
    alpha: 0.1,
    gamma: 0.95,
    epsilon: 0.1,
    n_episodes: 200,
    // TD(λ) specific
    lambda_: 0.8,
    // Bandit defaults
    n_arms: 5,
    initial_q: 0.0,
    // Policy Gradient defaults (REINFORCE, A2C, TRPO, PPO)
    learning_rate: 0.001,
    clip_ratio: 0.2,
    max_kl: 0.01,
    entropy_coef: 0.01,
    value_coef: 0.5,
  })
  
  const [showSettings, setShowSettings] = useState(false)
  
  const handleRunSimulation = async () => {
    if (isSimulating) return
    
    clearSimulationResults()
    setIsSimulating(true)
    
    try {
      // Prepare configuration based on algorithm
      let config: Record<string, any> = {}
      
      if (selectedAlgorithm === 'bandit') {
        config = {
          n_arms: parameters.n_arms,
          n_episodes: parameters.n_episodes,
          epsilon: parameters.epsilon,
          initial_q: parameters.initial_q,
        }
      } else if (selectedAlgorithm === 'qlearning') {
        config = {
          grid_width: gridWidth,
          grid_height: gridHeight,
          n_episodes: parameters.n_episodes,
          alpha: parameters.alpha,
          gamma: parameters.gamma,
          epsilon: parameters.epsilon,
          grid: grid,
        }
      } else if (selectedAlgorithm === 'sarsa') {
        config = {
          grid_width: gridWidth,
          grid_height: gridHeight,
          n_episodes: parameters.n_episodes,
          alpha: parameters.alpha,
          gamma: parameters.gamma,
          epsilon: parameters.epsilon,
          grid: grid,
        }
      } else if (selectedAlgorithm === 'td_lambda') {
        config = {
          grid_width: gridWidth,
          grid_height: gridHeight,
          n_episodes: parameters.n_episodes,
          alpha: parameters.alpha,
          gamma: parameters.gamma,
          lambda_: parameters.lambda_,
          epsilon: parameters.epsilon,
          grid: grid,
        }
      } else if (selectedAlgorithm === 'reinforce') {
        config = {
          grid_width: gridWidth,
          grid_height: gridHeight,
          n_episodes: parameters.n_episodes,
          learning_rate: parameters.learning_rate,
          gamma: parameters.gamma,
          grid: grid,
        }
      } else if (selectedAlgorithm === 'a2c') {
        config = {
          grid_width: gridWidth,
          grid_height: gridHeight,
          n_episodes: parameters.n_episodes,
          learning_rate: parameters.learning_rate,
          gamma: parameters.gamma,
          entropy_coef: parameters.entropy_coef,
          value_coef: parameters.value_coef,
          grid: grid,
        }
      } else if (selectedAlgorithm === 'trpo') {
        config = {
          grid_width: gridWidth,
          grid_height: gridHeight,
          n_episodes: parameters.n_episodes,
          learning_rate: parameters.learning_rate,
          gamma: parameters.gamma,
          max_kl: parameters.max_kl,
          grid: grid,
        }
      } else if (selectedAlgorithm === 'ppo') {
        config = {
          grid_width: gridWidth,
          grid_height: gridHeight,
          n_episodes: parameters.n_episodes,
          learning_rate: parameters.learning_rate,
          gamma: parameters.gamma,
          clip_ratio: parameters.clip_ratio,
          grid: grid,
        }
      }
      
      // Start simulation
      const response = await startSimulation(selectedAlgorithm, config)
      setCurrentSessionId(response.session_id)
      success('Simulation Started', `Running ${selectedAlgorithm} with ${parameters.n_episodes} episodes`)
      
      // Stream results
      const cleanup = streamSimulation(
        response.session_id,
        (data) => {
          // Add result to store using the proper action
          addSimulationResult(data)
        },
        (err) => {
          console.error('Simulation error:', err)
          const errorMessage = err instanceof Error ? err.message : String(err)
          error('Simulation Error', errorMessage)
          setIsSimulating(false)
        },
        () => {
          success('Simulation Completed', 'All episodes finished successfully')
          setIsSimulating(false)
        }
      )
      
      // Store cleanup function
      return cleanup
      
    } catch (err: any) {
      console.error('Failed to start simulation:', err)
      
      // Extract meaningful error message
      let errorMessage = 'Failed to start simulation'
      let errorDescription = ''
      
      if (err.response?.data?.detail) {
        errorDescription = typeof err.response.data.detail === 'string' 
          ? err.response.data.detail 
          : JSON.stringify(err.response.data.detail)
      } else if (err.message) {
        errorDescription = err.message
      }
      
      error(errorMessage, errorDescription)
      setIsSimulating(false)
    }
  }
  
  const handleReset = () => {
    clearSimulationResults()
    setIsSimulating(false)
    setCurrentSessionId(null)
  }
  
  const handleExportConfig = () => {
    const config = {
      algorithm: selectedAlgorithm,
      parameters,
      grid: {
        width: gridWidth,
        height: gridHeight,
        cells: grid,
      },
    }
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rl-config-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string)
        setSelectedAlgorithm(config.algorithm)
        setParameters(config.parameters)
        setGridDimensions(config.grid.width, config.grid.height)
        // TODO: Set grid cells
      } catch (error) {
        console.error('Failed to import config:', error)
      }
    }
    reader.readAsText(file)
  }
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Playground</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-gray-600">
                Build custom environments and experiment with RL algorithms
              </p>
              <button
                onClick={() => setShowEnvironmentSelector(true)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold transition-colors"
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Environment: Classic GridWorld</span>
              </button>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="btn btn-secondary flex items-center gap-2"
              disabled={!isSimulating && simulationResults.length === 0}
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
            
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="btn btn-primary flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              {isSimulating ? 'Running...' : 'Run Simulation'}
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="btn btn-secondary"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content - Vertical Layout */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Panel - Compact Configuration */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-start gap-6">
            {/* Algorithm Selection - Compact Horizontal */}
            <div className="flex-shrink-0" style={{ width: '280px' }}>
              <h3 className="text-sm font-semibold mb-2 text-gray-700">Algorithm</h3>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value as any)}
                className="input w-full text-sm"
              >
                <optgroup label="Bandit">
                  <option value="bandit">Multi-Armed Bandit</option>
                </optgroup>
                <optgroup label="Value-Based">
                  <option value="qlearning">Q-Learning (Off-policy)</option>
                  <option value="sarsa">SARSA (On-policy)</option>
                  <option value="td_lambda">TD(λ) - Eligibility Traces</option>
                </optgroup>
                <optgroup label="Policy Gradient (Timeline)">
                  <option value="reinforce">REINFORCE (1992)</option>
                  <option value="trpo">TRPO (2015) - Trust Region</option>
                  <option value="a2c">A2C (2016)</option>
                  <option value="ppo">PPO (2017) - Improved TRPO</option>
                </optgroup>
              </select>
            </div>
            
            {/* Parameters - Compact Grid */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-2 text-gray-700">Parameters</h3>
              <div className="grid grid-cols-4 gap-3">
                {selectedAlgorithm === 'bandit' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-600">Arms</label>
                      <input
                        type="number"
                        min={2}
                        max={10}
                        value={parameters.n_arms}
                        onChange={(e) => setParameters({ ...parameters, n_arms: parseInt(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Epsilon (ε)</label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={parameters.epsilon}
                        onChange={(e) => setParameters({ ...parameters, epsilon: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Episodes</label>
                      <input
                        type="number"
                        min={100}
                        max={2000}
                        step={100}
                        value={parameters.n_episodes}
                        onChange={(e) => setParameters({ ...parameters, n_episodes: parseInt(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Initial Q</label>
                      <input
                        type="number"
                        min={-2}
                        max={2}
                        step={0.1}
                        value={parameters.initial_q}
                        onChange={(e) => setParameters({ ...parameters, initial_q: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                  </>
                )}
                
                {selectedAlgorithm === 'qlearning' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-600">Alpha (α)</label>
                      <input
                        type="number"
                        min={0.01}
                        max={1}
                        step={0.05}
                        value={parameters.alpha}
                        onChange={(e) => setParameters({ ...parameters, alpha: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Gamma (γ)</label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={parameters.gamma}
                        onChange={(e) => setParameters({ ...parameters, gamma: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Epsilon (ε)</label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={parameters.epsilon}
                        onChange={(e) => setParameters({ ...parameters, epsilon: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Episodes</label>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        step={50}
                        value={parameters.n_episodes}
                        onChange={(e) => setParameters({ ...parameters, n_episodes: parseInt(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                  </>
                )}
                
                {selectedAlgorithm === 'sarsa' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-600">Alpha (α)</label>
                      <input
                        type="number"
                        min={0.01}
                        max={1}
                        step={0.05}
                        value={parameters.alpha}
                        onChange={(e) => setParameters({ ...parameters, alpha: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Gamma (γ)</label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={parameters.gamma}
                        onChange={(e) => setParameters({ ...parameters, gamma: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Epsilon (ε)</label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={parameters.epsilon}
                        onChange={(e) => setParameters({ ...parameters, epsilon: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Episodes</label>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        step={50}
                        value={parameters.n_episodes}
                        onChange={(e) => setParameters({ ...parameters, n_episodes: parseInt(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                  </>
                )}

                {selectedAlgorithm === 'td_lambda' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-600">Alpha (α)</label>
                      <input
                        type="number"
                        min={0.01}
                        max={1}
                        step={0.05}
                        value={parameters.alpha}
                        onChange={(e) => setParameters({ ...parameters, alpha: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Gamma (γ)</label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={parameters.gamma}
                        onChange={(e) => setParameters({ ...parameters, gamma: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Lambda (λ)</label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                        value={parameters.lambda_}
                        onChange={(e) => setParameters({ ...parameters, lambda_: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">0=TD(0), 1=MC</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Epsilon (ε)</label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={parameters.epsilon}
                        onChange={(e) => setParameters({ ...parameters, epsilon: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Episodes</label>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        step={50}
                        value={parameters.n_episodes}
                        onChange={(e) => setParameters({ ...parameters, n_episodes: parseInt(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                  </>
                )}
                
                {selectedAlgorithm === 'reinforce' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-600">Learning Rate</label>
                      <input
                        type="number"
                        min={0.0001}
                        max={0.01}
                        step={0.0001}
                        value={parameters.learning_rate}
                        onChange={(e) => setParameters({ ...parameters, learning_rate: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Gamma (γ)</label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={parameters.gamma}
                        onChange={(e) => setParameters({ ...parameters, gamma: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Episodes</label>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        step={50}
                        value={parameters.n_episodes}
                        onChange={(e) => setParameters({ ...parameters, n_episodes: parseInt(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                  </>
                )}
                
                {selectedAlgorithm === 'a2c' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-600">Learning Rate</label>
                      <input
                        type="number"
                        min={0.0001}
                        max={0.01}
                        step={0.0001}
                        value={parameters.learning_rate}
                        onChange={(e) => setParameters({ ...parameters, learning_rate: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Gamma (γ)</label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={parameters.gamma}
                        onChange={(e) => setParameters({ ...parameters, gamma: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Entropy Coef</label>
                      <input
                        type="number"
                        min={0}
                        max={0.1}
                        step={0.01}
                        value={parameters.entropy_coef}
                        onChange={(e) => setParameters({ ...parameters, entropy_coef: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Value Coef</label>
                      <input
                        type="number"
                        min={0.1}
                        max={1}
                        step={0.1}
                        value={parameters.value_coef}
                        onChange={(e) => setParameters({ ...parameters, value_coef: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Episodes</label>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        step={50}
                        value={parameters.n_episodes}
                        onChange={(e) => setParameters({ ...parameters, n_episodes: parseInt(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                  </>
                )}
                
                {selectedAlgorithm === 'trpo' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-600">Learning Rate</label>
                      <input
                        type="number"
                        min={0.0001}
                        max={0.01}
                        step={0.0001}
                        value={parameters.learning_rate}
                        onChange={(e) => setParameters({ ...parameters, learning_rate: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Gamma (γ)</label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={parameters.gamma}
                        onChange={(e) => setParameters({ ...parameters, gamma: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Max KL</label>
                      <input
                        type="number"
                        min={0.001}
                        max={0.1}
                        step={0.001}
                        value={parameters.max_kl}
                        onChange={(e) => setParameters({ ...parameters, max_kl: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Episodes</label>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        step={50}
                        value={parameters.n_episodes}
                        onChange={(e) => setParameters({ ...parameters, n_episodes: parseInt(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                  </>
                )}
                
                {selectedAlgorithm === 'ppo' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-600">Learning Rate</label>
                      <input
                        type="number"
                        min={0.0001}
                        max={0.01}
                        step={0.0001}
                        value={parameters.learning_rate}
                        onChange={(e) => setParameters({ ...parameters, learning_rate: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Gamma (γ)</label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={parameters.gamma}
                        onChange={(e) => setParameters({ ...parameters, gamma: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Clip Ratio</label>
                      <input
                        type="number"
                        min={0.1}
                        max={0.5}
                        step={0.05}
                        value={parameters.clip_ratio}
                        onChange={(e) => setParameters({ ...parameters, clip_ratio: parseFloat(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Episodes</label>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        step={50}
                        value={parameters.n_episodes}
                        onChange={(e) => setParameters({ ...parameters, n_episodes: parseInt(e.target.value) })}
                        className="input w-full text-sm mt-1"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Grid Size - Compact (for grid-based) */}
            {(selectedAlgorithm === 'qlearning' || selectedAlgorithm === 'sarsa' || selectedAlgorithm === 'td_lambda' || selectedAlgorithm === 'reinforce' || selectedAlgorithm === 'a2c' || selectedAlgorithm === 'trpo' || selectedAlgorithm === 'ppo') && (
              <div className="flex-shrink-0" style={{ width: '200px' }}>
                <h3 className="text-sm font-semibold mb-2 text-gray-700">Grid Size</h3>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">W</label>
                    <input
                      type="number"
                      min={3}
                      max={15}
                      value={gridWidth}
                      onChange={(e) => setGridDimensions(parseInt(e.target.value), gridHeight)}
                      className="input w-full text-sm mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">H</label>
                    <input
                      type="number"
                      min={3}
                      max={15}
                      value={gridHeight}
                      onChange={(e) => setGridDimensions(gridWidth, parseInt(e.target.value))}
                      className="input w-full text-sm mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex-shrink-0 flex items-end gap-2">
              <button
                onClick={clearGrid}
                className="btn btn-secondary text-xs px-3 py-2"
                title="Clear Grid"
              >
                🔄 Clear
              </button>
              <button
                onClick={handleExportConfig}
                className="btn btn-secondary text-xs px-3 py-2"
                title="Export Config"
              >
                <Download className="w-3 h-3" />
              </button>
              <label className="btn btn-secondary text-xs px-3 py-2 cursor-pointer" title="Import Config">
                <Upload className="w-3 h-3" />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportConfig}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Environment Editor */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {(selectedAlgorithm !== 'bandit') ? (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center justify-center min-h-full">
                  <div className="mb-4 text-center">
                    <h3 className="text-xl font-semibold mb-2">Environment Editor</h3>
                    <p className="text-gray-600 text-sm">
                      Click cells to add obstacles, rewards, start and goal positions
                    </p>
                  </div>
                  
                  <GridEditor />
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="card">
                    <h3 className="text-xl font-semibold mb-3">Bandit Configuration</h3>
                    <p className="text-gray-600 mb-4">
                      The multi-armed bandit problem doesn't require a grid environment. 
                      Configure the number of arms and parameters above, then run the simulation.
                    </p>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                      <p className="text-sm text-blue-900">
                        <strong>Tip:</strong> Try different epsilon values to see the exploration-exploitation tradeoff in action!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right: Simulation Results */}
          <div className="w-[600px] bg-white border-l border-gray-200 overflow-y-auto">
            <SimulationVisualization
              algorithm={selectedAlgorithm}
              results={simulationResults}
              isRunning={isSimulating}
            />
          </div>
        </div>
      </div>
      
      {/* Environment Selector Modal */}
      <AnimatePresence>
        {showEnvironmentSelector && (
          <EnvironmentSelector
            selectedEnvironment={selectedEnvironment}
            onSelectEnvironment={setSelectedEnvironment}
            onClose={() => setShowEnvironmentSelector(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

