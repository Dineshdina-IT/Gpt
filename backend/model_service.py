import sys
from pathlib import Path
import logging

# Configure logging
logger = logging.getLogger("backend.model_service")

# Resolve absolute path to the mini-Gpt directory
BACKEND_DIR = Path(__file__).resolve().parent
WORKSPACE_DIR = BACKEND_DIR.parent
MINI_GPT_DIR = WORKSPACE_DIR / "mini-Gpt"

# Dynamically add mini-Gpt to sys.path to allow imports from it
if str(MINI_GPT_DIR) not in sys.path:
    logger.info(f"Adding {MINI_GPT_DIR} to sys.path")
    sys.path.append(str(MINI_GPT_DIR))

# Import the generate function from the mini-Gpt project.
# This will execute generate.py module-level code once, loading the model into memory.
try:
    logger.info("Initializing MiniGPT model...")
    from inference.generate import generate
    logger.info("MiniGPT model loaded successfully into memory.")
except Exception as e:
    logger.error(f"Failed to load MiniGPT model: {e}")
    raise

class ModelService:
    """
    Service layer wrapping MiniGPT generation.
    """
    
    @staticmethod
    def generate_response(
        message: str,
        max_new_tokens: int = 100,
        temperature: float = 0.2,
        top_k: int = 10
    ) -> str:
        """
        Formats user message using the expected training tags and queries MiniGPT.
        """
        # Format the user query with user/assistant prompts as model is trained on this template
        formatted_prompt = f"<USER> {message} <ASSISTANT>"
        
        logger.info(f"Generating response for prompt: {message[:60]}...")
        
        # Call MiniGPT generate function
        response = generate(
            prompt=formatted_prompt,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            top_k=top_k
        )
        
        return response
