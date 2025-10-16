"""
TRPO Algorithm Implementation (Trust Region Policy Optimization)
Schulman et al., 2015
"""
import numpy as np
from typing import List, Dict, Tuple
import asyncio


class TRPOAgent:
    """
    TRPO Agent (Trust Region Policy Optimization)
    
    Key features:
    - Constrains policy updates to a trust region using KL divergence
    - Guarantees monotonic improvement
    - More complex than PPO but theoretically sound
    - Foundation for PPO's clipping approach
    """
    
    def __init__(
        self,
        env,
        learning_rate: float = 0.001,
        gamma: float = 0.99,
        max_kl: float = 0.01
    ):
        self.env = env
        self.learning_rate = learning_rate
        self.gamma = gamma
        self.max_kl = max_kl  # Maximum KL divergence for trust region
        
        state_dim = env.width * env.height
        action_dim = 4
        
        # Policy network (actor)
        self.policy_weights = np.random.randn(state_dim, action_dim) * 0.1
        self.old_policy_weights = self.policy_weights.copy()
        
        # Value network (critic)
        self.value_weights = np.random.randn(state_dim) * 0.1
        
        # Episode buffer
        self.episode_states = []
        self.episode_actions = []
        self.episode_rewards = []
        self.episode_old_probs = []
    
    def state_to_features(self, state: Tuple[int, int]) -> np.ndarray:
        """Convert state to feature vector"""
        features = np.zeros(self.env.width * self.env.height)
        y, x = state
        idx = y * self.env.width + x
        if idx < len(features):
            features[idx] = 1.0
        return features
    
    def get_action_probs(self, state_features: np.ndarray, weights: np.ndarray = None) -> np.ndarray:
        """Get action probabilities from policy"""
        if weights is None:
            weights = self.policy_weights
        logits = state_features @ weights
        exp_logits = np.exp(logits - np.max(logits))
        probs = exp_logits / np.sum(exp_logits)
        return probs
    
    def get_value(self, state_features: np.ndarray) -> float:
        """Get state value from critic"""
        return float(state_features @ self.value_weights)
    
    def compute_kl_divergence(self, state_features: np.ndarray, old_probs: np.ndarray) -> float:
        """Compute KL divergence between old and new policies"""
        new_probs = self.get_action_probs(state_features)
        # KL(old || new) = sum(old * log(old / new))
        kl = np.sum(old_probs * np.log((old_probs + 1e-10) / (new_probs + 1e-10)))
        return float(kl)
    
    def select_action(self, state: Tuple[int, int]) -> Tuple[int, np.ndarray]:
        """Sample action and store old probabilities"""
        features = self.state_to_features(state)
        old_probs = self.get_action_probs(features, self.old_policy_weights)
        probs = self.get_action_probs(features)
        action = np.random.choice(4, p=probs)
        
        # Store for training
        self.episode_states.append(features)
        self.episode_actions.append(action)
        self.episode_old_probs.append(old_probs)
        
        return action, probs
    
    def store_reward(self, reward: float):
        """Store reward"""
        self.episode_rewards.append(reward)
    
    def compute_advantages(self) -> Tuple[np.ndarray, np.ndarray]:
        """Compute returns and advantages"""
        returns = []
        G = 0
        for r in reversed(self.episode_rewards):
            G = r + self.gamma * G
            returns.insert(0, G)
        returns = np.array(returns)
        
        # Compute advantages using value function
        values = np.array([self.get_value(s) for s in self.episode_states])
        advantages = returns - values
        
        # Normalize advantages
        if len(advantages) > 1:
            advantages = (advantages - np.mean(advantages)) / (np.std(advantages) + 1e-8)
        
        return returns, advantages
    
    def update(self):
        """
        TRPO Update with KL constraint
        
        In full TRPO, this would use:
        1. Conjugate gradient to compute search direction
        2. Line search to find step size within trust region
        
        This is a simplified version that approximates TRPO's behavior
        """
        if len(self.episode_rewards) == 0:
            return
        
        returns, advantages = self.compute_advantages()
        
        # Store old policy for KL constraint
        self.old_policy_weights = self.policy_weights.copy()
        
        # ===== Update Policy (with KL constraint) =====
        policy_gradient = np.zeros_like(self.policy_weights)
        mean_kl = 0
        
        for state_features, action, advantage, old_probs in zip(
            self.episode_states, self.episode_actions, advantages, self.episode_old_probs
        ):
            # Current policy probabilities
            probs = self.get_action_probs(state_features)
            
            # Importance sampling ratio
            ratio = probs[action] / (old_probs[action] + 1e-10)
            
            # Policy gradient with importance sampling
            grad_log_prob = np.zeros_like(self.policy_weights)
            for a in range(4):
                indicator = 1.0 if a == action else 0.0
                grad_log_prob[:, a] = (indicator - probs[a]) * state_features
            
            policy_gradient += grad_log_prob * advantage * ratio
            
            # Compute KL for monitoring
            kl = self.compute_kl_divergence(state_features, old_probs)
            mean_kl += kl
        
        mean_kl /= len(self.episode_states)
        
        # Adaptive step size based on KL divergence
        # If KL is too large, reduce step size (trust region constraint)
        if mean_kl > self.max_kl:
            step_size = self.learning_rate * (self.max_kl / (mean_kl + 1e-10))
        else:
            step_size = self.learning_rate
        
        # Update policy with adaptive step
        self.policy_weights += step_size * policy_gradient
        
        # ===== Update Value Function =====
        for state_features, target_return in zip(self.episode_states, returns):
            current_value = self.get_value(state_features)
            value_error = target_return - current_value
            
            # Value function gradient descent
            self.value_weights += self.learning_rate * value_error * state_features
        
        # Clear episode buffer
        self.episode_states = []
        self.episode_actions = []
        self.episode_rewards = []
        self.episode_old_probs = []
    
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
        
        # Update after episode
        self.update()
        
        await asyncio.sleep(0.01)
        
        return {
            "episode": episode_num,
            "total_reward": total_reward,
            "steps": steps,
            "trajectory": trajectory
        }


async def simulate_trpo(
    grid_width: int,
    grid_height: int,
    n_episodes: int,
    learning_rate: float,
    gamma: float,
    max_kl: float,
    grid_config: List[Dict],
    callback=None
) -> List[Dict]:
    """
    Run TRPO simulation
    """
    from .qlearning import GridWorld
    
    print(f"[TRPO] Starting simulation with {n_episodes} episodes")
    print(f"[TRPO] Grid: {grid_width}x{grid_height}")
    print(f"[TRPO] Max KL divergence: {max_kl}")
    
    env = GridWorld(grid_width, grid_height, grid_config)
    agent = TRPOAgent(env, learning_rate, gamma, max_kl)
    
    results = []
    
    for episode in range(n_episodes):
        result = await agent.run_episode(episode)
        results.append(result)
        
        if callback:
            await callback(result)
        
        if episode % 50 == 0:
            print(f"[TRPO] Episode {episode}/{n_episodes}, Reward: {result['total_reward']:.2f}")
    
    return results

