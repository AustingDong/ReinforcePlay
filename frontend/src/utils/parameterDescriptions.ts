export const parameterDescriptions = {
  alpha: {
    label: 'Alpha (α)',
    emoji: '📚',
    description: 'Learning rate. Controls how quickly the agent updates its knowledge. Higher = faster learning but less stable. Range: 0.01-1.0',
  },
  gamma: {
    label: 'Gamma (γ)',
    emoji: '🔮',
    description: 'Discount factor. Determines how much the agent values future rewards vs immediate rewards. 0 = only immediate, 1 = future rewards equally important.',
  },
  epsilon: {
    label: 'Epsilon (ε)',
    emoji: '🎲',
    description: 'Exploration rate. Probability of taking random actions to explore. Higher = more exploration, lower = more exploitation. Range: 0-1.',
  },
  n_episodes: {
    label: 'Episodes',
    emoji: '🔄',
    description: 'Number of training episodes. Each episode is one complete run from start to goal (or failure). More episodes = more training time.',
  },
  lambda_: {
    label: 'Lambda (λ)',
    emoji: '⚖️',
    description: 'Eligibility trace decay. Balances between TD and Monte Carlo. 0 = pure TD (one-step), 1 = pure Monte Carlo (full episode).',
  },
  learning_rate: {
    label: 'Learning Rate',
    emoji: '🎯',
    description: 'Policy learning rate. How fast the policy network learns. Too high = unstable, too low = slow learning. Range: 0.0001-0.01.',
  },
  clip_ratio: {
    label: 'Clip Ratio',
    emoji: '✂️',
    description: 'PPO clipping parameter. Limits how much the policy can change in one update. Prevents destructive large updates. Typical: 0.1-0.3.',
  },
  max_kl: {
    label: 'Max KL',
    emoji: '📏',
    description: 'Maximum KL divergence for TRPO. Constrains policy updates to stay within a trust region. Smaller = more conservative updates.',
  },
  entropy_coef: {
    label: 'Entropy Coef',
    emoji: '🌀',
    description: 'Entropy bonus coefficient. Encourages exploration by rewarding diverse actions. Higher = more exploration. Range: 0-0.1.',
  },
  value_coef: {
    label: 'Value Coef',
    emoji: '💎',
    description: 'Value function loss coefficient. Balances actor and critic losses in A2C. Higher = more emphasis on value learning.',
  },
  n_arms: {
    label: 'Machines',
    emoji: '🎰',
    description: 'Number of slot machines (arms). More arms = harder exploration problem. Each machine has a different reward probability.',
  },
  initial_q: {
    label: 'Initial Guess',
    emoji: '💭',
    description: 'Initial Q-value estimate. Starting optimistic (high) encourages exploration. Starting pessimistic (low) encourages exploitation.',
  },
}

export type ParameterKey = keyof typeof parameterDescriptions

