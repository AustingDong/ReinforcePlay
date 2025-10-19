"""
FastAPI Backend for ReinforcePlay - Interactive RL Learning Platform
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import simulate, progress
from config import settings

app = FastAPI(
    title="ReinforcePlay API",
    description="Backend API for Interactive Reinforcement Learning Education",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(simulate.router, prefix="/api", tags=["simulation"])
app.include_router(progress.router, prefix="/api", tags=["progress"])


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "ReinforcePlay API is running",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "algorithms": [
            "bandit",
            "qlearning", 
            "sarsa",
            "td_lambda",
            "reinforce",
            "a2c",
            "trpo",
            "ppo"
        ],
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host=settings.HOST, 
        port=settings.PORT, 
        reload=settings.DEBUG
    )

