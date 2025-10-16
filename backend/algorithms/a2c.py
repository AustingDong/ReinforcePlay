"""
A2C Algorithm Implementation (Advantage Actor-Critic)
Synchronous version of A3C (Mnih et al., 2016)
"""
import numpy as np
from typing import List, Dict, Tuple
import asyncio


class A2CAgent:
    """
    A2C Agent (Advantage Actor-Critic)
    
    Key features:
    - Learns both policy (actor) and value function (critic)
    - Uses advantage: A(s,a) = Q(s,a) - V(s)
    - More stable than REINFORCE due to variance reduction
    - Foundation for PPO and other modern algorithms
    """
    
    def __init__(
        self,
        env,
        learning_rate: float = 0.001,
        gamma: float = 0.99,
        entropy_coef: float = 0.01,
        value_coef: float = 0.5
    ):
        self.env = env
        self.learning_rate = learning_rate
        self.gamma = gamma
        self.entropy_coef = entropy_coef
        self.value_coef = value_coef
        
        state_dim = env.width * env.height
        action_dim = 4
        
        # Actor (policy) network weights
        self.actor_weights = np.random.randn(state_dim, action_dim) * 0.1
        
        # Critic (value function) network weights
        self.critic_weights = np.random.randn(state_dim) * 0.1
        
        # Episode buffer
        self.episode_states = []
        self.episode_actions = []
        self.episode_rewards = []
        self.episode_values = []
    
    def state_to_features(self, state: Tuple[int, int]) -> np.ndarray:
        """Convert state to feature vector"""
        features = np.zeros(self.env.width * self.env.height)
        y, x = state
        idx = y * self.env.width + x
        if idx < len(features):
            features[idx] = 1.0
        return features
    
    def get_action_probs(self, state_features: np.ndarray) -> np.ndarray:
        """Get action probabilities from actor"""
        logits = state_features @ self.actor_weights
        exp_logits = np.exp(logits - np.max(logits))
        probs = exp_logits / np.sum(exp_logits)
        return probs
    
    def get_value(self, state_features: np.ndarray) -> float:
        """Get state value from critic"""
        return float(state_features @ self.critic_weights)
    
    def select_action(self, state: Tuple[int, int]) -> Tuple[int, np.ndarray, float]:
        """Sample action and return features, probs, value"""
        features = self.state_to_features(state)
        probs = self.get_action_probs(features)
        value = self.get_value(features)
        action = np.random.choice(4, p=probs)
        
        # Store for training
        self.episode_states.append(features)
        self.episode_actions.append(action)
        self.episode_values.append(value)
        
        return action, probs, value
    
    def store_reward(self, reward: float):
        """Store reward"""
        self.episode_rewards.append(reward)
    
    def compute_returns_and_advantages(self) -> Tuple[np.ndarray, np.ndarray]:
        """Compute returns and advantages"""
        returns = []
        G = 0
        for r in reversed(self.episode_rewards):
            G = r + self.gamma * G
            returns.insert(0, G)
        returns = np.array(returns)
        
        # Compute advantages: A(s,a) = R - V(s)
        values = np.array(self.episode_values)
        advantages = returns - values
        
        # Normalize advantages (reduce variance)
        if len(advantages) > 1:
            advantages = (advantages - np.mean(advantages)) / (np.std(advantages) + 1e-8)
        
        return returns, advantages
    
    def update(self):
        """
        Update actor and critic using A2C algorithm
        
        Actor loss: -log π(a|s) * A(s,a) - β * H(π)
        Critic loss: MSE(V(s), R)
        """
        if len(self.episode_rewards) == 0:
            return
        
        returns, advantages = self.compute_returns_and_advantages()
        
        # Update both actor and critic
        for state_features, action, advantage, target_return in zip(
            self.episode_states, self.episode_actions, advantages, returns
        ):
            # ===== Update Actor (Policy) =====
            probs = self.get_action_probs(state_features)
            
            # Policy gradient
            grad_log_prob = np.zeros_like(self.actor_weights)
            for a in range(4):
                indicator = 1.0 if a == action else 0.0
                grad_log_prob[:, a] = (indicator - probs[a]) * state_features
            
            # Entropy bonus (encourage exploration)
            entropy_grad = np.zeros_like(self.actor_weights)
            for a in range(4):
                if probs[a] > 0:
                    entropy_grad[:, a] = state_features * (np.log(probs[a]) + 1) * probs[a]
            
            # Actor update: maximize advantage + entropy
            self.actor_weights += self.learning_rate * (
                grad_log_prob * advantage + 
                self.entropy_coef * entropy_grad
            )
            
            # ===== Update Critic (Value Function) =====
            current_value = self.get_value(state_features)
            value_error = target_return - current_value
            
            # Critic update: minimize value error
            self.critic_weights += self.learning_rate * self.value_coef * value_error * state_features
        
        # Clear episode buffer
        self.episode_states = []
        self.episode_actions = []
        self.episode_rewards = []
        self.episode_values = []
    
    async def run_episode(self, episode_num: int) -> Dict:
        """Run one episode"""
        state = self.env.reset()
        total_reward = 0
        steps = 0
        trajectory = []
        
        max_steps = 1000  # Increased limit to allow longer episodes
        
        while steps < max_steps:
            action, probs, value = self.select_action(state)
            next_state, reward, done = self.env.step(state, action)
            
            self.store_reward(reward)
            
            trajectory.append({
                "state": state,
                "action": action,
                "reward": reward,
                "next_state": next_state,
                "action_probs": probs.tolist(),
                "value": value
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


async def simulate_a2c(
    grid_width: int,
    grid_height: int,
    n_episodes: int,
    learning_rate: float,
    gamma: float,
    entropy_coef: float,
    value_coef: float,
    grid_config: List[Dict],
    callback=None
) -> List[Dict]:
    """
    Run A2C simulation
    """
    from .qlearning import GridWorld
    
    print(f"[A2C] Starting simulation with {n_episodes} episodes")
    print(f"[A2C] Grid: {grid_width}x{grid_height}")
    
    env = GridWorld(grid_width, grid_height, grid_config)
    agent = A2CAgent(env, learning_rate, gamma, entropy_coef, value_coef)
    
    results = []
    
    for episode in range(n_episodes):
        result = await agent.run_episode(episode)
        results.append(result)
        
        if callback:
            await callback(result)
        
        if episode % 50 == 0:
            print(f"[A2C] Episode {episode}/{n_episodes}, Reward: {result['total_reward']:.2f}")
    
    return results


