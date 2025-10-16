"""
REINFORCE Algorithm Implementation (Monte Carlo Policy Gradient)
The foundational policy gradient method (Williams, 1992)
"""
import numpy as np
from typing import List, Dict, Tuple
import asyncio


class REINFORCEAgent:
    """
    REINFORCE Agent (Monte Carlo Policy Gradient)
    
    Key features:
    - Learns policy directly (not value function)
    - Uses complete episode returns (Monte Carlo)
    - Foundation for modern policy gradient methods
    """
    
    def __init__(
        self,
        env,
        learning_rate: float = 0.001,
        gamma: float = 0.99
    ):
        self.env = env
        self.learning_rate = learning_rate
        self.gamma = gamma
        
        # Policy parameters: softmax over action preferences
        state_dim = env.width * env.height
        action_dim = 4
        self.policy_weights = np.random.randn(state_dim, action_dim) * 0.1
        
        # Episode buffer
        self.episode_states = []
        self.episode_actions = []
        self.episode_rewards = []
    
    def state_to_features(self, state: Tuple[int, int]) -> np.ndarray:
        """Convert state to feature vector (one-hot encoding)"""
        features = np.zeros(self.env.width * self.env.height)
        y, x = state
        idx = y * self.env.width + x
        if idx < len(features):
            features[idx] = 1.0
        return features
    
    def get_action_probs(self, state_features: np.ndarray) -> np.ndarray:
        """Get action probabilities from policy"""
        logits = state_features @ self.policy_weights
        exp_logits = np.exp(logits - np.max(logits))
        probs = exp_logits / np.sum(exp_logits)
        return probs
    
    def select_action(self, state: Tuple[int, int]) -> Tuple[int, np.ndarray]:
        """Sample action from policy and return features"""
        features = self.state_to_features(state)
        probs = self.get_action_probs(features)
        action = np.random.choice(4, p=probs)
        
        # Store for training
        self.episode_states.append(features)
        self.episode_actions.append(action)
        
        return action, probs
    
    def store_reward(self, reward: float):
        """Store reward for current step"""
        self.episode_rewards.append(reward)
    
    def update_policy(self):
        """
        Update policy using REINFORCE algorithm:
        θ ← θ + α * ∇_θ log π_θ(a|s) * G_t
        
        Where G_t is the discounted return from time t
        """
        if len(self.episode_rewards) == 0:
            return
        
        # Compute returns (discounted cumulative rewards)
        returns = []
        G = 0
        for r in reversed(self.episode_rewards):
            G = r + self.gamma * G
            returns.insert(0, G)
        returns = np.array(returns)
        
        # Normalize returns (reduce variance)
        if len(returns) > 1:
            returns = (returns - np.mean(returns)) / (np.std(returns) + 1e-8)
        
        # Policy gradient update
        for state_features, action, G in zip(self.episode_states, self.episode_actions, returns):
            # Get current action probabilities
            probs = self.get_action_probs(state_features)
            
            # Compute gradient of log probability
            # ∇ log π(a|s) = (1(a=a_t) - π(a|s)) * state_features
            grad_log_prob = np.zeros_like(self.policy_weights)
            for a in range(4):
                indicator = 1.0 if a == action else 0.0
                grad_log_prob[:, a] = (indicator - probs[a]) * state_features
            
            # Update: θ ← θ + α * ∇ log π(a|s) * G
            self.policy_weights += self.learning_rate * grad_log_prob * G
        
        # Clear episode buffer
        self.episode_states = []
        self.episode_actions = []
        self.episode_rewards = []
    
    async def run_episode(self, episode_num: int) -> Dict:
        """Run one episode"""
        state = self.env.reset()
        total_reward = 0
        steps = 0
        trajectory = []
        
        max_steps = 1000  # Increased limit to allow longer episodes
        
        while steps < max_steps:
            action, probs = self.select_action(state)
            next_state, reward, done = self.env.step(state, action)
            
            self.store_reward(reward)
            
            trajectory.append({
                "state": state,
                "action": action,
                "reward": reward,
                "next_state": next_state,
                "action_probs": probs.tolist()
            })
            
            total_reward += reward
            state = next_state
            steps += 1
            
            if done:
                break
        
        # Update policy after episode (Monte Carlo)
        self.update_policy()
        
        await asyncio.sleep(0.01)
        
        return {
            "episode": episode_num,
            "total_reward": total_reward,
            "steps": steps,
            "trajectory": trajectory
        }


async def simulate_reinforce(
    grid_width: int,
    grid_height: int,
    n_episodes: int,
    learning_rate: float,
    gamma: float,
    grid_config: List[Dict],
    callback=None
) -> List[Dict]:
    """
    Run REINFORCE simulation
    """
    from .qlearning import GridWorld
    
    print(f"[REINFORCE] Starting simulation with {n_episodes} episodes")
    print(f"[REINFORCE] Grid: {grid_width}x{grid_height}")
    
    env = GridWorld(grid_width, grid_height, grid_config)
    agent = REINFORCEAgent(env, learning_rate, gamma)
    
    results = []
    
    for episode in range(n_episodes):
        result = await agent.run_episode(episode)
        results.append(result)
        
        if callback:
            await callback(result)
        
        if episode % 50 == 0:
            print(f"[REINFORCE] Episode {episode}/{n_episodes}, Reward: {result['total_reward']:.2f}")
    
    return results


