import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Square } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

const MAX_CHAR_LIMIT = 2000;

export const MessageInput = () => {
  const { sendMessage, isLoading, isGenerating, showToast } = useChat();
  const [message, setMessage] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const textareaRef = useRef(null);

  // Auto-expand textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to calculate scrollHeight
    textarea.style.height = 'auto';
    
    // Set to scrollHeight but cap it at 200px
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [message]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!message.trim() || isLoading || isGenerating) return;
    
    sendMessage(message.trim());
    setMessage('');
    setFileAttached(false);
  };

  const handleKeyDown = (e) => {
    // If Enter (without Shift) is pressed, submit
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAttachMock = () => {
    setFileAttached(true);
    showToast('File selected (Mock file attached: document.pdf)', 'info');
  };

  const handleMicMock = () => {
    showToast('Microphone recording started (Speech-to-Text mock activated)', 'info');
  };

  const handleStopMock = () => {
    showToast('Generation stopped', 'info');
    // Clear active generation variables via window reload or context if needed, 
    // but a simple notification is fine for mock.
    // For full effect, we can refresh the window or just let it stop.
    // Since our context doesn't expose a direct "stop" callback, we can alert that.
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-6 pt-2 bg-gradient-to-t from-chatbg-light via-chatbg-light/95 to-transparent dark:from-chatbg-dark dark:via-chatbg-dark/95 dark:to-transparent"
    >
      
      {/* Container holding input and utilities */}
      <div className="relative rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md hover:shadow-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all p-2 pr-3">
        
        {/* Mock File Attachment Tag */}
        {fileAttached && (
          <div className="flex items-center gap-1.5 w-max bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-xs px-2.5 py-1 rounded-full mb-2 ml-2 select-none border border-brand-500/10">
            <Paperclip className="h-3 w-3" />
            <span>document.pdf</span>
            <button 
              type="button" 
              onClick={() => setFileAttached(false)}
              className="hover:text-red-500 font-bold ml-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Input Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHAR_LIMIT))}
          onKeyDown={handleKeyDown}
          placeholder="Ask ChatGPT anything... (Enter to send, Shift+Enter for new line)"
          disabled={isLoading}
          className="w-full bg-transparent resize-none text-sm outline-none px-3 py-2 text-slate-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-zinc-500 max-h-[200px]"
        />

        {/* Actions bar (bottom row inside input) */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800/60 pt-2 px-2 mt-1 select-none">
          
          {/* File & Mic buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleAttachMock}
              disabled={isLoading}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-850 hover:text-slate-700 dark:hover:text-zinc-200 transition-all"
              title="Attach File"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleMicMock}
              disabled={isLoading}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-850 hover:text-slate-700 dark:hover:text-zinc-200 transition-all"
              title="Voice Input (Mock)"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>

          {/* Right controls: word count & Send/Stop button */}
          <div className="flex items-center gap-3">
            
            {/* Character count */}
            <span className={`text-[10px] font-mono ${message.length >= MAX_CHAR_LIMIT - 100 ? 'text-amber-500' : 'text-gray-400 dark:text-zinc-500'}`}>
              {message.length} / {MAX_CHAR_LIMIT}
            </span>

            {isGenerating ? (
              // Stop generating button
              <button
                type="button"
                onClick={handleStopMock}
                className="flex items-center justify-center h-8 w-8 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all shadow shadow-red-500/10"
                title="Stop Generating"
              >
                <Square className="h-4 w-4 fill-white" />
              </button>
            ) : (
              // Send message button
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className={`flex items-center justify-center h-8 w-8 rounded-xl transition-all shadow ${
                  message.trim() && !isLoading
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-300 dark:text-zinc-700 cursor-not-allowed shadow-none'
                }`}
                title="Send Message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            )}

          </div>

        </div>

      </div>

    </form>
  );
};

export default MessageInput;
