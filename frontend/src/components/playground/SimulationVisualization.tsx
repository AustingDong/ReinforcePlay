import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2, Eye, BarChart3 } from 'lucide-react'
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
    
    return { avgReward, maxReward, minReward }
  }, [results])
  
  if (results.length === 0 && !isRunning) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">No Simulation Data</h3>
          <p className="text-sm">
            Configure your environment and run a simulation to see results here
          </p>
        </div>
      </div>
    )
  }
  
  // Show loading state when running but no results yet
  if (results.length === 0 && isRunning) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Starting Training...</h3>
          <p className="text-sm text-gray-600">
            Initializing {algorithm} algorithm
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Simulation Results</h3>
          
          {/* View Toggle (only for grid-based algorithms) */}
          {algorithm !== 'bandit' && results.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('chart')}
                className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                  viewMode === 'chart'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Charts
              </button>
              <button
                onClick={() => setViewMode('agent')}
                className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                  viewMode === 'agent'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                Agent
              </button>
            </div>
          )}
        </div>
        
        {isRunning && (
          <div className="flex items-center gap-2 mt-2 text-sm text-primary-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Training in progress... Episode {results.length}</span>
          </div>
        )}
      </div>
      
      {/* Stats */}
      {stats && (
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Avg Reward</div>
              <div className="text-xl font-bold text-blue-600">
                {stats.avgReward.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Max Reward</div>
              <div className="text-xl font-bold text-green-600">
                {stats.maxReward.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Min Reward</div>
              <div className="text-xl font-bold text-red-600">
                {stats.minReward.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Content - Agent View or Charts */}
      {chartData.length > 0 && viewMode === 'agent' && algorithm !== 'bandit' && (
        <div className="flex-1 p-6 overflow-y-auto">
          <AgentVisualization 
            lastEpisode={lastEpisode}
            qTable={lastEpisode?.q_table}
          />
        </div>
      )}
      
      {/* Reward Chart */}
      {chartData.length > 0 && viewMode === 'chart' && (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Reward per Episode</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="episode" 
                  label={{ value: 'Episode', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Reward', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="reward" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Episode Details */}
          <div>
            <h4 className="font-semibold mb-3">Episode History</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.slice(-20).reverse().map((result, index) => (
                <motion.div
                  key={`episode-${result.episode ?? index}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 p-3 rounded-lg text-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      Episode {result.episode ?? index}
                    </span>
                    <span className={`font-semibold ${
                      (result.total_reward || result.reward || 0) > 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      R: {(result.total_reward || result.reward || 0).toFixed(2)}
                    </span>
                  </div>
                  {result.steps && (
                    <div className="text-xs text-gray-600 mt-1">
                      Steps: {result.steps}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Tips */}
          {(algorithm === 'qlearning' || algorithm === 'ppo') && (
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-blue-900 font-semibold">💡 Tip</p>
              <p className="text-xs text-blue-800 mt-1">
                Switch to "Agent" view to see the learned policy and watch the agent navigate through the environment!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

