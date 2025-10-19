"""Configuration for ReinforcePlay Backend"""
import os
from typing import List

class Settings:
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS
    CORS_ORIGINS: List[str] = os.getenv(
        "CORS_ORIGINS", 
        "http://localhost:5173,http://localhost:3000,http://localhost"
    ).split(",")
    
    # If CORS_ORIGINS is "*", allow all
    if CORS_ORIGINS == ["*"]:
        CORS_ORIGINS = ["*"]
    
    # Debug
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

settings = Settings()

