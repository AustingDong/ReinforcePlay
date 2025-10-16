import clsx from 'clsx'

interface AlgorithmSelectorProps {
  selected: 'bandit' | 'qlearning' | 'ppo'
  onChange: (algorithm: 'bandit' | 'qlearning' | 'ppo') => void
}

export default function AlgorithmSelector({ selected, onChange }: AlgorithmSelectorProps) {
  const algorithms = [
    {
      id: 'bandit' as const,
      name: 'Multi-Armed Bandit',
      description: 'Epsilon-greedy exploration',
      difficulty: 'Beginner',
      color: 'border-green-500',
    },
    {
      id: 'qlearning' as const,
      name: 'Q-Learning',
      description: 'Temporal difference learning',
      difficulty: 'Intermediate',
      color: 'border-blue-500',
    },
    {
      id: 'ppo' as const,
      name: 'PPO',
      description: 'Policy gradient method',
      difficulty: 'Advanced',
      color: 'border-purple-500',
    },
  ]
  
  return (
    <div className="space-y-2">
      {algorithms.map(algo => (
        <button
          key={algo.id}
          onClick={() => onChange(algo.id)}
          className={clsx(
            'w-full text-left p-4 rounded-lg border-2 transition-all',
            selected === algo.id
              ? `${algo.color} bg-opacity-10`
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{algo.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{algo.description}</p>
            </div>
            {selected === algo.id && (
              <div className="ml-2 text-primary-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="mt-2">
            <span className={clsx(
              'text-xs px-2 py-1 rounded-full',
              algo.difficulty === 'Beginner' && 'bg-green-100 text-green-800',
              algo.difficulty === 'Intermediate' && 'bg-yellow-100 text-yellow-800',
              algo.difficulty === 'Advanced' && 'bg-red-100 text-red-800'
            )}>
              {algo.difficulty}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}

