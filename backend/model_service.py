import sys
from pathlib import Path
import logging
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# Configure logging
logger = logging.getLogger("backend.model_service")

# Resolve absolute paths
BACKEND_DIR = Path(__file__).resolve().parent
WORKSPACE_DIR = BACKEND_DIR.parent
MODEL_DIR = WORKSPACE_DIR / "fast_finetuned"

logger.info(f"Model path resolved to: {MODEL_DIR}")

# Global variables for tokenizer and model
tokenizer = None
model = None
device = None

def init_model():
    global tokenizer, model, device
    if model is not None:
        return
        
    logger.info("Initializing Fine-tuned model...")
    try:
        # Load the tokenizer
        tokenizer = AutoTokenizer.from_pretrained(str(MODEL_DIR))
        
        # Detect device
        device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Select data type based on device (bfloat16 for GPU, float32 for CPU fallback)
        torch_dtype = torch.bfloat16 if device == "cuda" else torch.float32
        logger.info(f"Using device: {device} with dtype: {torch_dtype}")
        
        # Load the causal language model
        model = AutoModelForCausalLM.from_pretrained(
            str(MODEL_DIR),
            torch_dtype=torch_dtype,
            device_map="auto" if device == "cuda" else None
        )
        
        if device == "cpu":
            model.to(device)
            import os
            cores = os.cpu_count() or 4
            torch.set_num_threads(min(4, cores))
            logger.info(f"Set PyTorch CPU threads to {min(4, cores)}")
            
        logger.info("Fine-tuned model loaded successfully into memory.")
    except Exception as e:
        logger.error(f"Failed to load Fine-tuned model: {e}", exc_info=True)
        raise

# Trigger model loading when model_service is imported
try:
    init_model()
except Exception:
    logger.error("Initial model loading failed. Will attempt to reload on first request.")

class ModelService:
    """
    Service layer wrapping Fine-tuned generation.
    """
    
    @staticmethod
    def generate_response(
        message: str,
        max_new_tokens: int = 100,
        temperature: float = 0.3
    ) -> str:
        """
        Tokenizes the input, formats it using the chat template, and runs generation.
        """
        global tokenizer, model, device
        
        # Ensure model is initialized
        if model is None:
            init_model()
            
        try:
            # Format using chat template defined in chat_template.jinja
            messages = [{"role": "user", "content": message}]
            formatted_prompt = tokenizer.apply_chat_template(
                messages, 
                tokenize=False, 
                add_generation_prompt=True
            )
            
            logger.info(f"Generating response for formatted prompt: {formatted_prompt!r}")
            
            # Tokenize prompt
            inputs = tokenizer(formatted_prompt, return_tensors="pt").to(device)
            
            # Run generation
            gen_kwargs = {
                "max_new_tokens": max_new_tokens,
                "pad_token_id": tokenizer.eos_token_id,
            }
            if temperature > 0.0:
                gen_kwargs["do_sample"] = True
                gen_kwargs["temperature"] = temperature
                gen_kwargs["top_p"] = 0.9
            else:
                gen_kwargs["do_sample"] = False

            with torch.inference_mode():
                outputs = model.generate(
                    **inputs,
                    **gen_kwargs
                )
                
            # Decode the generated output, skipping the prompt tokens
            input_length = inputs.input_ids.shape[1]
            generated_tokens = outputs[0][input_length:]
            response = tokenizer.decode(generated_tokens, skip_special_tokens=True)
            
            logger.info(f"Generated response successfully: {response[:100]}...")
            return response.strip()
        except Exception as e:
            logger.error(f"Error during model generation: {e}", exc_info=True)
            raise

