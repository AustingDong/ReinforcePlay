import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2, Eye, BarChart3, TrendingUp, Award, Zap } from 'lucide-react'
import AgentVisualization from './AgentVisualization'

interface SimulationVisualizationProps {
  algorithm: 'bandit' | 'qlearning' | 'sarsa' | 'td_lambda' | 'reinforce' | 'a2c' | 'trpo' | 'ppo'
  results: any[]
  isRunning: boolean
}

export default function SimulationVisualization({
  algorithm,
  results,
  isRunning,
}: SimulationVisualizationProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'agent'>('chart')
  
  // Process results for visualization
  const chartData = useMemo(() => {
    if (results.length === 0) return []
    
    return results.map((result, index) => ({
      episode: result.episode || index,
      reward: result.total_reward || result.reward || 0,
      steps: result.steps || 0,
    }))
  }, [results])
  
  // Get last episode for agent visualization
  const lastEpisode = results.length > 0 ? results[results.length - 1] : null
  
  const stats = useMemo(() => {
    if (results.length === 0) return null
    
    const rewards = results.map(r => r.total_reward || r.reward || 0)
    const avgReward = rewards.reduce((a, b) => a + b, 0) / rewards.length
    const maxReward = Math.max(...rewards)
    const minReward = Math.min(...rewards)
    const lastReward = rewards[rewards.length - 1]
    
    return { avgReward, maxReward, minReward, lastReward }
  }, [results])
  
  if (results.length === 0 && !isRunning) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-3"
          >
            📊
          </motion.div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Data Yet</h3>
          <p className="text-xs text-gray-600 max-w-md">
            Click <strong className="text-purple-600">Run</strong> to start!
          </p>
        </motion.div>
      </div>
    )
  }
  
  // Show loading state when running but no results yet
  if (results.length === 0 && isRunning) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-3" />
          </motion.div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Starting...</h3>
          <p className="text-xs text-gray-600">
            Initializing <span className="font-semibold text-purple-600">{algorithm}</span>
          </p>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-full">
      {/* Compact Stats Cards */}
      {stats && (
        <div className="p-3 bg-gradient-to-br from-gray-50 to-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { icon: TrendingUp, label: 'Avg', value: stats.avgReward, color: 'from-blue-500 to-cyan-500', emoji: '📈' },
              { icon: Award, label: 'Max', value: stats.maxReward, color: 'from-green-500 to-emerald-500', emoji: '🏆' },
              { icon: Zap, label: 'Last', value: stats.lastReward, color: 'from-purple-500 to-pink-500', emoji: '⚡' },
              { icon: BarChart3, label: 'Episodes', value: results.length, color: 'from-orange-500 to-red-500', emoji: '📊', noDecimal: true },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="relative overflow-hidden rounded-lg shadow-md"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90`} />
                
                <div className="relative p-2 text-white">
                  <div className="flex items-start justify-between mb-1">
                    <div className="text-xl">{stat.emoji}</div>
                    <stat.icon className="w-3 h-3 opacity-80" />
                  </div>
                  <div className="text-[9px] font-medium opacity-90">{stat.label}</div>
                  <div className="text-lg font-bold">
                    {stat.noDecimal ? stat.value : stat.value.toFixed(2)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Compact View Toggle */}
      {algorithm !== 'bandit' && results.length > 0 && (
        <div className="px-3 py-2 bg-white border-y border-gray-200">
          <div className="flex gap-1.5">
            <motion.button
              onClick={() => setViewMode('chart')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all overflow-hidden ${
                viewMode === 'chart'
                  ? 'text-white shadow-md'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {viewMode === 'chart' && (
                <motion.div
                  layoutId="view-bg"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <BarChart3 className="w-3 h-3 relative z-10" />
              <span className="relative z-10">Charts</span>
            </motion.button>
            
            <motion.button
              onClick={() => setViewMode('agent')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all overflow-hidden ${
                viewMode === 'agent'
                  ? 'text-white shadow-md'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {viewMode === 'agent' && (
                <motion.div
                  layoutId="view-bg"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <Eye className="w-3 h-3 relative z-10" />
              <span className="relative z-10">Agent</span>
            </motion.button>
          </div>
        </div>
      )}
      
      {/* Content - Agent View */}
      <AnimatePresence mode="wait">
        {chartData.length > 0 && viewMode === 'agent' && algorithm !== 'bandit' && (
          <motion.div
            key="agent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-3 bg-gradient-to-br from-gray-50 to-white"
          >
            <AgentVisualization 
              lastEpisode={lastEpisode}
              qTable={lastEpisode?.q_table}
            />
          </motion.div>
        )}
        
        {/* Charts View */}
        {chartData.length > 0 && viewMode === 'chart' && (
          <motion.div
            key="chart"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-3 space-y-3 bg-gradient-to-br from-gray-50 to-white"
          >
            {/* Compact Reward Chart */}
            <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
                📈 Reward Progress
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorReward" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="episode" 
                    stroke="#6b7280"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none', 
                      borderRadius: '0.25rem',
                      color: 'white',
                      fontSize: '11px',
                      padding: '4px 8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reward" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 2 }}
                    activeDot={{ r: 4 }}
                    fill="url(#colorReward)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Compact Episode History */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
                📜 Recent Episodes
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 max-h-60 overflow-y-auto">
                {results.slice(-20).reverse().map((result, index) => {
                  const reward = result.total_reward || result.reward || 0
                  const isPositive = reward > 0
                  
                  return (
                    <motion.div
                      key={`episode-${result.episode ?? index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.01 }}
                      whileHover={{ scale: 1.03 }}
                      className={`relative overflow-hidden rounded p-2 shadow-sm ${
                        isPositive 
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300' 
                          : 'bg-gradient-to-br from-red-50 to-orange-50 border border-red-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[9px] font-semibold text-gray-700">
                          Ep {result.episode ?? index}
                        </span>
                        <span className="text-xs">
                          {isPositive ? '✅' : '❌'}
                        </span>
                      </div>
                      <div className={`text-sm font-bold ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {reward.toFixed(1)}
                      </div>
                      {result.steps && (
                        <div className="text-[8px] text-gray-600">
                          {result.steps} steps
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
            
            {/* Compact Tip */}
            {(algorithm === 'qlearning' || algorithm === 'ppo') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-2 shadow-md text-white"
              >
                <div className="flex items-start gap-2">
                  <div className="text-xl">💡</div>
                  <div>
                    <p className="font-bold text-xs mb-0.5">Tip</p>
                    <p className="text-[10px] text-blue-50">
                      Switch to <strong>"Agent"</strong> mode to see the agent!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
