import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chatService';
import { useSettings } from './SettingsContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { settings } = useSettings();
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('chat_conversations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [currentConversationId, setCurrentConversationId] = useState(() => {
    const savedId = localStorage.getItem('current_conversation_id');
    return savedId || null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStreamingMessageId, setActiveStreamingMessageId] = useState(null);
  
  // Custom toast notifications queue
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('chat_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Save active conversation ID to localStorage
  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem('current_conversation_id', currentConversationId);
    } else {
      localStorage.removeItem('current_conversation_id');
    }
  }, [currentConversationId]);

  // Get current active conversation
  const currentConversation = conversations.find(c => c.id === currentConversationId);

  // Create a new conversation
  const createConversation = useCallback((title = 'New Chat') => {
    const newId = `conv_${Date.now()}`;
    const newConv = {
      id: newId,
      title: title,
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(newId);
    return newId;
  }, []);

  // Delete conversation
  const deleteConversation = useCallback((id) => {
    setConversations((prev) => {
      const filtered = prev.filter(c => c.id !== id);
      if (currentConversationId === id) {
        setCurrentConversationId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
    showToast('Conversation deleted', 'success');
  }, [currentConversationId, showToast]);

  // Rename conversation
  const renameConversation = useCallback((id, newTitle) => {
    if (!newTitle.trim()) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle.trim() } : c))
    );
    showToast('Conversation renamed', 'success');
  }, [showToast]);

  // Clear all conversations
  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setCurrentConversationId(null);
    localStorage.removeItem('current_conversation_id');
    showToast('Chat history cleared', 'success');
  }, [showToast]);

  // Function to simulate typing / streaming text
  const streamResponseText = useCallback((fullText, messageId, convId) => {
    setIsGenerating(true);
    setActiveStreamingMessageId(messageId);
    
    let currentText = '';
    const words = fullText.split(/(\s+)/); // Keep whitespace tokens for natural pacing
    let wordIndex = 0;
    
    // Smooth scrolling & speed adjustments
    // If text is short, we can print it faster; if it's long, we balance it.
    const intervalTime = Math.max(15, Math.min(45, 1200 / words.length));

    const timer = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += words[wordIndex];
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === convId) {
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId ? { ...m, content: currentText } : m
                ),
              };
            }
            return c;
          })
        );
        wordIndex++;
      } else {
        clearInterval(timer);
        setIsGenerating(false);
        setActiveStreamingMessageId(null);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Send a message
  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    let activeConvId = currentConversationId;
    
    // Auto-create conversation if none is active
    if (!activeConvId) {
      // Auto-name based on the first few words of the prompt
      const summaryTitle = content.split(' ').slice(0, 4).join(' ') + (content.split(' ').length > 4 ? '...' : '');
      activeConvId = createConversation(summaryTitle);
    }

    const userMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMessageId = `msg_assistant_${Date.now()}`;
    const assistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '', // Starts empty for streaming
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: settings.model
    };

    // Update state to render User message and streaming placeholder
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          // If conversation has no messages yet, rename it dynamically based on input
          const newTitle = c.messages.length === 0 
            ? content.split(' ').slice(0, 4).join(' ') + (content.split(' ').length > 4 ? '...' : '')
            : c.title;

          return {
            ...c,
            title: newTitle,
            messages: [...c.messages, userMessage, assistantMessage],
          };
        }
        return c;
      })
    );

    setIsLoading(true);

    try {
      const result = await chatService.sendMessage(content, activeConvId, settings);
      setIsLoading(false);
      
      if (result.isMock) {
        showToast('Running in standalone mode (using mock responses)', 'info');
      }
      
      // Start streaming response
      streamResponseText(result.text, assistantMessageId, activeConvId);
    } catch (error) {
      setIsLoading(false);
      showToast(`Error communicating with model: ${error.message}`, 'error');
      
      // Update assistant bubble with error notice
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMessageId 
                  ? { ...m, content: '⚠️ **Error:** Failed to retrieve response. Please check if the backend service is running at `http://localhost:8000`.' } 
                  : m
              ),
            };
          }
          return c;
        })
      );
    }
  }, [currentConversationId, createConversation, settings, streamResponseText, showToast]);

  // Regenerate Response
  const regenerateResponse = useCallback(async (assistantMsgId) => {
    if (!currentConversationId || isGenerating) return;

    const conv = conversations.find(c => c.id === currentConversationId);
    if (!conv) return;

    // Find the assistant message and the user message right before it
    const msgIndex = conv.messages.findIndex(m => m.id === assistantMsgId);
    if (msgIndex === -1) return;

    const userMessage = conv.messages[msgIndex - 1];
    if (!userMessage || userMessage.role !== 'user') return;

    // Remove the old assistant message and all messages after it, and recreate the assistant placeholder
    const truncatedMessages = conv.messages.slice(0, msgIndex);
    const newAssistantMsgId = `msg_assistant_regen_${Date.now()}`;
    const newAssistant = {
      id: newAssistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: settings.model,
      isRegenerated: true
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentConversationId
          ? { ...c, messages: [...truncatedMessages, newAssistant] }
          : c
      )
    );

    setIsLoading(true);

    try {
      const result = await chatService.sendMessage(userMessage.content, currentConversationId, settings);
      setIsLoading(false);
      
      if (result.isMock) {
        showToast('Running in standalone mode (using mock responses)', 'info');
      }

      streamResponseText(result.text, newAssistantMsgId, currentConversationId);
    } catch (error) {
      setIsLoading(false);
      showToast(`Error regenerating: ${error.message}`, 'error');
      
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === currentConversationId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newAssistantMsgId 
                  ? { ...m, content: '⚠️ **Error:** Failed to regenerate. Is the backend offline?' } 
                  : m
              ),
            };
          }
          return c;
        })
      );
    }
  }, [currentConversationId, conversations, isGenerating, settings, streamResponseText, showToast]);

  // Filter conversations based on query
  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConversationId,
      setCurrentConversationId,
      currentConversation,
      searchQuery,
      setSearchQuery,
      filteredConversations,
      isLoading,
      isGenerating,
      activeStreamingMessageId,
      createConversation,
      deleteConversation,
      renameConversation,
      sendMessage,
      regenerateResponse,
      clearAllConversations,
      toasts,
      showToast
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
