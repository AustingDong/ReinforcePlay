"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal
from enum import Enum


class AlgorithmType(str, Enum):
    """Supported RL algorithms"""
    # Bandits
    BANDIT = "bandit"
    
    # Value-based
    QLEARNING = "qlearning"  # Off-policy
    SARSA = "sarsa"  # On-policy
    TD_LAMBDA = "td_lambda"  # On-policy with eligibility traces
    DQN = "dqn"  # Off-policy
    DDQN = "ddqn"  # Off-policy
    
    # Policy Gradient (On-policy) - ordered by timeline
    REINFORCE = "reinforce"
    A2C = "a2c"
    TRPO = "trpo"
    PPO = "ppo"
    
    # Actor-Critic (Off-policy)
    SAC = "sac"


class GridCell(BaseModel):
    """Represents a cell in the grid world"""
    x: int
    y: int
    type: Literal["empty", "obstacle", "reward", "goal", "start"]
    value: float = 0.0


class BanditConfig(BaseModel):
    """Configuration for Multi-Armed Bandit"""
    n_arms: int = Field(default=5, ge=2, le=20)
    n_episodes: int = Field(default=1000, ge=10, le=10000)
    epsilon: float = Field(default=0.1, ge=0.0, le=1.0)
    initial_q: float = Field(default=0.0)


class QLearningConfig(BaseModel):
    """Configuration for Q-Learning"""
    grid_width: int = Field(default=5, ge=3, le=20)
    grid_height: int = Field(default=5, ge=3, le=20)
    n_episodes: int = Field(default=500, ge=10, le=5000)
    alpha: float = Field(default=0.1, ge=0.0, le=1.0, description="Learning rate")
    gamma: float = Field(default=0.95, ge=0.0, le=1.0, description="Discount factor")
    epsilon: float = Field(default=0.1, ge=0.0, le=1.0, description="Exploration rate")
    grid: List[GridCell] = Field(default_factory=list)


class SARSAConfig(BaseModel):
    """Configuration for SARSA (On-policy TD Learning)"""
    grid_width: int = Field(default=5, ge=3, le=20)
    grid_height: int = Field(default=5, ge=3, le=20)
    n_episodes: int = Field(default=500, ge=10, le=5000)
    alpha: float = Field(default=0.1, ge=0.0, le=1.0, description="Learning rate")
    gamma: float = Field(default=0.95, ge=0.0, le=1.0, description="Discount factor")
    epsilon: float = Field(default=0.1, ge=0.0, le=1.0, description="Exploration rate")
    grid: List[GridCell] = Field(default_factory=list)


class TDLambdaConfig(BaseModel):
    """Configuration for TD(λ) with Eligibility Traces"""
    grid_width: int = Field(default=5, ge=3, le=20)
    grid_height: int = Field(default=5, ge=3, le=20)
    n_episodes: int = Field(default=500, ge=10, le=5000)
    alpha: float = Field(default=0.1, ge=0.0, le=1.0, description="Learning rate")
    gamma: float = Field(default=0.95, ge=0.0, le=1.0, description="Discount factor")
    lambda_: float = Field(default=0.8, ge=0.0, le=1.0, description="Trace decay (0=TD(0), 1=MC)")
    epsilon: float = Field(default=0.1, ge=0.0, le=1.0, description="Exploration rate")
    grid: List[GridCell] = Field(default_factory=list)


class DQNConfig(BaseModel):
    """Configuration for DQN (Deep Q-Network)"""
    grid_width: int = Field(default=5, ge=3, le=20)
    grid_height: int = Field(default=5, ge=3, le=20)
    n_episodes: int = Field(default=300, ge=10, le=3000)
    learning_rate: float = Field(default=0.001, ge=0.0001, le=0.01)
    gamma: float = Field(default=0.99, ge=0.0, le=1.0)
    epsilon_start: float = Field(default=1.0, ge=0.0, le=1.0)
    epsilon_end: float = Field(default=0.01, ge=0.0, le=1.0)
    epsilon_decay: float = Field(default=0.995, ge=0.9, le=0.999)
    batch_size: int = Field(default=32, ge=8, le=128)
    memory_size: int = Field(default=1000, ge=100, le=10000)
    target_update: int = Field(default=10, ge=1, le=100)
    grid: List[GridCell] = Field(default_factory=list)


class REINFORCEConfig(BaseModel):
    """Configuration for REINFORCE (Monte Carlo Policy Gradient)"""
    grid_width: int = Field(default=5, ge=3, le=20)
    grid_height: int = Field(default=5, ge=3, le=20)
    n_episodes: int = Field(default=300, ge=10, le=3000)
    learning_rate: float = Field(default=0.001, ge=0.0001, le=0.01)
    gamma: float = Field(default=0.99, ge=0.0, le=1.0)
    grid: List[GridCell] = Field(default_factory=list)


class A2CConfig(BaseModel):
    """Configuration for A2C (Advantage Actor-Critic)"""
    grid_width: int = Field(default=5, ge=3, le=20)
    grid_height: int = Field(default=5, ge=3, le=20)
    n_episodes: int = Field(default=300, ge=10, le=3000)
    learning_rate: float = Field(default=0.001, ge=0.0001, le=0.01)
    gamma: float = Field(default=0.99, ge=0.0, le=1.0)
    entropy_coef: float = Field(default=0.01, ge=0.0, le=0.1)
    value_coef: float = Field(default=0.5, ge=0.1, le=1.0)
    grid: List[GridCell] = Field(default_factory=list)


class TRPOConfig(BaseModel):
    """Configuration for TRPO (Trust Region Policy Optimization)"""
    grid_width: int = Field(default=5, ge=3, le=20)
    grid_height: int = Field(default=5, ge=3, le=20)
    n_episodes: int = Field(default=200, ge=10, le=2000)
    learning_rate: float = Field(default=0.001, ge=0.0001, le=0.01)
    gamma: float = Field(default=0.99, ge=0.0, le=1.0)
    max_kl: float = Field(default=0.01, ge=0.001, le=0.1, description="Max KL divergence")
    grid: List[GridCell] = Field(default_factory=list)


class PPOConfig(BaseModel):
    """Configuration for PPO (Proximal Policy Optimization)"""
    grid_width: int = Field(default=5, ge=3, le=20)
    grid_height: int = Field(default=5, ge=3, le=20)
    n_episodes: int = Field(default=200, ge=10, le=2000)
    learning_rate: float = Field(default=0.0003, ge=0.0001, le=0.01)
    gamma: float = Field(default=0.99, ge=0.0, le=1.0)
    clip_ratio: float = Field(default=0.2, ge=0.1, le=0.5)
    grid: List[GridCell] = Field(default_factory=list)


class SACConfig(BaseModel):
    """Configuration for SAC (Soft Actor-Critic)"""
    grid_width: int = Field(default=5, ge=3, le=20)
    grid_height: int = Field(default=5, ge=3, le=20)
    n_episodes: int = Field(default=200, ge=10, le=2000)
    learning_rate: float = Field(default=0.0003, ge=0.0001, le=0.01)
    gamma: float = Field(default=0.99, ge=0.0, le=1.0)
    tau: float = Field(default=0.005, ge=0.001, le=0.1, description="Soft update coefficient")
    alpha: float = Field(default=0.2, ge=0.0, le=1.0, description="Temperature parameter")
    grid: List[GridCell] = Field(default_factory=list)


class SimulationRequest(BaseModel):
    """Request to run a simulation"""
    algorithm: AlgorithmType
    config: Dict  # Will be parsed based on algorithm type
    session_id: Optional[str] = None


class EpisodeUpdate(BaseModel):
    """Update from a single episode"""
    episode: int
    total_reward: float
    steps: int
    q_values: Optional[Dict[str, float]] = None
    policy: Optional[Dict[str, List[float]]] = None
    trajectory: Optional[List[Dict]] = None


class SimulationResponse(BaseModel):
    """Response from simulation endpoint"""
    session_id: str
    status: Literal["started", "running", "completed", "error"]
    message: str
    total_episodes: int


class ProgressUpdate(BaseModel):
    """Real-time progress update"""
    session_id: str
    episode: int
    total_episodes: int
    reward: float
    cumulative_rewards: List[float]
    q_table: Optional[Dict] = None
    current_state: Optional[Dict] = None
    is_complete: bool

