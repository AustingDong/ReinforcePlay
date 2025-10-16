import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react'
import { useAppStore, type GridCell } from '@/store/useAppStore'
import clsx from 'clsx'

interface AgentVisualizationProps {
  lastEpisode: any
  qTable?: any
}

const CELL_COLORS = {
  empty: 'bg-white',
  obstacle: 'bg-gray-800',
  reward: 'bg-yellow-200',
  goal: 'bg-green-300',
  start: 'bg-blue-300',
}

const CELL_LABELS = {
  empty: '',
  obstacle: '🚫',
  reward: '💰',
  goal: '🎯',
  start: '🏁',
}

const ACTION_ARROWS = ['⬆️', '➡️', '⬇️', '⬅️']

export default function AgentVisualization({ lastEpisode, qTable }: AgentVisualizationProps) {
  const { gridWidth, gridHeight, grid } = useAppStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(500) // ms per step
  const [showQValues, setShowQValues] = useState(false)
  
  const trajectory = lastEpisode?.trajectory || []
  
  // Auto-play animation
  useEffect(() => {
    if (!isPlaying || currentStep >= trajectory.length - 1) {
      if (currentStep >= trajectory.length - 1) {
        setIsPlaying(false)
      }
      return
    }
    
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, speed)
    
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, trajectory.length, speed])
  
  const getCellData = (x: number, y: number): GridCell | undefined => {
    return grid.find(cell => cell.x === x && cell.y === y)
  }
  
  const isAgentAt = (x: number, y: number): boolean => {
    if (!trajectory[currentStep]) return false
    const state = trajectory[currentStep].state
    // Handle both tuple and array formats
    const agentY = Array.isArray(state) ? state[0] : state[0]
    const agentX = Array.isArray(state) ? state[1] : state[1]
    return agentX === x && agentY === y
  }
  
  const getQValueForCell = (x: number, y: number): number[] | null => {
    if (!qTable) return null
    const key = `(${y}, ${x})`
    return qTable[key] || null
  }
  
  const getBestAction = (qValues: number[]): number => {
    return qValues.indexOf(Math.max(...qValues))
  }
  
  const handlePlay = () => {
    if (currentStep >= trajectory.length - 1) {
      setCurrentStep(0)
    }
    setIsPlaying(true)
  }
  
  const handlePause = () => {
    setIsPlaying(false)
  }
  
  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }
  
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
  }
  
  if (!lastEpisode || !trajectory || trajectory.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="text-4xl mb-3">🤖</div>
        <p className="text-sm">No trajectory data available</p>
        <p className="text-xs mt-1">Run a simulation to see agent movement</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm">Agent Trajectory Playback</h4>
          <div className="flex gap-2">
            <button
              onClick={showQValues ? () => setShowQValues(false) : () => setShowQValues(true)}
              className="text-xs px-3 py-1 rounded bg-white border border-gray-300 hover:bg-gray-50"
            >
              {showQValues ? 'Hide Q-Values' : 'Show Policy'}
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          {isPlaying ? (
            <button
              onClick={handlePause}
              className="p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
              title="Pause"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
              title="Play"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Step {currentStep + 1} / {trajectory.length}</span>
              <input
                type="range"
                min={0}
                max={trajectory.length - 1}
                value={currentStep}
                onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <FastForward className="w-4 h-4 text-gray-600" />
            <select
              value={speed}
              onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
              className="text-xs px-2 py-1 rounded border border-gray-300"
            >
              <option value={1000}>0.5x</option>
              <option value={500}>1x</option>
              <option value={250}>2x</option>
              <option value={100}>5x</option>
            </select>
          </div>
        </div>
        
        {/* Current Step Info */}
        <div className="mt-3 text-xs text-gray-600 grid grid-cols-3 gap-2">
          <div>
            <span className="font-medium">Action:</span> {ACTION_ARROWS[trajectory[currentStep]?.action] || '-'}
          </div>
          <div>
            <span className="font-medium">Reward:</span> {trajectory[currentStep]?.reward?.toFixed(2) || '0'}
          </div>
          <div>
            <span className="font-medium">State:</span> ({trajectory[currentStep]?.state?.[1] ?? 0}, {trajectory[currentStep]?.state?.[0] ?? 0})
          </div>
        </div>
      </div>
      
      {/* Grid Visualization */}
      <div className="inline-block border-2 border-primary-300 rounded-lg overflow-hidden shadow-lg bg-white">
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: gridHeight }).map((_, y) =>
            Array.from({ length: gridWidth }).map((_, x) => {
              const cellData = getCellData(x, y)
              const cellType = cellData?.type || 'empty'
              const isAgent = isAgentAt(x, y)
              const qValues = getQValueForCell(x, y)
              const bestAction = qValues ? getBestAction(qValues) : null
              
              return (
                <div
                  key={`${x}-${y}`}
                  className={clsx(
                    'w-20 h-20 border border-gray-200 flex items-center justify-center relative transition-colors',
                    CELL_COLORS[cellType],
                    isAgent && 'ring-4 ring-blue-500 ring-inset'
                  )}
                >
                  {/* Cell content (obstacles, rewards, etc) */}
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    {CELL_LABELS[cellType]}
                  </div>
                  
                  {/* Policy arrow (if showing Q-values) */}
                  {showQValues && qValues && bestAction !== null && cellType === 'empty' && (
                    <div className="absolute inset-0 flex items-center justify-center text-xl opacity-50">
                      {ACTION_ARROWS[bestAction]}
                    </div>
                  )}
                  
                  {/* Agent */}
                  <AnimatePresence>
                    {isAgent && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center text-4xl z-10"
                      >
                        🤖
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Q-values display */}
                  {showQValues && qValues && (
                    <div className="absolute inset-0 text-[8px] font-mono">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2">{qValues[0]?.toFixed(1)}</div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2">{qValues[1]?.toFixed(1)}</div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">{qValues[2]?.toFixed(1)}</div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2">{qValues[3]?.toFixed(1)}</div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-3 text-xs">
        <div className="font-semibold mb-2">Legend:</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span>Agent (current position)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⬆️➡️⬇️⬅️</span>
            <span>Actions (Up, Right, Down, Left)</span>
          </div>
          {showQValues && (
            <div className="col-span-2 text-gray-600">
              Numbers show Q-values for each action. Arrow shows best action (policy).
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

