import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Download, Upload, Settings, Grid3X3 } from 'lucide-react'
import clsx from 'clsx'
import { useAppStore } from '@/store/useAppStore'
import { startSimulation, streamSimulation } from '@/services/api'
import GridEditor from '@/components/playground/GridEditor'
import BanditEnvironment from '@/components/playground/BanditEnvironment'
import AlgorithmSelector from '@/components/playground/AlgorithmSelector'
import ParameterPanel from '@/components/playground/ParameterPanel'
import SimulationVisualization from '@/components/playground/SimulationVisualization'
import EnvironmentSelector, { environments } from '@/components/playground/EnvironmentSelector'
import AlgorithmInfo from '@/components/playground/AlgorithmInfo'
import InteractiveParameterGuide from '@/components/playground/InteractiveParameterGuide'
import ParameterInput from '@/components/playground/ParameterInput'
import { ToastContainer } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import { parameterDescriptions } from '@/utils/parameterDescriptions'

export default function Playground() {
  const { toasts, removeToast, success, error, warning } = useToast()
  const {
    gridWidth,
    gridHeight,
    grid,
    setGridDimensions,
    clearGrid,
    setGrid,
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
  
  // Get current environment details
  const currentEnvironment = environments.find(env => env.id === selectedEnvironment)
  const availableAlgorithms = currentEnvironment?.algorithms || []
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
  const [gridPanelHeight, setGridPanelHeight] = useState(45) // Percentage
  const [isDragging, setIsDragging] = useState(false)
  
  // Handle environment changes - switch to appropriate algorithm
  useEffect(() => {
    if (currentEnvironment && !availableAlgorithms.includes(selectedAlgorithm)) {
      // Switch to the first available algorithm for this environment
      const defaultAlgorithm = availableAlgorithms[0] as AlgorithmType
      if (defaultAlgorithm) {
        setSelectedAlgorithm(defaultAlgorithm)
      }
    }
  }, [selectedEnvironment, currentEnvironment, availableAlgorithms, selectedAlgorithm])
  
  // Load preset from learning mode
  useEffect(() => {
    const presetStr = localStorage.getItem('playground_preset')
    if (presetStr) {
      try {
        const preset = JSON.parse(presetStr)
        
        // Apply preset configuration
        if (preset.algorithm) {
          setSelectedAlgorithm(preset.algorithm)
        }
        if (preset.environment) {
          setSelectedEnvironment(preset.environment)
        }
        if (preset.parameters) {
          setParameters(prev => ({ ...prev, ...preset.parameters }))
        }
        if (preset.gridConfig && Array.isArray(preset.gridConfig)) {
          setGrid(preset.gridConfig)
        }
        
        // Clear preset after loading
        localStorage.removeItem('playground_preset')
        
        success('Preset Loaded', 'Configuration loaded from lesson')
      } catch (err) {
        console.error('Failed to load preset:', err)
      }
    }
  }, []) // Only run once on mount
  
  // Helper to handle environment selection
  const handleEnvironmentChange = (envId: string) => {
    setSelectedEnvironment(envId)
    clearSimulationResults()
  }
  
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
    const filename = `rl-config-${selectedAlgorithm}-${Date.now()}.json`
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    
    success('Configuration Exported', `Saved as ${filename}`)
  }
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  // Add/remove event listeners for drag
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById('playground-content')
      if (!container) return
      
      const rect = container.getBoundingClientRect()
      const newHeight = ((e.clientY - rect.top) / rect.height) * 100
      
      // Constrain between 20% and 80%
      const clampedHeight = Math.min(Math.max(newHeight, 20), 80)
      setGridPanelHeight(clampedHeight)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string)
        
        // Validate config structure
        if (!config.algorithm || !config.parameters || !config.grid) {
          throw new Error('Invalid configuration file format')
        }
        
        // Apply the configuration
        setSelectedAlgorithm(config.algorithm)
        setParameters(config.parameters)
        setGridDimensions(config.grid.width, config.grid.height)
        
        // Import grid cells
        if (config.grid.cells && Array.isArray(config.grid.cells)) {
          setGrid(config.grid.cells)
        }
        
        success('Configuration Imported', `Loaded ${config.algorithm} settings successfully`)
      } catch (err: any) {
        console.error('Failed to import config:', err)
        error('Import Failed', err.message || 'Invalid configuration file')
      }
    }
    reader.readAsText(file)
    
    // Reset the input value so the same file can be imported again
    event.target.value = ''
  }
  
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Header - Smaller & Cleaner */}
      <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 border-b border-gray-200 px-3 py-2 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-lg font-bold text-white drop-shadow-lg whitespace-nowrap">
              🎮 Playground
            </h1>
            <button
              onClick={() => setShowEnvironmentSelector(true)}
              className="flex items-center gap-1.5 px-2 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white rounded-md text-xs font-semibold transition-all border border-white border-opacity-30 whitespace-nowrap"
            >
              <span className="text-sm">{currentEnvironment?.icon || '🎯'}</span>
              <span className="hidden md:inline text-xs">{currentEnvironment?.name || 'Select'}</span>
            </button>
          </div>
          
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={handleReset}
              className="px-2 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white rounded-md text-xs font-semibold transition-all border border-white border-opacity-30 flex items-center gap-1.5"
              disabled={!isSimulating && simulationResults.length === 0}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-3 py-1 bg-white text-purple-600 hover:bg-opacity-90 rounded-md text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" />
              {isSimulating ? 'Running...' : 'Run'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Area - Flexbox Layout */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Configuration Panel - Very Compact */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 py-2 overflow-x-auto">
          <div className="flex flex-col lg:flex-row items-start gap-2 min-w-fit">
            {/* Algorithm Selection */}
            <div className="flex-shrink-0 w-full lg:w-44">
              <label className="text-[10px] font-semibold mb-0.5 text-gray-600 flex items-center gap-1">
                ⚙️ Algorithm
              </label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value as any)}
                className="input w-full text-xs font-semibold py-1 px-2"
              >
                {availableAlgorithms.includes('bandit') && (
                  <optgroup label="🎰 Bandit">
                    <option value="bandit">Multi-Armed Bandit</option>
                  </optgroup>
                )}
                {(availableAlgorithms.includes('qlearning') || availableAlgorithms.includes('sarsa') || availableAlgorithms.includes('td_lambda')) && (
                  <optgroup label="📊 Value-Based">
                    {availableAlgorithms.includes('qlearning') && (
                      <option value="qlearning">Q-Learning (Off-policy)</option>
                    )}
                    {availableAlgorithms.includes('sarsa') && (
                      <option value="sarsa">SARSA (On-policy)</option>
                    )}
                    {availableAlgorithms.includes('td_lambda') && (
                      <option value="td_lambda">TD(λ) - Eligibility Traces</option>
                    )}
                  </optgroup>
                )}
                {(availableAlgorithms.includes('reinforce') || availableAlgorithms.includes('trpo') || availableAlgorithms.includes('a2c') || availableAlgorithms.includes('ppo')) && (
                  <optgroup label="🚀 Policy Gradient (Timeline)">
                    {availableAlgorithms.includes('reinforce') && (
                      <option value="reinforce">REINFORCE (1992)</option>
                    )}
                    {availableAlgorithms.includes('trpo') && (
                      <option value="trpo">TRPO (2015) - Trust Region</option>
                    )}
                    {availableAlgorithms.includes('a2c') && (
                      <option value="a2c">A2C (2016)</option>
                    )}
                    {availableAlgorithms.includes('ppo') && (
                      <option value="ppo">PPO (2017) - Improved TRPO</option>
                    )}
                  </optgroup>
                )}
              </select>
            </div>
            
            {/* Parameters - Very Compact */}
            <div className="flex-1 min-w-0">
              <label className="text-[10px] font-semibold mb-0.5 text-gray-600 flex items-center gap-1">
                🎛️ Parameters
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-1.5">
                {selectedAlgorithm === 'bandit' && (
                  <>
                    <ParameterInput
                      {...parameterDescriptions.n_arms}
                      value={parameters.n_arms}
                      onChange={(v) => setParameters({ ...parameters, n_arms: Math.round(v) })}
                      min={2}
                      max={10}
                      step={1}
                    />
                    <ParameterInput
                      {...parameterDescriptions.epsilon}
                      value={parameters.epsilon}
                      onChange={(v) => setParameters({ ...parameters, epsilon: v })}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                    <ParameterInput
                      {...parameterDescriptions.n_episodes}
                      value={parameters.n_episodes}
                      onChange={(v) => setParameters({ ...parameters, n_episodes: Math.round(v) })}
                      min={100}
                      max={2000}
                      step={100}
                    />
                    <ParameterInput
                      {...parameterDescriptions.initial_q}
                      value={parameters.initial_q}
                      onChange={(v) => setParameters({ ...parameters, initial_q: v })}
                      min={-2}
                      max={2}
                      step={0.1}
                    />
                  </>
                )}
                
                {(selectedAlgorithm === 'qlearning' || selectedAlgorithm === 'sarsa') && (
                  <>
                    <ParameterInput
                      {...parameterDescriptions.alpha}
                      value={parameters.alpha}
                      onChange={(v) => setParameters({ ...parameters, alpha: v })}
                      min={0.01}
                      max={1}
                      step={0.05}
                    />
                    <ParameterInput
                      {...parameterDescriptions.gamma}
                      value={parameters.gamma}
                      onChange={(v) => setParameters({ ...parameters, gamma: v })}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                    <ParameterInput
                      {...parameterDescriptions.epsilon}
                      value={parameters.epsilon}
                      onChange={(v) => setParameters({ ...parameters, epsilon: v })}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                    <ParameterInput
                      {...parameterDescriptions.n_episodes}
                      value={parameters.n_episodes}
                      onChange={(v) => setParameters({ ...parameters, n_episodes: Math.round(v) })}
                      min={50}
                      max={1000}
                      step={50}
                    />
                  </>
                )}

                {selectedAlgorithm === 'td_lambda' && (
                  <>
                    <ParameterInput
                      {...parameterDescriptions.alpha}
                      value={parameters.alpha}
                      onChange={(v) => setParameters({ ...parameters, alpha: v })}
                      min={0.01}
                      max={1}
                      step={0.05}
                    />
                    <ParameterInput
                      {...parameterDescriptions.gamma}
                      value={parameters.gamma}
                      onChange={(v) => setParameters({ ...parameters, gamma: v })}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                    <ParameterInput
                      {...parameterDescriptions.lambda_}
                      value={parameters.lambda_}
                      onChange={(v) => setParameters({ ...parameters, lambda_: v })}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                    <ParameterInput
                      {...parameterDescriptions.epsilon}
                      value={parameters.epsilon}
                      onChange={(v) => setParameters({ ...parameters, epsilon: v })}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                    <ParameterInput
                      {...parameterDescriptions.n_episodes}
                      value={parameters.n_episodes}
                      onChange={(v) => setParameters({ ...parameters, n_episodes: Math.round(v) })}
                      min={50}
                      max={1000}
                      step={50}
                    />
                  </>
                )}
                
                {selectedAlgorithm === 'reinforce' && (
                  <>
                    <ParameterInput
                      {...parameterDescriptions.learning_rate}
                      value={parameters.learning_rate}
                      onChange={(v) => setParameters({ ...parameters, learning_rate: v })}
                      min={0.0001}
                      max={0.01}
                      step={0.0001}
                    />
                    <ParameterInput
                      {...parameterDescriptions.gamma}
                      value={parameters.gamma}
                      onChange={(v) => setParameters({ ...parameters, gamma: v })}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                    <ParameterInput
                      {...parameterDescriptions.n_episodes}
                      value={parameters.n_episodes}
                      onChange={(v) => setParameters({ ...parameters, n_episodes: Math.round(v) })}
                      min={50}
                      max={1000}
                      step={50}
                    />
                  </>
                )}
                
                {selectedAlgorithm === 'a2c' && (
                  <>
                    <ParameterInput
                      {...parameterDescriptions.learning_rate}
                      value={parameters.learning_rate}
                      onChange={(v) => setParameters({ ...parameters, learning_rate: v })}
                      min={0.0001}
                      max={0.01}
                      step={0.0001}
                    />
                    <ParameterInput
                      {...parameterDescriptions.gamma}
                      value={parameters.gamma}
                      onChange={(v) => setParameters({ ...parameters, gamma: v })}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                    <ParameterInput
                      {...parameterDescriptions.entropy_coef}
                      value={parameters.entropy_coef}
                      onChange={(v) => setParameters({ ...parameters, entropy_coef: v })}
                      min={0}
                      max={0.1}
                      step={0.01}
                    />
                    <ParameterInput
                      {...parameterDescriptions.value_coef}
                      value={parameters.value_coef}
                      onChange={(v) => setParameters({ ...parameters, value_coef: v })}
                      min={0.1}
                      max={1}
                      step={0.1}
                    />
                    <ParameterInput
                      {...parameterDescriptions.n_episodes}
                      value={parameters.n_episodes}
                      onChange={(v) => setParameters({ ...parameters, n_episodes: Math.round(v) })}
                      min={50}
                      max={1000}
                      step={50}
                    />
                  </>
                )}
                
                {selectedAlgorithm === 'trpo' && (
                  <>
                    <ParameterInput
                      {...parameterDescriptions.learning_rate}
                      value={parameters.learning_rate}
                      onChange={(v) => setParameters({ ...parameters, learning_rate: v })}
                      min={0.0001}
                      max={0.01}
                      step={0.0001}
                    />
                    <ParameterInput
                      {...parameterDescriptions.gamma}
                      value={parameters.gamma}
                      onChange={(v) => setParameters({ ...parameters, gamma: v })}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                    <ParameterInput
                      {...parameterDescriptions.max_kl}
                      value={parameters.max_kl}
                      onChange={(v) => setParameters({ ...parameters, max_kl: v })}
                      min={0.001}
                      max={0.1}
                      step={0.001}
                    />
                    <ParameterInput
                      {...parameterDescriptions.n_episodes}
                      value={parameters.n_episodes}
                      onChange={(v) => setParameters({ ...parameters, n_episodes: Math.round(v) })}
                      min={50}
                      max={1000}
                      step={50}
                    />
                  </>
                )}
                
                {selectedAlgorithm === 'ppo' && (
                  <>
                    <ParameterInput
                      {...parameterDescriptions.learning_rate}
                      value={parameters.learning_rate}
                      onChange={(v) => setParameters({ ...parameters, learning_rate: v })}
                      min={0.0001}
                      max={0.01}
                      step={0.0001}
                    />
                    <ParameterInput
                      {...parameterDescriptions.gamma}
                      value={parameters.gamma}
                      onChange={(v) => setParameters({ ...parameters, gamma: v })}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                    <ParameterInput
                      {...parameterDescriptions.clip_ratio}
                      value={parameters.clip_ratio}
                      onChange={(v) => setParameters({ ...parameters, clip_ratio: v })}
                      min={0.1}
                      max={0.5}
                      step={0.05}
                    />
                    <ParameterInput
                      {...parameterDescriptions.n_episodes}
                      value={parameters.n_episodes}
                      onChange={(v) => setParameters({ ...parameters, n_episodes: Math.round(v) })}
                      min={50}
                      max={1000}
                      step={50}
                    />
                  </>
                )}
              </div>
            </div>
            
            {/* Grid Size (for grid-based) */}
            {(selectedAlgorithm === 'qlearning' || selectedAlgorithm === 'sarsa' || selectedAlgorithm === 'td_lambda' || selectedAlgorithm === 'reinforce' || selectedAlgorithm === 'a2c' || selectedAlgorithm === 'trpo' || selectedAlgorithm === 'ppo') && (
              <div className="flex-shrink-0" style={{ width: '120px' }}>
                <label className="text-[10px] font-semibold mb-0.5 text-gray-600">Grid Size</label>
                <div className="flex gap-1.5">
                  <div className="flex-1">
                    <label className="text-[9px] text-gray-500">W</label>
                    <input
                      type="number"
                      min={3}
                      max={15}
                      value={gridWidth}
                      onChange={(e) => setGridDimensions(parseInt(e.target.value), gridHeight)}
                      className="input w-full text-xs py-0.5 px-1.5 mt-0.5"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-gray-500">H</label>
                    <input
                      type="number"
                      min={3}
                      max={15}
                      value={gridHeight}
                      onChange={(e) => setGridDimensions(gridWidth, parseInt(e.target.value))}
                      className="input w-full text-xs py-0.5 px-1.5 mt-0.5"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex-shrink-0 flex items-end gap-1.5">
              {/* Clear button only for grid-based algorithms */}
              {(selectedAlgorithm === 'qlearning' || selectedAlgorithm === 'sarsa' || selectedAlgorithm === 'td_lambda' || selectedAlgorithm === 'reinforce' || selectedAlgorithm === 'a2c' || selectedAlgorithm === 'trpo' || selectedAlgorithm === 'ppo') && (
                <button
                  onClick={clearGrid}
                  className="btn btn-secondary text-[10px] px-2 py-1"
                  title="Clear Grid"
                >
                  🔄
                </button>
              )}
              <button
                onClick={handleExportConfig}
                className="btn btn-secondary text-[10px] px-2 py-1"
                title="Export Config"
              >
                <Download className="w-3 h-3" />
              </button>
              <label className="btn btn-secondary text-[10px] px-2 py-1 cursor-pointer" title="Import Config">
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
        
        {/* Main Content Area - VERTICAL Layout */}
        <div id="playground-content" className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {selectedAlgorithm === 'bandit' ? (
            /* Bandit: Full height with proper scroll */
            <div className="flex-1 bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
              <div className="max-w-6xl mx-auto py-6 px-6">
                <BanditEnvironment
                  nArms={parameters.n_arms}
                  simulationResults={simulationResults}
                  isRunning={isSimulating}
                />
              </div>
            </div>
          ) : (
            /* Grid-based: Resizable Split View */
            <>
              {/* Top: Environment Editor - Resizable */}
              <motion.div
                className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 overflow-y-auto"
                style={{ height: `${gridPanelHeight}%` }}
                animate={{ height: `${gridPanelHeight}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="max-w-4xl mx-auto py-3 px-4">
                  <GridEditor />
                </div>
              </motion.div>
              
              {/* Fancy Resizable Divider */}
              <motion.div
                className={clsx(
                  'relative flex-shrink-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 cursor-ns-resize group',
                  isDragging && 'h-3'
                )}
                onMouseDown={handleMouseDown}
                whileHover={{ scale: 1.05, height: 12 }}
                animate={isDragging ? { scale: 1.1 } : {}}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 blur-sm opacity-0 group-hover:opacity-50 transition-opacity"
                  animate={isDragging ? { opacity: 0.7 } : {}}
                />
                
                {/* Handle indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="flex gap-1"
                    animate={isDragging ? { scale: 1.2 } : {}}
                  >
                    <div className="w-8 h-1 bg-white rounded-full opacity-70 group-hover:opacity-100" />
                    <div className="w-8 h-1 bg-white rounded-full opacity-70 group-hover:opacity-100" />
                  </motion.div>
                </div>
                
                {/* Animated particles when dragging */}
                <AnimatePresence>
                  {isDragging && (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: `${i * 20}%`, opacity: 0, scale: 0 }}
                          animate={{ 
                            x: `${i * 20 + 10}%`,
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                          className="absolute top-1/2 w-2 h-2 bg-white rounded-full"
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Bottom: Simulation Results - Flexible */}
              <div className="flex-1 flex flex-col min-h-0 bg-white overflow-hidden">
                <div className="flex-shrink-0 bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1.5 shadow-sm">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    📊 Results
                    {isSimulating && (
                      <span className="text-[10px] text-indigo-100 font-normal flex items-center gap-1">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-1.5 h-1.5 border border-white border-t-transparent rounded-full"
                        />
                        Ep {simulationResults.length}
                      </span>
                    )}
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto bg-white">
                  <SimulationVisualization
                    algorithm={selectedAlgorithm}
                    results={simulationResults}
                    isRunning={isSimulating}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Environment Selector Modal */}
      <AnimatePresence>
        {showEnvironmentSelector && (
          <EnvironmentSelector
            selectedEnvironment={selectedEnvironment}
            onSelectEnvironment={handleEnvironmentChange}
            onClose={() => setShowEnvironmentSelector(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* Floating Parameter Guide */}
      <InteractiveParameterGuide algorithm={selectedAlgorithm} />
    </div>
  )
}

