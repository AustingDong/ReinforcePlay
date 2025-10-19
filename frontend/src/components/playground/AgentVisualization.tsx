import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, FastForward, Sparkles } from 'lucide-react'
import { useAppStore, type GridCell } from '@/store/useAppStore'
import clsx from 'clsx'

interface AgentVisualizationProps {
  lastEpisode: any
  qTable?: any
}

// Same fancy styles as GridEditor
const CELL_STYLES = {
  empty: 'bg-gradient-to-br from-gray-50 to-gray-100',
  obstacle: 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900',
  reward: 'bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400',
  goal: 'bg-gradient-to-br from-green-300 via-emerald-400 to-teal-500',
  start: 'bg-gradient-to-br from-blue-300 via-cyan-400 to-sky-500',
}

const CELL_EMOJIS = {
  empty: '',
  obstacle: '🧱',
  reward: '💎',
  goal: '🏆',
  start: '🏁',
}

const CELL_SHADOWS = {
  empty: '',
  obstacle: 'shadow-inner',
  reward: 'shadow-md shadow-yellow-400/30',
  goal: 'shadow-md shadow-green-400/30',
  start: 'shadow-md shadow-blue-400/30',
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
  
  if (!lastEpisode || !trajectory || trajectory.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-7xl mb-4"
        >
          🤖
        </motion.div>
        <p className="text-xl font-semibold text-gray-700 mb-2">No Trajectory Data</p>
        <p className="text-gray-500">Run a simulation to see the agent in action!</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Fancy Controls Card */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 rounded-2xl p-6 shadow-xl border-2 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🎬 Agent Playback Controls
          </h4>
          <motion.button
            onClick={() => setShowQValues(!showQValues)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
              showQValues 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 border-2 border-gray-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {showQValues ? 'Hide Policy' : 'Show Policy'}
          </motion.button>
        </div>
        
        {/* Playback Controls */}
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.1, rotate: -180 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-xl bg-white border-2 border-gray-300 hover:border-purple-400 transition-colors shadow-md"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5 text-gray-700" />
          </motion.button>
          
          {isPlaying ? (
            <motion.button
              onClick={handlePause}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
              title="Pause"
            >
              <Pause className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handlePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
              title="Play"
            >
              <Play className="w-5 h-5" />
            </motion.button>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                Step {currentStep + 1} / {trajectory.length}
              </span>
              <input
                type="range"
                min={0}
                max={trajectory.length - 1}
                value={currentStep}
                onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border-2 border-gray-300">
            <FastForward className="w-4 h-4 text-gray-600" />
            <select
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="text-sm font-semibold bg-transparent border-none outline-none cursor-pointer"
            >
              <option value={1000}>0.5x</option>
              <option value={500}>1x</option>
              <option value={250}>2x</option>
              <option value={100}>5x</option>
            </select>
          </div>
        </div>
        
        {/* Current Step Info - Fancy Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Action', value: ACTION_ARROWS[trajectory[currentStep]?.action] || '-', emoji: '🎯', color: 'from-blue-400 to-cyan-500' },
            { label: 'Reward', value: trajectory[currentStep]?.reward?.toFixed(2) || '0', emoji: '💰', color: 'from-yellow-400 to-orange-500' },
            { label: 'Position', value: `(${trajectory[currentStep]?.state?.[1] ?? 0}, ${trajectory[currentStep]?.state?.[0] ?? 0})`, emoji: '📍', color: 'from-purple-400 to-pink-500' },
          ].map((info, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${info.color} rounded-xl p-3 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium opacity-90">{info.label}</span>
                <span className="text-lg">{info.emoji}</span>
              </div>
              <div className="text-lg font-bold">{info.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Grid Visualization - Fancy 3D Maze (same as GridEditor) */}
      <div className="relative inline-block">
        {/* Subtle outer glow */}
        <div className="absolute -inset-3 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 rounded-2xl opacity-10 blur-md" />
        
        <div className="relative border-4 border-purple-600 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
          <div
            className="grid gap-1 p-2"
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
                  <motion.div
                    key={`${x}-${y}`}
                    animate={{
                      scale: isAgent ? 1.1 : 1,
                    }}
                    className={clsx(
                      'relative w-16 h-16 rounded-lg border-2 transition-all',
                      CELL_STYLES[cellType],
                      CELL_SHADOWS[cellType],
                      cellType === 'empty' ? 'border-gray-300' : 'border-gray-600',
                      isAgent && 'ring-2 ring-cyan-400/70 ring-offset-1 ring-offset-gray-800 z-10'
                    )}
                  >
                    {/* Cell emoji */}
                    {CELL_EMOJIS[cellType] && (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl drop-shadow-lg">
                        {CELL_EMOJIS[cellType]}
                      </div>
                    )}
                    
                    {/* Policy arrow */}
                    {showQValues && qValues && bestAction !== null && cellType === 'empty' && !isAgent && (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-60">
                        {ACTION_ARROWS[bestAction]}
                      </div>
                    )}
                    
                    {/* Agent with fancy animation */}
                    <AnimatePresence>
                      {isAgent && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: 0,
                          }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 flex items-center justify-center text-5xl z-20 drop-shadow-lg"
                        >
                          🤖
                          {/* Subtle glow effect */}
                          <motion.div
                            animate={{
                              opacity: [0.1, 0.2, 0.1],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-cyan-400 rounded-lg opacity-15 blur-sm"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Subtle sparkle effect for rewards and goal */}
                    {(cellType === 'reward' || cellType === 'goal') && (
                      <motion.div
                        animate={{
                          opacity: [0.1, 0.2, 0.1],
                          scale: [0.9, 1.05, 0.9],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                        }}
                        className="absolute inset-0 rounded-lg bg-white opacity-10 pointer-events-none"
                      />
                    )}
                    
                    {/* Q-values display */}
                    {showQValues && qValues && (
                      <div className="absolute inset-0 text-[9px] font-mono font-bold text-purple-900">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white px-1 rounded">{qValues[0]?.toFixed(1)}</div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white px-1 rounded">{qValues[1]?.toFixed(1)}</div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white px-1 rounded">{qValues[2]?.toFixed(1)}</div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-white px-1 rounded">{qValues[3]?.toFixed(1)}</div>
                      </div>
                    )}
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </div>
      
      {/* Legend - Fancy */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-4 text-sm shadow-lg">
        <div className="font-bold mb-3 text-gray-900">📖 Legend</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-white rounded-lg p-2">
            <span className="text-3xl">🤖</span>
            <span className="text-gray-700 font-medium">Agent (Current)</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg p-2">
            <span className="text-xl">⬆️➡️⬇️⬅️</span>
            <span className="text-gray-700 font-medium">Actions</span>
          </div>
          {showQValues && (
            <div className="col-span-2 text-gray-600 bg-purple-100 rounded-lg p-2 border-2 border-purple-300">
              <strong>Q-Values:</strong> Numbers show action values. Arrows show best policy direction.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
