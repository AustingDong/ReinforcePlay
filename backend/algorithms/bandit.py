"""
Multi-Armed Bandit Algorithm Implementation
"""
import numpy as np
from typing import List, Dict, Tuple
import asyncio


class MultiArmedBandit:
    """
    Epsilon-Greedy Multi-Armed Bandit
    
    A bandit problem with k arms, each with a true reward distribution.
    The agent learns to select the best arm using epsilon-greedy exploration.
    """
    
    def __init__(
        self,
        n_arms: int = 5,
        epsilon: float = 0.1,
        initial_q: float = 0.0
    ):
        self.n_arms = n_arms
        self.epsilon = epsilon
        self.initial_q = initial_q
        
        # True reward means (unknown to agent)
        self.true_rewards = np.random.randn(n_arms)
        
        # Agent's estimates
        self.q_values = np.full(n_arms, initial_q)
        self.action_counts = np.zeros(n_arms)
        
    def get_reward(self, arm: int) -> float:
        """
        Get reward from pulling an arm (with Gaussian noise)
        """
        return np.random.normal(self.true_rewards[arm], 1.0)
    
    def select_action(self) -> int:
        """
        Select action using epsilon-greedy policy
        """
        if np.random.random() < self.epsilon:
            # Explore: random action
            return np.random.randint(self.n_arms)
        else:
            # Exploit: best known action
            return int(np.argmax(self.q_values))
    
    def update(self, arm: int, reward: float):
        """
        Update Q-value estimate for the selected arm
        Uses incremental mean update
        """
        self.action_counts[arm] += 1
        # Incremental update: Q(a) = Q(a) + (1/N(a)) * (R - Q(a))
        alpha = 1.0 / self.action_counts[arm]
        self.q_values[arm] += alpha * (reward - self.q_values[arm])
    
    async def run_episode(self, episode: int) -> Dict:
        """
        Run a single episode (one pull)
        Returns episode data for visualization
        """
        # Select arm
        arm = self.select_action()
        
        # Get reward
        reward = self.get_reward(arm)
        
        # Update estimates
        self.update(arm, reward)
        
        # Simulate some delay for visualization
        await asyncio.sleep(0.01)
        
        return {
            "episode": episode,
            "arm_selected": int(arm),
            "reward": float(reward),
            "q_values": self.q_values.tolist(),
            "action_counts": self.action_counts.tolist(),
            "true_rewards": self.true_rewards.tolist(),
            "optimal_arm": int(np.argmax(self.true_rewards)),
            "is_optimal": int(arm) == int(np.argmax(self.true_rewards))
        }


async def simulate_bandit(
    n_arms: int,
    n_episodes: int,
    epsilon: float,
    initial_q: float,
    callback=None
) -> List[Dict]:
    """
    Run full bandit simulation
    
    Args:
        n_arms: Number of arms
        n_episodes: Number of episodes to run
        epsilon: Exploration rate
        initial_q: Initial Q-value estimate
        callback: Optional async callback for streaming updates
        
    Returns:
        List of episode results
    """
    bandit = MultiArmedBandit(n_arms, epsilon, initial_q)
    results = []
    
    for episode in range(n_episodes):
        result = await bandit.run_episode(episode)
        results.append(result)
        
        # Stream update if callback provided
        if callback:
            await callback(result)
    
    return results

