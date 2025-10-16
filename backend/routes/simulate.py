"""
Simulation endpoint - runs RL algorithms
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from models import (
    SimulationRequest,
    SimulationResponse,
    AlgorithmType,
    BanditConfig,
    QLearningConfig,
    SARSAConfig,
    TDLambdaConfig,
    REINFORCEConfig,
    A2CConfig,
    TRPOConfig,
    PPOConfig
)
import uuid
import json
import asyncio
from typing import Dict, List
from algorithms import (
    simulate_bandit,
    simulate_qlearning,
    simulate_ppo
)
from algorithms.sarsa import simulate_sarsa
from algorithms.td_lambda import simulate_td_lambda
from algorithms.reinforce import simulate_reinforce
from algorithms.a2c import simulate_a2c
from algorithms.trpo import simulate_trpo

router = APIRouter()

# Store active simulations
active_simulations: Dict[str, Dict] = {}


async def stream_simulation_updates(session_id: str):
    """
    Generator function to stream simulation updates via Server-Sent Events
    """
    try:
        # Send initial status message
        initial_status = {
            'status': 'started',
            'message': 'Simulation initialized',
            'session_id': session_id
        }
        yield f"data: {json.dumps(initial_status)}\n\n"
        
        while session_id in active_simulations:
            sim_data = active_simulations[session_id]
            
            # Check if there are new results
            if sim_data.get('results'):
                result = sim_data['results'].pop(0)
                
                # Format as SSE
                yield f"data: {json.dumps(result)}\n\n"
                
                # Check if completed
                if result.get('episode', 0) >= sim_data.get('total_episodes', 0) - 1:
                    sim_data['status'] = 'completed'
                    yield f"data: {json.dumps({'status': 'completed'})}\n\n"
                    break
            
            # Check if there's an error
            if sim_data.get('status') == 'error':
                error_msg = {'status': 'error', 'error': sim_data.get('error', 'Unknown error')}
                yield f"data: {json.dumps(error_msg)}\n\n"
                break
            
            await asyncio.sleep(0.05)  # Small delay between checks
        
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
    finally:
        # Cleanup
        if session_id in active_simulations:
            del active_simulations[session_id]


async def run_bandit_simulation(session_id: str, config: BanditConfig):
    """Run bandit simulation in background"""
    try:
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'running'
        
        async def callback(result):
            """Callback to store results"""
            if session_id in active_simulations:
                active_simulations[session_id]['results'].append(result)
        
        results = await simulate_bandit(
            n_arms=config.n_arms,
            n_episodes=config.n_episodes,
            epsilon=config.epsilon,
            initial_q=config.initial_q,
            callback=callback
        )
        
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'completed'
            active_simulations[session_id]['all_results'] = results
        
    except Exception as e:
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'error'
            active_simulations[session_id]['error'] = str(e)


async def run_qlearning_simulation(session_id: str, config: QLearningConfig):
    """Run Q-Learning simulation in background"""
    try:
        print(f"[Q-Learning] Starting simulation {session_id} with {config.n_episodes} episodes")
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'running'
        
        async def callback(result):
            if session_id in active_simulations:
                active_simulations[session_id]['results'].append(result)
                print(f"[Q-Learning] Episode {result.get('episode', '?')} completed")
        
        results = await simulate_qlearning(
            grid_width=config.grid_width,
            grid_height=config.grid_height,
            n_episodes=config.n_episodes,
            alpha=config.alpha,
            gamma=config.gamma,
            epsilon=config.epsilon,
            grid_config=config.grid,
            callback=callback
        )
        
        print(f"[Q-Learning] Simulation {session_id} completed with {len(results)} episodes")
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'completed'
            active_simulations[session_id]['all_results'] = results
        
    except Exception as e:
        print(f"[Q-Learning] ERROR in simulation {session_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'error'
            active_simulations[session_id]['error'] = str(e)


async def run_sarsa_simulation(session_id: str, config: SARSAConfig):
    """Run SARSA simulation in background"""
    try:
        print(f"[SARSA] Starting simulation {session_id}")
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'running'
        
        async def callback(result):
            if session_id in active_simulations:
                active_simulations[session_id]['results'].append(result)
        
        results = await simulate_sarsa(
            grid_width=config.grid_width,
            grid_height=config.grid_height,
            n_episodes=config.n_episodes,
            alpha=config.alpha,
            gamma=config.gamma,
            epsilon=config.epsilon,
            grid_config=config.grid,
            callback=callback
        )
        
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'completed'
            active_simulations[session_id]['all_results'] = results
        
    except Exception as e:
        print(f"[SARSA] ERROR: {str(e)}")
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'error'
            active_simulations[session_id]['error'] = str(e)


async def run_td_lambda_simulation(session_id: str, config: TDLambdaConfig):
    """Run TD(λ) simulation in background"""
    try:
        print(f"[TD(λ)] Starting simulation {session_id}, λ={config.lambda_}")
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'running'
        
        async def callback(result):
            if session_id in active_simulations:
                active_simulations[session_id]['results'].append(result)
        
        results = await simulate_td_lambda(
            grid_width=config.grid_width,
            grid_height=config.grid_height,
            n_episodes=config.n_episodes,
            alpha=config.alpha,
            gamma=config.gamma,
            lambda_=config.lambda_,
            epsilon=config.epsilon,
            grid_config=config.grid,
            callback=callback
        )
        
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'completed'
            active_simulations[session_id]['all_results'] = results
        
    except Exception as e:
        print(f"[TD(λ)] ERROR: {str(e)}")
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'error'
            active_simulations[session_id]['error'] = str(e)


async def run_reinforce_simulation(session_id: str, config: REINFORCEConfig):
    """Run REINFORCE simulation in background"""
    try:
        print(f"[REINFORCE] Starting simulation {session_id}")
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'running'
        
        async def callback(result):
            if session_id in active_simulations:
                active_simulations[session_id]['results'].append(result)
        
        results = await simulate_reinforce(
            grid_width=config.grid_width,
            grid_height=config.grid_height,
            n_episodes=config.n_episodes,
            learning_rate=config.learning_rate,
            gamma=config.gamma,
            grid_config=config.grid,
            callback=callback
        )
        
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'completed'
            active_simulations[session_id]['all_results'] = results
        
    except Exception as e:
        print(f"[REINFORCE] ERROR: {str(e)}")
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'error'
            active_simulations[session_id]['error'] = str(e)


async def run_a2c_simulation(session_id: str, config: A2CConfig):
    """Run A2C simulation in background"""
    try:
        print(f"[A2C] Starting simulation {session_id}")
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'running'
        
        async def callback(result):
            if session_id in active_simulations:
                active_simulations[session_id]['results'].append(result)
        
        results = await simulate_a2c(
            grid_width=config.grid_width,
            grid_height=config.grid_height,
            n_episodes=config.n_episodes,
            learning_rate=config.learning_rate,
            gamma=config.gamma,
            entropy_coef=config.entropy_coef,
            value_coef=config.value_coef,
            grid_config=config.grid,
            callback=callback
        )
        
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'completed'
            active_simulations[session_id]['all_results'] = results
        
    except Exception as e:
        print(f"[A2C] ERROR: {str(e)}")
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'error'
            active_simulations[session_id]['error'] = str(e)


async def run_trpo_simulation(session_id: str, config: TRPOConfig):
    """Run TRPO simulation in background"""
    try:
        print(f"[TRPO] Starting simulation {session_id}")
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'running'
        
        async def callback(result):
            if session_id in active_simulations:
                active_simulations[session_id]['results'].append(result)
        
        results = await simulate_trpo(
            grid_width=config.grid_width,
            grid_height=config.grid_height,
            n_episodes=config.n_episodes,
            learning_rate=config.learning_rate,
            gamma=config.gamma,
            max_kl=config.max_kl,
            grid_config=config.grid,
            callback=callback
        )
        
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'completed'
            active_simulations[session_id]['all_results'] = results
        
    except Exception as e:
        print(f"[TRPO] ERROR: {str(e)}")
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'error'
            active_simulations[session_id]['error'] = str(e)


async def run_ppo_simulation(session_id: str, config: PPOConfig):
    """Run PPO simulation in background"""
    try:
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'running'
        
        async def callback(result):
            if session_id in active_simulations:
                active_simulations[session_id]['results'].append(result)
        
        results = await simulate_ppo(
            grid_width=config.grid_width,
            grid_height=config.grid_height,
            n_episodes=config.n_episodes,
            learning_rate=config.learning_rate,
            gamma=config.gamma,
            grid_config=config.grid,
            callback=callback
        )
        
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'completed'
            active_simulations[session_id]['all_results'] = results
        
    except Exception as e:
        if session_id in active_simulations:
            active_simulations[session_id]['status'] = 'error'
            active_simulations[session_id]['error'] = str(e)


@router.post("/simulate", response_model=SimulationResponse)
async def start_simulation(
    request: SimulationRequest,
    background_tasks: BackgroundTasks
):
    """
    Start a new RL simulation
    
    Returns session ID for tracking progress
    """
    session_id = request.session_id or str(uuid.uuid4())
    
    try:
        # Parse config based on algorithm type
        if request.algorithm == AlgorithmType.BANDIT:
            config = BanditConfig(**request.config)
            total_episodes = config.n_episodes
            
            # Initialize simulation state
            active_simulations[session_id] = {
                'algorithm': 'bandit',
                'status': 'started',
                'results': [],
                'total_episodes': total_episodes
            }
            
            # Start simulation in background
            background_tasks.add_task(run_bandit_simulation, session_id, config)
            
        elif request.algorithm == AlgorithmType.QLEARNING:
            config = QLearningConfig(**request.config)
            total_episodes = config.n_episodes
            
            print(f"[API] Starting Q-Learning simulation {session_id}")
            print(f"[API] Config: {config.n_episodes} episodes, grid {config.grid_width}x{config.grid_height}")
            print(f"[API] Grid cells: {len(config.grid)} cells")
            
            active_simulations[session_id] = {
                'algorithm': 'qlearning',
                'status': 'started',
                'results': [],
                'total_episodes': total_episodes
            }
            
            background_tasks.add_task(run_qlearning_simulation, session_id, config)
            
        elif request.algorithm == AlgorithmType.SARSA:
            config = SARSAConfig(**request.config)
            total_episodes = config.n_episodes
            
            active_simulations[session_id] = {
                'algorithm': 'sarsa',
                'status': 'started',
                'results': [],
                'total_episodes': total_episodes
            }
            
            background_tasks.add_task(run_sarsa_simulation, session_id, config)
            
        elif request.algorithm == AlgorithmType.TD_LAMBDA:
            config = TDLambdaConfig(**request.config)
            total_episodes = config.n_episodes
            
            active_simulations[session_id] = {
                'algorithm': 'td_lambda',
                'status': 'started',
                'results': [],
                'total_episodes': total_episodes
            }
            
            background_tasks.add_task(run_td_lambda_simulation, session_id, config)
            
        elif request.algorithm == AlgorithmType.REINFORCE:
            config = REINFORCEConfig(**request.config)
            total_episodes = config.n_episodes
            
            active_simulations[session_id] = {
                'algorithm': 'reinforce',
                'status': 'started',
                'results': [],
                'total_episodes': total_episodes
            }
            
            background_tasks.add_task(run_reinforce_simulation, session_id, config)
            
        elif request.algorithm == AlgorithmType.A2C:
            config = A2CConfig(**request.config)
            total_episodes = config.n_episodes
            
            active_simulations[session_id] = {
                'algorithm': 'a2c',
                'status': 'started',
                'results': [],
                'total_episodes': total_episodes
            }
            
            background_tasks.add_task(run_a2c_simulation, session_id, config)
            
        elif request.algorithm == AlgorithmType.TRPO:
            config = TRPOConfig(**request.config)
            total_episodes = config.n_episodes
            
            active_simulations[session_id] = {
                'algorithm': 'trpo',
                'status': 'started',
                'results': [],
                'total_episodes': total_episodes
            }
            
            background_tasks.add_task(run_trpo_simulation, session_id, config)
            
        elif request.algorithm == AlgorithmType.PPO:
            config = PPOConfig(**request.config)
            total_episodes = config.n_episodes
            
            active_simulations[session_id] = {
                'algorithm': 'ppo',
                'status': 'started',
                'results': [],
                'total_episodes': total_episodes
            }
            
            background_tasks.add_task(run_ppo_simulation, session_id, config)
            
        else:
            raise HTTPException(status_code=400, detail="Unsupported algorithm")
        
        return SimulationResponse(
            session_id=session_id,
            status="started",
            message=f"Simulation started with {request.algorithm}",
            total_episodes=total_episodes
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/simulate/stream/{session_id}")
async def stream_simulation(session_id: str):
    """
    Stream simulation updates via Server-Sent Events (SSE)
    """
    if session_id not in active_simulations:
        print(f"[SSE] ERROR: Session {session_id} not found")
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    print(f"[SSE] Starting stream for session {session_id}")
    
    return StreamingResponse(
        stream_simulation_updates(session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        }
    )


@router.get("/simulate/status/{session_id}")
async def get_simulation_status(session_id: str):
    """
    Get current status of a simulation
    """
    if session_id not in active_simulations:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    sim_data = active_simulations[session_id]
    
    return {
        "session_id": session_id,
        "status": sim_data.get('status'),
        "algorithm": sim_data.get('algorithm'),
        "total_episodes": sim_data.get('total_episodes', 0),
        "error": sim_data.get('error')
    }

