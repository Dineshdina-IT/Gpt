# Modern AI Chatbot Frontend

A polished, high-fidelity React + Vite frontend for communicating with a local LLM or OpenAI-style backend service. Built with Tailwind CSS and Framer Motion for smooth, premium UI aesthetics comparable to ChatGPT, Claude, and Gemini.

## Features
- **Collapsible Sidebar**: Search conversations, rename (double-click/pencil button), delete, create new, and manage user profile menu.
- **Polished Markdown Bubbles**: Supports GitHub Flavored Markdown (tables, lists, headers), math equation rendering (LaTeX via KaTeX), and custom syntax highlighting for code blocks with dedicated "Copy Code" buttons.
- **Sleek Settings Modal**: Configure selected LLMs, temperature levels, maximum token outputs, and trigger chat history purges.
- **Dark Mode by Default**: Toggle between light and dark settings seamlessly, persisting your preferences in `localStorage`.
- **Response Token Streaming**: Simulated real-time typing output with a responsive blinking cursor.
- **Robust Connection Service**: Axios API integration layer for `POST http://localhost:8000/chat` requests, featuring automatic retries and a sandbox mock mode fallback if the backend is offline.
- **Responsive Animations**: Glassmorphism controls, mobile navigation drawer slide-overs, pulsing loading indicators, and error boundaries.

## Installation

1. Navigate to the project folder:
   ```bash
   cd c:\Users\DineshChellappa\Desktop\Frontend
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Run the development server locally:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

4. Build the application bundle for production:
   ```bash
   npm run build
   ```

## Folder Structure
```text
src/
├── components/
│    ├── Sidebar.jsx          # Collapsible history navigation panel
│    ├── ChatWindow.jsx       # Chat scroll area, welcome prompts, and loading bubbles
│    ├── MessageBubble.jsx    # GFM markdown parsing, copy tools, and custom syntax highlighter
│    ├── MessageInput.jsx     # Auto-expanding composer textarea with mocks
│    ├── Header.jsx           # Top actions navbar with model selection displays
│    ├── SettingsModal.jsx    # Temperature, tokens, and history controls dialog
│    ├── ThemeToggle.jsx      # Rotating dark/light mode icon
│    ├── TypingIndicator.jsx  # Pulsing loader dots
│    └── ErrorBoundary.jsx    # React error catcher
│
├── pages/
│    └── ChatPage.jsx         # Layout container
│
├── contexts/
│    ├── ChatContext.jsx      # Holds conversation states, send routines, and stream timeouts
│    ├── ThemeContext.jsx     # Controls dark class lists on html root
│    └── SettingsContext.jsx  # Manages parameter selections
│
├── services/
│    └── chatService.js       # Axios dispatcher, retries helper, and sandbox mock generator
│
├── index.css                 # Tailwind directives, custom glass styles, and blink keyframes
├── main.jsx                  # App mounting script
└── App.jsx                   # Combines contexts and mounts global toast lists
```
