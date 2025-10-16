import ParameterSlider from '@/components/ParameterSlider'

interface ParameterPanelProps {
  algorithm: 'bandit' | 'qlearning' | 'ppo'
  parameters: Record<string, any>
  onChange: (params: Record<string, any>) => void
}

export default function ParameterPanel({ algorithm, parameters, onChange }: ParameterPanelProps) {
  const updateParam = (key: string, value: number) => {
    onChange({ ...parameters, [key]: value })
  }
  
  return (
    <div className="space-y-4">
      {/* Common Parameters */}
      <ParameterSlider
        label="Episodes"
        value={parameters.n_episodes}
        onChange={(val) => updateParam('n_episodes', val)}
        min={algorithm === 'bandit' ? 100 : 50}
        max={algorithm === 'bandit' ? 2000 : 1000}
        step={algorithm === 'bandit' ? 100 : 50}
        description="Number of training episodes"
      />
      
      {algorithm === 'bandit' && (
        <>
          <ParameterSlider
            label="Number of Arms"
            value={parameters.n_arms}
            onChange={(val) => updateParam('n_arms', val)}
            min={2}
            max={10}
            step={1}
            description="Number of slot machines"
          />
          
          <ParameterSlider
            label="Epsilon (ε)"
            value={parameters.epsilon}
            onChange={(val) => updateParam('epsilon', val)}
            min={0}
            max={1}
            step={0.05}
            description="Exploration rate"
          />
          
          <ParameterSlider
            label="Initial Q"
            value={parameters.initial_q}
            onChange={(val) => updateParam('initial_q', val)}
            min={-2}
            max={2}
            step={0.1}
            description="Initial Q-value estimate"
          />
        </>
      )}
      
      {algorithm === 'qlearning' && (
        <>
          <ParameterSlider
            label="Alpha (α)"
            value={parameters.alpha}
            onChange={(val) => updateParam('alpha', val)}
            min={0.01}
            max={1}
            step={0.05}
            description="Learning rate"
          />
          
          <ParameterSlider
            label="Gamma (γ)"
            value={parameters.gamma}
            onChange={(val) => updateParam('gamma', val)}
            min={0}
            max={1}
            step={0.05}
            description="Discount factor"
          />
          
          <ParameterSlider
            label="Epsilon (ε)"
            value={parameters.epsilon}
            onChange={(val) => updateParam('epsilon', val)}
            min={0}
            max={1}
            step={0.05}
            description="Exploration rate"
          />
        </>
      )}
      
      {algorithm === 'ppo' && (
        <>
          <ParameterSlider
            label="Learning Rate"
            value={parameters.learning_rate}
            onChange={(val) => updateParam('learning_rate', val)}
            min={0.0001}
            max={0.01}
            step={0.0001}
            description="Policy network learning rate"
          />
          
          <ParameterSlider
            label="Gamma (γ)"
            value={parameters.gamma}
            onChange={(val) => updateParam('gamma', val)}
            min={0}
            max={1}
            step={0.05}
            description="Discount factor"
          />
          
          <ParameterSlider
            label="Clip Ratio"
            value={parameters.clip_ratio}
            onChange={(val) => updateParam('clip_ratio', val)}
            min={0.1}
            max={0.5}
            step={0.05}
            description="PPO clipping parameter"
          />
        </>
      )}
      
      {/* Info Card */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 text-xs">
        <p className="font-semibold text-blue-900 mb-1">Parameter Tips:</p>
        <ul className="text-blue-800 space-y-1">
          {algorithm === 'qlearning' && (
            <>
              <li>• Higher α = faster learning but less stable</li>
              <li>• Higher γ = more long-term planning</li>
              <li>• Lower ε = more exploitation</li>
            </>
          )}
          {algorithm === 'bandit' && (
            <>
              <li>• ε = 0: Pure exploitation (greedy)</li>
              <li>• ε = 1: Pure exploration (random)</li>
              <li>• Optimistic initial Q encourages exploration</li>
            </>
          )}
          {algorithm === 'ppo' && (
            <>
              <li>• Lower learning rate = more stable training</li>
              <li>• Clip ratio prevents large policy changes</li>
              <li>• PPO is more complex but more stable</li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

