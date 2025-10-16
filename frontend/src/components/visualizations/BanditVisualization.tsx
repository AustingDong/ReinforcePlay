import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface BanditVisualizationProps {
  nArms: number
  epsilon: number
  nEpisodes: number
  isSimulating: boolean
  onComplete: () => void
}

export default function BanditVisualization({
  nArms,
  epsilon,
  nEpisodes,
  isSimulating,
  onComplete,
}: BanditVisualizationProps) {
  const [episode, setEpisode] = useState(0)
  const [rewardHistory, setRewardHistory] = useState<any[]>([])
  const [qValues, setQValues] = useState<number[]>(Array(nArms).fill(0))
  const [trueRewards, setTrueRewards] = useState<number[]>([])
  const [actionCounts, setActionCounts] = useState<number[]>(Array(nArms).fill(0))
  const [optimalRate, setOptimalRate] = useState(0)
  
  // Initialize true rewards
  useEffect(() => {
    const rewards = Array.from({ length: nArms }, () => Math.random() * 2 - 0.5)
    setTrueRewards(rewards)
  }, [nArms])
  
  // Simulation logic
  useEffect(() => {
    if (!isSimulating || episode >= nEpisodes) {
      if (episode >= nEpisodes && isSimulating) {
        onComplete()
      }
      return
    }
    
    const timeout = setTimeout(() => {
      // Epsilon-greedy action selection
      let action: number
      if (Math.random() < epsilon) {
        action = Math.floor(Math.random() * nArms)
      } else {
        action = qValues.indexOf(Math.max(...qValues))
      }
      
      // Get reward (with noise)
      const reward = trueRewards[action] + (Math.random() * 0.5 - 0.25)
      
      // Update Q-value (incremental mean)
      const newActionCounts = [...actionCounts]
      newActionCounts[action]++
      
      const newQValues = [...qValues]
      const alpha = 1 / newActionCounts[action]
      newQValues[action] += alpha * (reward - newQValues[action])
      
      // Track optimal action rate
      const optimalArm = trueRewards.indexOf(Math.max(...trueRewards))
      const isOptimal = action === optimalArm
      const newOptimalRate = (optimalRate * episode + (isOptimal ? 1 : 0)) / (episode + 1)
      
      // Update state
      setQValues(newQValues)
      setActionCounts(newActionCounts)
      setOptimalRate(newOptimalRate)
      setEpisode(episode + 1)
      
      // Add to history (sample every N episodes for performance)
      if (episode % Math.max(1, Math.floor(nEpisodes / 100)) === 0) {
        setRewardHistory(prev => [
          ...prev,
          {
            episode,
            avgReward: newQValues.reduce((a, b) => a + b, 0) / nArms,
            optimalRate: newOptimalRate * 100,
          }
        ])
      }
    }, nEpisodes > 500 ? 10 : 30) // Faster for more episodes
    
    return () => clearTimeout(timeout)
  }, [isSimulating, episode, nEpisodes, epsilon, nArms, qValues, trueRewards, actionCounts, optimalRate, onComplete])
  
  // Reset when simulation starts
  useEffect(() => {
    if (isSimulating) {
      setEpisode(0)
      setRewardHistory([])
      setQValues(Array(nArms).fill(0))
      setActionCounts(Array(nArms).fill(0))
      setOptimalRate(0)
    }
  }, [isSimulating, nArms])
  
  const optimalArm = trueRewards.length > 0 ? trueRewards.indexOf(Math.max(...trueRewards)) : -1
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Live Simulation Results</h3>
        <div className="text-sm text-gray-600">
          Episode: {episode} / {nEpisodes}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-primary-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(episode / nEpisodes) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Arms Visualization */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: nArms }).map((_, index) => {
          const isOptimal = index === optimalArm
          const pullPercentage = actionCounts.reduce((a, b) => a + b, 0) > 0
            ? (actionCounts[index] / actionCounts.reduce((a, b) => a + b, 0)) * 100
            : 0
          
          return (
            <motion.div
              key={index}
              className={`card p-4 text-center ${
                isOptimal ? 'ring-2 ring-green-500 bg-green-50' : ''
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-xs text-gray-500 mb-1">Arm {index + 1}</div>
              {isOptimal && (
                <div className="text-xs text-green-600 font-semibold mb-1">⭐ Optimal</div>
              )}
              <div className="text-lg font-bold text-primary-600">
                Q: {qValues[index].toFixed(2)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                True: {trueRewards[index]?.toFixed(2) || '?'}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Pulls: {actionCounts[index]} ({pullPercentage.toFixed(1)}%)
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* Charts */}
      {rewardHistory.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Reward Chart */}
          <div>
            <h4 className="font-semibold mb-3">Average Q-Values Over Time</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={rewardHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="episode" label={{ value: 'Episode', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Avg Q-Value', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="avgReward" stroke="#0ea5e9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Optimal Action Rate Chart */}
          <div>
            <h4 className="font-semibold mb-3">Optimal Arm Selection Rate (%)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={rewardHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="episode" label={{ value: 'Episode', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="optimalRate" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {/* Summary Stats */}
      {episode > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-3 gap-4"
        >
          <div className="card bg-blue-50 text-center">
            <div className="text-sm text-gray-600">Best Estimated Arm</div>
            <div className="text-2xl font-bold text-blue-600">
              Arm {qValues.indexOf(Math.max(...qValues)) + 1}
            </div>
          </div>
          
          <div className="card bg-green-50 text-center">
            <div className="text-sm text-gray-600">Optimal Action Rate</div>
            <div className="text-2xl font-bold text-green-600">
              {(optimalRate * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="card bg-purple-50 text-center">
            <div className="text-sm text-gray-600">Total Pulls</div>
            <div className="text-2xl font-bold text-purple-600">
              {actionCounts.reduce((a, b) => a + b, 0)}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

