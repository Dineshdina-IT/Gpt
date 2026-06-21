from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging

# Set up logging format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("backend.app")

# Initialize FastAPI App
app = FastAPI(
    title="MiniGPT Chatbot API",
    description="Backend API connecting a React frontend with a locally trained MiniGPT model.",
    version="1.0.0"
)

# Enable CORS for React frontend (default local dev ports are 5173 / 3000)
# Allowing all origins in local dev to cover different port configurations.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema matching the React frontend Axios request payload
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    model: Optional[str] = None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 100

# Response schema matching the React frontend Axios response payload expectations
class ChatResponse(BaseModel):
    response: str

# Delayed import of ModelService to ensure application startup is clean
# and logs are properly registered before PyTorch loads the weights.
_model_service = None

def get_model_service():
    global _model_service
    if _model_service is None:
        from model_service import ModelService
        _model_service = ModelService
    return _model_service

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chat completion endpoint.
    Expects request.message and queries MiniGPT using the model_service.
    """
    if not request.message.strip():
        logger.warning("Received an empty message request.")
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")
    
    try:
        logger.info(f"Processing message: {request.message[:100]}...")
        
        # Resolve model service instance
        service = get_model_service()
        
        # Sanitize parameters
        # Clamp temperature to standard bounds
        temperature = max(0.1, min(1.5, request.temperature if request.temperature is not None else 0.7))
        
        # MiniGPT has a context window limit of 128 tokens, so we cap new tokens to 100
        # to prevent out-of-bounds generation and maintain performance.
        max_new_tokens = request.max_tokens if request.max_tokens is not None else 100
        if max_new_tokens > 100 or max_new_tokens <= 0:
            max_new_tokens = 100
            
        # Generate response using model service
        response = service.generate_response(
            message=request.message,
            max_new_tokens=max_new_tokens,
            temperature=temperature
        )
        
        logger.info(f"Successfully generated response: {response[:100]}...")
        return ChatResponse(response=response)
        
    except Exception as e:
        logger.exception("Error occurred during model inference.")
        raise HTTPException(
            status_code=500,
            detail=f"Inference Engine Error: {str(e)}"
        )

@app.get("/health")
async def health_endpoint():
    """
    Health check endpoint to verify API and loading state.
    """
    try:
        # Check if model service is initialized
        get_model_service()
        return {"status": "healthy", "model": "loaded"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting FastAPI Server...")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
