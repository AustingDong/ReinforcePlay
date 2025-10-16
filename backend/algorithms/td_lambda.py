"""
TD(λ) Learning - Temporal Difference Learning with Eligibility Traces

TD(λ) is a family of algorithms that bridges between:
- TD(0): One-step temporal difference (λ=0)
- Monte Carlo: Full episode return (λ=1)

The λ parameter controls the decay of eligibility traces, allowing
the algorithm to assign credit to recent state-action pairs.

Key Concepts:
- Eligibility Traces: Memory of recently visited state-action pairs
- λ (lambda): Trace decay parameter [0, 1]
  - λ = 0: Only immediate rewards matter (TD(0))
  - λ = 1: All future rewards matter equally (MC)
  - 0 < λ < 1: Exponential decay of credit assignment
- Backward View: Updates all previously visited states using traces
"""

import numpy as np
import asyncio
from typing import Dict, List, Tuple, Callable
from algorithms.qlearning import GridWorld


class TDLambdaAgent:
    """
    TD(λ) Learning Agent with Eligibility Traces
    """
    
    def __init__(
        self,
        env: GridWorld,
        alpha: float = 0.1,
        gamma: float = 0.95,
        lambda_: float = 0.8,
        epsilon: float = 0.1
    ):
        """
        Initialize TD(λ) agent
        
        Args:
            env: GridWorld environment
            alpha: Learning rate (step size)
            gamma: Discount factor
            lambda_: Trace decay parameter (0 = TD(0), 1 = Monte Carlo)
            epsilon: Exploration rate for ε-greedy policy
        """
        self.env = env
        self.alpha = alpha
        self.gamma = gamma
        self.lambda_ = lambda_
        self.epsilon = epsilon
        
        # Initialize Q-table and eligibility traces
        self.q_table = {}
        self.eligibility_traces = {}
        
        # Initialize all state-action pairs
        for y in range(env.height):
            for x in range(env.width):
                state = (y, x)
                if state not in env.obstacles:
                    self.q_table[state] = np.zeros(4)
                    self.eligibility_traces[state] = np.zeros(4)
    
    def select_action(self, state: Tuple[int, int]) -> int:
        """ε-greedy action selection"""
        if np.random.random() < self.epsilon:
            return np.random.randint(4)  # Random action
        else:
            return np.argmax(self.q_table.get(state, np.zeros(4)))  # Greedy action
    
    def reset_traces(self):
        """Reset all eligibility traces to zero (start of new episode)"""
        for state in self.eligibility_traces:
            self.eligibility_traces[state] = np.zeros(4)
    
    def update(self, state: Tuple, action: int, reward: float, next_state: Tuple, next_action: int, done: bool):
        """
        TD(λ) update rule:
        
        1. Calculate TD error: δ = r + γ * Q(s',a') - Q(s,a)
        2. Update eligibility trace: e(s,a) += 1 (accumulating trace)
        3. For all state-action pairs:
           - Q(s,a) += α * δ * e(s,a)
           - e(s,a) *= γ * λ
        
        This is the backward view of TD(λ), which updates all previously
        visited state-action pairs based on their eligibility.
        """
        # Calculate TD error
        current_q = self.q_table[state][action]
        
        if done:
            td_error = reward - current_q
        else:
            next_q = self.q_table[next_state][next_action]
            td_error = reward + self.gamma * next_q - current_q
        
        # Update eligibility trace for current state-action (accumulating trace)
        self.eligibility_traces[state][action] += 1
        
        # Update all state-action pairs using eligibility traces
        for s in self.q_table:
            for a in range(4):
                # Update Q-value proportional to eligibility
                self.q_table[s][a] += self.alpha * td_error * self.eligibility_traces[s][a]
                
                # Decay eligibility trace
                self.eligibility_traces[s][a] *= self.gamma * self.lambda_
    
    async def run_episode(self, episode_num: int) -> Dict:
        """Run one episode with TD(λ)"""
        # Reset eligibility traces at start of episode
        self.reset_traces()
        
        state = self.env.reset()
        total_reward = 0
        steps = 0
        trajectory = []
        
        max_steps = 1000
        
        # Select first action
        action = self.select_action(state)
        
        while steps < max_steps:
            # Take step
            next_state, reward, done = self.env.step(state, action)
            
            # Select next action (SARSA-style)
            next_action = self.select_action(next_state)
            
            # Update Q-values and eligibility traces
            self.update(state, action, reward, next_state, next_action, done)
            
            # Record trajectory
            trajectory.append({
                "state": state,
                "action": int(action),  # Convert numpy int to Python int
                "reward": float(reward),
                "next_state": next_state,
                "eligibility": float(self.eligibility_traces[state][action])
            })
            
            total_reward += reward
            state = next_state
            action = next_action
            steps += 1
            
            if done:
                break
        
        # Simulate delay
        await asyncio.sleep(0.01)
        
        return {
            "episode": int(episode_num),
            "total_reward": float(total_reward),
            "steps": int(steps),
            "trajectory": trajectory,
            "q_values": {str(k): v.tolist() for k, v in self.q_table.items()},
            "avg_eligibility": float(np.mean([np.max(e) for e in self.eligibility_traces.values()]))
        }


async def simulate_td_lambda(
    grid_width: int = 5,
    grid_height: int = 5,
    n_episodes: int = 500,
    alpha: float = 0.1,
    gamma: float = 0.95,
    lambda_: float = 0.8,
    epsilon: float = 0.1,
    grid_config: List[Dict] = None,
    callback: Callable = None
) -> List[Dict]:
    """
    Run TD(λ) simulation
    
    Args:
        grid_width: Width of grid
        grid_height: Height of grid
        n_episodes: Number of episodes to run
        alpha: Learning rate
        gamma: Discount factor
        lambda_: Trace decay parameter (0 = TD(0), 1 = Monte Carlo)
        epsilon: Exploration rate
        grid_config: Grid configuration from frontend
        callback: Async callback for streaming results
    """
    print(f"[TD(λ)] Starting simulation: λ={lambda_}, episodes={n_episodes}")
    
    # Create environment and agent
    env = GridWorld(width=grid_width, height=grid_height, grid_config=grid_config)
    agent = TDLambdaAgent(env, alpha=alpha, gamma=gamma, lambda_=lambda_, epsilon=epsilon)
    
    results = []
    
    for episode in range(n_episodes):
        result = await agent.run_episode(episode)
        results.append(result)
        
        # Stream result via callback
        if callback:
            await callback(result)
        
        # Log progress
        if (episode + 1) % 50 == 0:
            avg_reward = np.mean([r['total_reward'] for r in results[-50:]])
            print(f"[TD(λ)] Episode {episode + 1}/{n_episodes}, Avg Reward: {avg_reward:.2f}")
    
    print(f"[TD(λ)] Simulation complete")
    return results

