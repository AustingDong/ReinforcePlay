import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore, type GridCell } from '@/store/useAppStore'
import clsx from 'clsx'

type CellType = 'empty' | 'obstacle' | 'reward' | 'goal' | 'start'

const CELL_COLORS = {
  empty: 'bg-white hover:bg-gray-50',
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

export default function GridEditor() {
  const { gridWidth, gridHeight, grid, updateGridCell } = useAppStore()
  const [selectedTool, setSelectedTool] = useState<CellType>('obstacle')
  
  const tools: { type: CellType; label: string; color: string }[] = [
    { type: 'start', label: 'Start', color: 'bg-blue-300' },
    { type: 'goal', label: 'Goal', color: 'bg-green-300' },
    { type: 'obstacle', label: 'Wall', color: 'bg-gray-800' },
    { type: 'reward', label: 'Reward', color: 'bg-yellow-200' },
    { type: 'empty', label: 'Empty', color: 'bg-white' },
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
    <div className="space-y-6">
      {/* Tool Selector */}
      <div className="flex gap-2 flex-wrap">
        {tools.map(tool => (
          <button
            key={tool.type}
            onClick={() => setSelectedTool(tool.type)}
            className={clsx(
              'px-4 py-2 rounded-lg border-2 transition-all',
              selectedTool === tool.type
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            )}
          >
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded ${tool.color} border border-gray-300`} />
              <span className="font-medium">{tool.label}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Grid */}
      <div className="inline-block border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
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
              
              return (
                <motion.button
                  key={`${x}-${y}`}
                  onClick={() => handleCellClick(x, y)}
                  whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.9 }}
                  className={clsx(
                    'w-20 h-20 border border-gray-200 flex items-center justify-center text-3xl transition-colors font-semibold',
                    CELL_COLORS[cellType]
                  )}
                  title={`(${x}, ${y})`}
                >
                  {CELL_LABELS[cellType]}
                </motion.button>
              )
            })
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="card bg-gray-50">
        <h4 className="font-semibold mb-3 text-sm">Grid Instructions</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Select a tool and click on grid cells to place it</li>
          <li>• There can only be one Start and one Goal</li>
          <li>• Obstacles block the agent's movement</li>
          <li>• Rewards give positive feedback when reached</li>
          <li>• Empty cells have a small negative reward (-0.1) to encourage efficiency</li>
        </ul>
      </div>
      
      {/* Cell Info */}
      {grid.length > 0 && (
        <div className="card">
          <h4 className="font-semibold mb-2 text-sm">Placed Elements ({grid.length})</h4>
          <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
            {grid
              .filter(cell => cell.type !== 'empty')
              .map((cell, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span>
                    {CELL_LABELS[cell.type]} {cell.type} at ({cell.x}, {cell.y})
                  </span>
                  {cell.value !== 0 && (
                    <span className="text-gray-600">R: {cell.value}</span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

