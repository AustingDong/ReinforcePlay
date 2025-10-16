
"""
Q-Learning Algorithm Implementation for GridWorld
"""
import numpy as np
from typing import List, Dict, Tuple, Optional
import asyncio


class GridWorld:
    """
    Simple GridWorld environment
    """
    
    def __init__(self, width: int = 5, height: int = 5, grid_config: List[Dict] = None):
        self.width = width
        self.height = height
        
        # Initialize grid
        self.grid = np.zeros((height, width))
        self.start_pos = (0, 0)
        self.goal_pos = (height - 1, width - 1)
        self.obstacles = set()
        self.rewards = {}  # Static rewards (goal)
        self.collectible_rewards = {}  # Rewards that can be collected once per episode
        self.available_rewards = {}  # Track which rewards are available this episode
        
        # Parse grid configuration
        if grid_config:
            self._parse_grid_config(grid_config)
        else:
            # Default: goal at bottom-right
            self.rewards[self.goal_pos] = 10.0
    
    def _parse_grid_config(self, grid_config: List[Dict]):
        """Parse grid configuration from frontend"""
        for cell in grid_config:
            # Handle both dict and Pydantic model
            if isinstance(cell, dict):
                x, y = cell['x'], cell['y']
                cell_type = cell['type']
                value = cell.get('value', 0.0)
            else:
                # Pydantic model
                x, y = cell.x, cell.y
                cell_type = cell.type
                value = cell.value
            
            pos = (y, x)
            
            if cell_type == 'start':
                self.start_pos = pos
            elif cell_type == 'goal':
                self.goal_pos = pos
                self.rewards[pos] = value if value != 0 else 10.0
            elif cell_type == 'obstacle':
                self.obstacles.add(pos)
            elif cell_type == 'reward':
                # Collectible rewards - can only be collected once per episode
                self.collectible_rewards[pos] = value if value != 0 else 1.0
    
    def reset(self) -> Tuple[int, int]:
        """Reset to start position and restore all collectible rewards"""
        # Restore collected rewards for new episode
        self.available_rewards = self.collectible_rewards.copy()
        return self.start_pos
    
    def is_terminal(self, state: Tuple[int, int]) -> bool:
        """Check if state is terminal (goal)"""
        return state == self.goal_pos
    
    def step(self, state: Tuple[int, int], action: int) -> Tuple[Tuple[int, int], float, bool]:
        """
        Take action from state
        Actions: 0=up, 1=right, 2=down, 3=left
        
        Returns: (next_state, reward, done)
        """
        y, x = state
        
        # Calculate intended next position
        next_y, next_x = y, x
        if action == 0:  # up
            next_y = y - 1
        elif action == 1:  # right
            next_x = x + 1
        elif action == 2:  # down
            next_y = y + 1
        elif action == 3:  # left
            next_x = x - 1
        
        # Check if hitting border
        hit_border = (next_y < 0 or next_y >= self.height or 
                     next_x < 0 or next_x >= self.width)
        
        if hit_border:
            # Stay in place and penalize
            next_state = state
            reward = -1.0
        else:
            # Clip to valid bounds (safety check)
            next_y = max(0, min(self.height - 1, next_y))
            next_x = max(0, min(self.width - 1, next_x))
            next_state = (next_y, next_x)
            
            # Check obstacles
            if next_state in self.obstacles:
                next_state = state  # Stay in place
                reward = -1.0
            else:
                # Check for static rewards (goal)
                if next_state in self.rewards:
                    reward = self.rewards[next_state]
                # Check for collectible rewards (only once)
                elif next_state in self.available_rewards:
                    reward = self.available_rewards[next_state]
                    del self.available_rewards[next_state]  # Remove after collection
                else:
                    reward = -0.1  # Small negative reward for each step
        
        done = self.is_terminal(next_state)
        
        return next_state, reward, done


class QLearningAgent:
    """
    Q-Learning Agent
    """
    
    def __init__(
        self,
        env: GridWorld,
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
    
    def update(self, state: Tuple, action: int, reward: float, next_state: Tuple, done: bool):
        """
        Q-Learning update rule:
        Q(s,a) = Q(s,a) + α * (r + γ * max(Q(s',a')) - Q(s,a))
        """
        current_q = self.q_table[state][action]
        
        if done:
            target = reward
        else:
            target = reward + self.gamma * np.max(self.q_table[next_state])
        
        self.q_table[state][action] = current_q + self.alpha * (target - current_q)
    
    async def run_episode(self, episode_num: int) -> Dict:
        """Run one episode"""
        state = self.env.reset()
        total_reward = 0
        steps = 0
        trajectory = []
        
        max_steps = 1000  # Increased limit to allow longer episodes
        
        while steps < max_steps:
            # Select action
            action = self.select_action(state)
            
            # Take step
            next_state, reward, done = self.env.step(state, action)
            
            # Update Q-table
            self.update(state, action, reward, next_state, done)
            
            # Record trajectory
            trajectory.append({
                "state": state,
                "action": action,
                "reward": reward,
                "next_state": next_state
            })
            
            total_reward += reward
            state = next_state
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


async def simulate_qlearning(
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
    Run Q-Learning simulation
    """
    env = GridWorld(grid_width, grid_height, grid_config)
    agent = QLearningAgent(env, alpha, gamma, epsilon)
    
    results = []
    
    for episode in range(n_episodes):
        result = await agent.run_episode(episode)
        results.append(result)
        
        if callback:
            await callback(result)
    
    return results

