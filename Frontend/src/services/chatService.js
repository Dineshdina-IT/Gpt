import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple helper to sleep for mock delays
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper for exponential backoff retry logic
const fetchWithRetry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0 || (error.response && error.response.status >= 400 && error.response.status < 500)) {
      throw error;
    }
    console.warn(`API call failed, retrying in ${delay}ms... (${retries} retries left)`);
    await sleep(delay);
    return fetchWithRetry(fn, retries - 1, delay * 2);
  }
};

/**
 * Chat API service
 */
export const chatService = {
  /**
   * Sends a message to the FastAPI backend, with mock fallback if offline.
   * @param {string} message 
   * @param {string} conversationId 
   * @param {object} settings (model, temperature, maxTokens)
   * @returns {Promise<{text: string, isMock: boolean}>}
   */
  async sendMessage(message, conversationId, settings = {}) {
    const apiCall = () => api.post('/chat', {
      message,
      conversation_id: conversationId,
      model: settings.model,
      temperature: settings.temperature,
      max_tokens: settings.maxTokens
    });

    try {
      // Attempt API call with retry logic
      const response = await fetchWithRetry(apiCall, 2, 1000);
      return {
        text: response.data.response,
        isMock: false,
      };
    } catch (error) {
      console.error('FastAPI Connection Error:', error.message);
      
      // Connection refused, or network error -> use modern chatbot response simulation
      // This allows the UI to work fully in "standalone" mode before connecting to the backend.
      await sleep(1500); // Simulate API latency
      const mockResponse = getMockResponse(message, settings.model);
      return {
        text: mockResponse,
        isMock: true,
      };
    }
  },
};

/**
 * High-fidelity mock responses tailored to requested topics
 */
function getMockResponse(message, model) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('transformer') || lowerMessage.includes('explain transformer')) {
    return `### The Transformer Architecture

Transformers were introduced in the seminal paper **"Attention Is All You Need"** (Vaswani et al., 2017). They replaced recurrent architectures (LSTMs, GRUs) by relying entirely on **Self-Attention** mechanisms.

#### Key Components:
1. **Self-Attention**: Enables the model to associate each word in the input sequence with every other word, regardless of their distance.
2. **Multi-Head Attention**: Runs multiple attention layers (heads) in parallel, allowing the model to jointly attend to information from different representation subspaces.
3. **Positional Encoding**: Since there is no recurrence, positional values are added to input embeddings to preserve token order.
4. **Encoder-Decoder Stack**: Encoder parses input into embeddings, and Decoder generates output autoregressively.

Here is a quick mathematical representation of **Scaled Dot-Product Attention**:

$$Attention(Q, K, V) = softmax\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

Where $Q$ represents Queries, $K$ represents Keys, and $V$ represents Values, scaled by the square root of the key dimension $d_k$.`;
  }
  
  if (lowerMessage.includes('python') || lowerMessage.includes('code python') || lowerMessage.includes('write python')) {
    return `Certainly! Here is an implementation of a binary search tree (BST) in Python, featuring insertion, searching, and traversal:

\`\`\`python
class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, key):
        if self.root is None:
            self.root = Node(key)
        else:
            self._insert(self.root, key)

    def _insert(self, root, key):
        if key < root.val:
            if root.left is None:
                root.left = Node(key)
            else:
                self._insert(root.left, key)
        else:
            if root.right is None:
                root.right = Node(key)
            else:
                self._insert(root.right, key)

    def inorder(self):
        result = []
        self._inorder(self.root, result)
        return result

    def _inorder(self, root, result):
        if root:
            self._inorder(root.left, result)
            result.append(root.val)
            self._inorder(root.right, result)

# Example Usage
bst = BinarySearchTree()
for val in [50, 30, 20, 40, 70, 60, 80]:
    bst.insert(val)

print("In-order Traversal of BST:", bst.inorder())
# Output: [20, 30, 40, 50, 60, 70, 80]
\`\`\`

Let me know if you need to optimize this or convert it to a different structure!`;
  }

  if (lowerMessage.includes('summarize') || lowerMessage.includes('document')) {
    return `### Document Summary Analysis

Here is a structured executive summary of the document:

* **Core Objective**: Optimize frontend loading latency and layout shifts for LLM token streaming applications.
* **Key Findings**:
  1. *React Virtualization* reduces initial layout cost by **45%** in long conversation threads.
  2. *CSS Glassmorphism filters* can drop mobile rendering frame rates from 60fps to 42fps if nested excessively.
  3. *RequestAnimationFrame* throttling is essential for high-throughput streaming states to prevent thread blockages.
* **Recommendations**:
  * Implement active viewport message pruning for lists longer than 50 bubbles.
  * Debounce markdown compilation and syntax highlighting tasks inside Web Workers to ensure seamless text rendering.`;
  }

  if (lowerMessage.includes('sql') || lowerMessage.includes('query') || lowerMessage.includes('generate sql')) {
    return `Here is the SQL query to solve the request:

\`\`\`sql
-- Retrieve the top 5 customers who spent the most money in Q3 2025
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    SUM(o.total_amount) AS total_spent,
    COUNT(o.order_id) AS total_orders
FROM 
    customers c
INNER JOIN 
    orders o ON c.customer_id = o.customer_id
WHERE 
    o.order_date BETWEEN '2025-07-01' AND '2025-09-30'
    AND o.status = 'Completed'
GROUP BY 
    c.customer_id, 
    c.first_name, 
    c.last_name
ORDER BY 
    total_spent DESC
LIMIT 5;
\`\`\`

*This query aggregates orders filtering by order date range, performs an inner join on customer records, and orders the output in descending order by aggregate expenditures.*`;
  }

  // Generic answers responding with model info
  return `Hello! I am **${model}**, your AI Chatbot assistant.

I am connected to the local API service, but running in local sandbox mode since no active FastAPI backend was found.

Here's how I can help you today:
- 💡 **Answering questions** on machine learning (try asking about "Transformers")
- 💻 **Writing or debugging code** (try asking for "Python code" or "SQL queries")
- 📄 **Analyzing text and documents** (try asking to "summarize a document")
- ⚙️ **Configuring settings**: Check out the settings gear in the sidebar to configure options like Temperature, Max Tokens, and change models.

Feel free to type any request in the input bar below!`;
}
