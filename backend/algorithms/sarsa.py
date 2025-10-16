"""
SARSA Algorithm Implementation (On-policy TD Learning)
State-Action-Reward-State-Action
"""
import numpy as np
from typing import List, Dict, Tuple
import asyncio


class SARSAAgent:
    """
    SARSA Agent (On-policy Temporal Difference Learning)
    
    Key difference from Q-Learning:
    - Uses the ACTUAL next action taken (from epsilon-greedy policy)
    - On-policy: learns from the policy it's following
    - More conservative than Q-Learning
    """
    
    def __init__(
        self,
        env,
        alpha: float = 0.1,
        gamma: float = 0.95,
        epsilon: float = 0.1
    ):
        self.env = env
        self.alpha = alpha  # Learning rate
        self.gamma = gamma  # Discount factor
        self.epsilon = epsilon  # Exploration rate
        
        # Q-table: dict of (state, action) -> q_value
        self.q_table: Dict[Tuple, np.ndarray] = {}
        
        # Initialize Q-values
        for y in range(env.height):
            for x in range(env.width):
                state = (y, x)
                self.q_table[state] = np.zeros(4)  # 4 actions
    
    def select_action(self, state: Tuple[int, int]) -> int:
        """Epsilon-greedy action selection"""
        if np.random.random() < self.epsilon:
            return np.random.randint(4)  # Explore
        else:
            return int(np.argmax(self.q_table[state]))  # Exploit
    
    def update(self, state: Tuple, action: int, reward: float, next_state: Tuple, next_action: int, done: bool):
        """
        SARSA update rule:
        Q(s,a) = Q(s,a) + α * (r + γ * Q(s',a') - Q(s,a))
        
        Note: Uses ACTUAL next_action (not max), making it on-policy
        """
        current_q = self.q_table[state][action]
        
        if done:
            target = reward
        else:
            # Key difference: uses Q(s', a') not max Q(s', a)
            target = reward + self.gamma * self.q_table[next_state][next_action]
        
        self.q_table[state][action] = current_q + self.alpha * (target - current_q)
    
    async def run_episode(self, episode_num: int) -> Dict:
        """Run one episode"""
        state = self.env.reset()
        action = self.select_action(state)  # Select initial action
        
        total_reward = 0
        steps = 0
        trajectory = []
        
        max_steps = 1000  # Increased limit to allow longer episodes
        
        while steps < max_steps:
            # Take step
            next_state, reward, done = self.env.step(state, action)
            
            # Select NEXT action (on-policy)
            next_action = self.select_action(next_state)
            
            # Update Q-table using SARSA
            self.update(state, action, reward, next_state, next_action, done)
            
            # Record trajectory
            trajectory.append({
                "state": state,
                "action": action,
                "reward": reward,
                "next_state": next_state
            })
            
            total_reward += reward
            state = next_state
            action = next_action  # Use the selected next action
            steps += 1
            
            if done:
                break
        
        # Simulate delay
        await asyncio.sleep(0.01)
        
        return {
            "episode": episode_num,
            "total_reward": total_reward,
            "steps": steps,
            "trajectory": trajectory,
            "q_table": {str(k): v.tolist() for k, v in self.q_table.items()}
        }


async def simulate_sarsa(
    grid_width: int,
    grid_height: int,
    n_episodes: int,
    alpha: float,
    gamma: float,
    epsilon: float,
    grid_config: List[Dict],
    callback=None
) -> List[Dict]:
    """
    Run SARSA simulation
    """
    # Import GridWorld from qlearning module
    from .qlearning import GridWorld
    
    print(f"[SARSA] Starting simulation with {n_episodes} episodes")
    print(f"[SARSA] Grid: {grid_width}x{grid_height}, {len(grid_config)} cells")
    
    env = GridWorld(grid_width, grid_height, grid_config)
    agent = SARSAAgent(env, alpha, gamma, epsilon)
    
    results = []
    
    for episode in range(n_episodes):
        result = await agent.run_episode(episode)
        results.append(result)
        
        if callback:
            await callback(result)
        
        # Log progress
        if episode % 50 == 0:
            print(f"[SARSA] Episode {episode}/{n_episodes}, Reward: {result['total_reward']:.2f}")
    
    return results


