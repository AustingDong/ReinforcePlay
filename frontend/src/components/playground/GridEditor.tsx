import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore, type GridCell } from '@/store/useAppStore'
import clsx from 'clsx'

type CellType = 'empty' | 'obstacle' | 'reward' | 'goal' | 'start'

// Fancy visual representations
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
  start: '🤖',
}

const CELL_SHADOWS = {
  empty: '',
  obstacle: 'shadow-inner',
  reward: 'shadow-md shadow-yellow-400/30',
  goal: 'shadow-md shadow-green-400/30',
  start: 'shadow-md shadow-blue-400/30',
}

export default function GridEditor() {
  const { gridWidth, gridHeight, grid, updateGridCell } = useAppStore()
  const [selectedTool, setSelectedTool] = useState<CellType>('obstacle')
  
  const tools: { type: CellType; emoji: string; label: string; gradient: string }[] = [
    { type: 'start', emoji: '🤖', label: 'Start', gradient: 'from-blue-400 to-cyan-500' },
    { type: 'goal', emoji: '🏆', label: 'Goal', gradient: 'from-green-400 to-emerald-500' },
    { type: 'obstacle', emoji: '🧱', label: 'Wall', gradient: 'from-gray-700 to-gray-900' },
    { type: 'reward', emoji: '💎', label: 'Gem', gradient: 'from-yellow-400 to-orange-500' },
    { type: 'empty', emoji: '🧹', label: 'Erase', gradient: 'from-gray-100 to-gray-200' },
  ]
  
  const getCellData = (x: number, y: number): GridCell | undefined => {
    return grid.find(cell => cell.x === x && cell.y === y)
  }
  
  const handleCellClick = (x: number, y: number) => {
    const existingCell = getCellData(x, y)
    
    // If clicking with empty tool, remove the cell
    if (selectedTool === 'empty') {
      if (existingCell) {
        updateGridCell({ x, y, type: 'empty', value: 0 })
      }
      return
    }
    
    // For start and goal, ensure only one exists
    if (selectedTool === 'start' || selectedTool === 'goal') {
      // Remove any existing start/goal
      grid.forEach(cell => {
        if (cell.type === selectedTool) {
          updateGridCell({ ...cell, type: 'empty', value: 0 })
        }
      })
    }
    
    // Set the new cell
    const value = selectedTool === 'reward' ? 1.0 : selectedTool === 'goal' ? 10.0 : 0.0
    updateGridCell({ x, y, type: selectedTool, value })
  }
  
  return (
    <div className="space-y-2">
      {/* Tool Selector - Compact Cards */}
      <div className="flex gap-1.5 flex-wrap">
        {tools.map(tool => (
          <motion.button
            key={tool.type}
            onClick={() => setSelectedTool(tool.type)}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
              'relative px-2 py-1.5 rounded-lg border transition-all overflow-hidden',
              selectedTool === tool.type
                ? 'border-purple-500 shadow-md shadow-purple-300/50'
                : 'border-gray-300 hover:border-purple-300'
            )}
          >
            {/* Gradient background when selected */}
            {selectedTool === tool.type && (
              <motion.div
                layoutId="selected-tool"
                className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-10`}
                transition={{ type: "spring", duration: 0.6 }}
              />
            )}
            
            <div className="relative flex items-center gap-1">
              <span className="text-base">{tool.emoji}</span>
              <span className="font-semibold text-[10px]">{tool.label}</span>
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Grid - Fancy 3D Maze - Very Compact */}
      <div className="relative w-full max-w-lg mx-auto">
        {/* Subtle outer glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl opacity-10 blur-md" />
        
        <div className="relative border-2 border-gray-800 rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-900 to-gray-800">
          <div
            className="grid gap-0.5 p-1"
            style={{
              gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
              aspectRatio: `${gridWidth} / ${gridHeight}`,
            }}
          >
            {Array.from({ length: gridHeight }).map((_, y) =>
              Array.from({ length: gridWidth }).map((_, x) => {
                const cellData = getCellData(x, y)
                const cellType = cellData?.type || 'empty'
                
                return (
                  <motion.button
                    key={`${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    whileHover={{ scale: 1.08, zIndex: 10 }}
                    whileTap={{ scale: 0.92 }}
                    className={clsx(
                      'relative aspect-square rounded border transition-all',
                      CELL_STYLES[cellType],
                      CELL_SHADOWS[cellType],
                      cellType === 'empty' 
                        ? 'border-gray-300 hover:border-purple-400' 
                        : 'border-gray-600'
                    )}
                  >
                    {/* Cell emoji - Compact sizing */}
                    {CELL_EMOJIS[cellType] && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-sm sm:text-base drop-shadow-lg"
                      >
                        {CELL_EMOJIS[cellType]}
                      </motion.span>
                    )}
                    
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
                        className="absolute inset-0 rounded bg-white opacity-10 pointer-events-none"
                      />
                    )}
                  </motion.button>
                )
              })
            )}
          </div>
        </div>
      </div>
      
      {/* Legend - Compact */}
      <div className="flex gap-2 text-[10px] text-gray-600 flex-wrap">
        <div className="flex items-center gap-0.5">
          <span className="text-sm">🤖</span>
          <span>Start</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-sm">🏆</span>
          <span>Goal</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-sm">🧱</span>
          <span>Wall</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-sm">💎</span>
          <span>Gem</span>
        </div>
      </div>
    </div>
  )
}
