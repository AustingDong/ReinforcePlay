import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, TrendingUp, Eye, EyeOff, Zap, Target } from 'lucide-react'

interface BanditEnvironmentProps {
  nArms: number
  simulationResults: any[]
  isRunning: boolean
}

export default function BanditEnvironment({
  nArms,
  simulationResults,
  isRunning,
}: BanditEnvironmentProps) {
  const [showTrueValues, setShowTrueValues] = useState(false)
  const [selectedMachine, setSelectedMachine] = useState<number | null>(null)

  // Get latest Q-values and statistics from simulation results
  const latestResult = simulationResults.length > 0 ? simulationResults[simulationResults.length - 1] : null
  const qValues = latestResult?.q_values || Array(nArms).fill(0)
  const actionCounts = latestResult?.action_counts || Array(nArms).fill(0)
  const trueRewards = latestResult?.true_rewards || Array(nArms).fill(0)
  const totalActions = actionCounts.reduce((a: number, b: number) => a + b, 0)
  
  // Calculate optimal action and rate
  const optimalAction = latestResult?.optimal_arm ?? trueRewards.indexOf(Math.max(...trueRewards))
  
  // Calculate optimal rate from all results
  const optimalCount = simulationResults.filter(r => r.is_optimal).length
  const optimalActionRate = simulationResults.length > 0 ? optimalCount / simulationResults.length : 0

  // Animate selected machine
  useEffect(() => {
    const selectedArm = latestResult?.arm_selected ?? latestResult?.action
    if (selectedArm !== undefined) {
      setSelectedMachine(selectedArm)
      const timer = setTimeout(() => setSelectedMachine(null), 500)
      return () => clearTimeout(timer)
    }
  }, [latestResult])

  // Generate colors for machines
  const machineColors = [
    'from-red-400 to-red-600',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-yellow-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-orange-400 to-orange-600',
    'from-teal-400 to-teal-600',
    'from-cyan-400 to-cyan-600',
  ]

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-1">
            🎰 Slot Machine Casino
          </h3>
          <p className="text-sm text-gray-600">
            {simulationResults.length === 0 
              ? 'Hit "Run Simulation" to start exploring!'
              : `Training progress: ${simulationResults.length} pulls`}
          </p>
        </div>

        {simulationResults.length > 0 && (
          <motion.button
            onClick={() => setShowTrueValues(!showTrueValues)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {showTrueValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showTrueValues ? 'Hide' : 'Reveal'} True Values
          </motion.button>
        )}
      </div>

      {/* Stats Cards */}
      {simulationResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200 shadow-md"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-blue-600 font-semibold uppercase">Optimal Rate</div>
                <div className="text-xl font-bold text-blue-900">{(optimalActionRate * 100).toFixed(1)}%</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200 shadow-md"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-green-600 font-semibold uppercase">Total Pulls</div>
                <div className="text-xl font-bold text-green-900">{totalActions}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200 shadow-md"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-purple-600 font-semibold uppercase">Best Machine</div>
                <div className="text-xl font-bold text-purple-900">#{optimalAction + 1}</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Slot Machines */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: nArms }).map((_, idx) => {
          const isOptimal = idx === optimalAction
          const isSelected = idx === selectedMachine
          const pullCount = actionCounts[idx] || 0
          const qValue = qValues[idx] || 0
          const trueValue = trueRewards[idx] || 0
          const pullPercentage = totalActions > 0 ? (pullCount / totalActions) * 100 : 0

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: isSelected ? 1.1 : 1,
              }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {/* Machine Container */}
              <div
                className={`
                  relative rounded-2xl overflow-hidden shadow-2xl transition-all
                  ${isSelected ? 'ring-4 ring-yellow-400 ring-offset-2' : ''}
                  ${isOptimal && showTrueValues ? 'ring-4 ring-green-400 ring-offset-2' : ''}
                `}
              >
                {/* Machine Body */}
                <div className={`bg-gradient-to-b ${machineColors[idx % machineColors.length]} p-4 pb-3`}>
                  {/* Machine Number */}
                  <div className="text-center mb-2">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-white bg-opacity-30 backdrop-blur-sm rounded-full border-2 border-white border-opacity-50">
                      <span className="text-xl font-bold text-white drop-shadow-lg">
                        {idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Slot Machine Icon */}
                  <div className="text-center mb-2">
                    <motion.div
                      animate={isSelected ? { rotate: [0, -10, 10, -10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                      className="text-5xl filter drop-shadow-lg"
                    >
                      🎰
                    </motion.div>
                  </div>

                  {/* Lever Animation */}
                  <div className="flex justify-end pr-1">
                    <motion.div
                      animate={isSelected ? { rotate: [0, 45, 0] } : {}}
                      transition={{ duration: 0.5 }}
                      className="text-2xl origin-top"
                    >
                      🕹️
                    </motion.div>
                  </div>
                </div>

                {/* Display Panel */}
                <div className="bg-gray-900 p-3 space-y-1.5">
                  {/* Q-Value (Agent's Estimate) */}
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded p-1.5 text-center">
                    <div className="text-[10px] text-blue-100 font-semibold">Agent Estimate</div>
                    <div className="text-lg font-bold text-white">{qValue.toFixed(3)}</div>
                  </div>

                  {/* True Value (Revealed) */}
                  <AnimatePresence>
                    {showTrueValues && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 rounded p-1.5 text-center overflow-hidden"
                      >
                        <div className="text-[10px] text-green-100 font-semibold">True Value</div>
                        <div className="text-lg font-bold text-white">{trueValue.toFixed(3)}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pull Count */}
                  <div className="flex items-center justify-between text-[10px] text-gray-300">
                    <span>Pulls:</span>
                    <span className="font-bold">{pullCount}</span>
                  </div>

                  {/* Pull Percentage Bar */}
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pullPercentage}%` }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                    />
                  </div>
                </div>

                {/* Optimal Badge */}
                {isOptimal && showTrueValues && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                  >
                    <Trophy className="w-3 h-3" />
                    Best!
                  </motion.div>
                )}

                {/* Selection Flash */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-yellow-300 pointer-events-none"
                  />
                )}

                {/* Coins Animation when selected */}
                {isSelected && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 0, opacity: 1, x: 0 }}
                        animate={{ 
                          y: [-20, -60], 
                          opacity: [1, 0],
                          x: [0, (i - 2) * 10],
                        }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className="absolute top-1/2 left-1/2 text-2xl pointer-events-none"
                      >
                        💰
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {simulationResults.length === 0 && !isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-3"
          >
            🎰
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Play!</h3>
          <p className="text-sm text-gray-600 mb-3">
            Click <strong className="text-purple-600">Run Simulation</strong> to start the bandit learning experiment
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Zap className="w-4 h-4" />
            <span>The agent will learn which machine pays the most</span>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      {simulationResults.length > 0 && (
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-3 shadow-md">
          <div className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
            <span>📖</span>
            <span>Understanding the Display</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-start gap-2 bg-white rounded p-2">
              <span className="text-lg">🎯</span>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900">Agent Estimate</div>
                <div className="text-gray-600">The agent's belief about each machine's payout</div>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-white rounded p-2">
              <span className="text-lg">💰</span>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900">True Value</div>
                <div className="text-gray-600">The actual average payout (hidden until revealed)</div>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-white rounded p-2">
              <span className="text-lg">📊</span>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900">Pull Count</div>
                <div className="text-gray-600">How many times each machine was tried</div>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-white rounded p-2">
              <span className="text-lg">🏆</span>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900">Best Machine</div>
                <div className="text-gray-600">The machine with the highest true payout</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

