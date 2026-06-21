import React, { useRef, useEffect, useState } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import MessageBubble from './MessageBubble';
import WelcomeScreen from './WelcomeScreen';

// Skeleton Loader Component for typing / fetch latency
const BubbleSkeleton = () => (
  <div className="flex w-full justify-start mb-6 animate-pulse select-none">
    <div className="flex max-w-[75%] items-start gap-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-200 dark:bg-zinc-800 text-transparent" />
      <div className="space-y-2">
        <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-850 rounded" />
        <div className="rounded-2xl px-4.5 py-3.5 bg-gray-100 dark:bg-zinc-800/40 border border-gray-200/40 dark:border-zinc-800/20 rounded-tl-none w-64 space-y-2">
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export const ChatWindow = () => {
  const { currentConversation, sendMessage, isLoading, isGenerating } = useChat();
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef(null);

  const messages = currentConversation?.messages || [];

  // Smooth scroll to bottom
  const scrollToBottom = (behavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior
      });
    }
  };

  // Trigger auto-scroll on new messages or generation progress
  useEffect(() => {
    // Only scroll to bottom automatically if the user is already near the bottom
    const container = scrollRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 250;
      if (isNearBottom || isGenerating) {
        scrollToBottom('auto');
      }
    }
  }, [messages.length, isGenerating]);

  // Initial scroll when conversation changes
  useEffect(() => {
    scrollToBottom('instant');
  }, [currentConversation?.id]);

  // Track scrolling to display/hide floating scroll-down button
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    // Show button if scrolled up more than 300px from bottom
    const isScrolledUp = container.scrollHeight - container.scrollTop - container.clientHeight > 300;
    setShowScrollBtn(isScrolledUp);
  };

  const handleSelectStarterPrompt = (promptText) => {
    sendMessage(promptText);
  };

  return (
    <div className="relative flex flex-1 flex-col h-full bg-chatbg-light dark:bg-chatbg-dark overflow-hidden">
      
      {/* Scroll viewport */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6"
      >
        <div className="w-full max-w-4xl mx-auto min-h-full flex flex-col justify-between">
          
          {messages.length === 0 ? (
            // Landing screen when no history exists
            <WelcomeScreen onSelectPrompt={handleSelectStarterPrompt} />
          ) : (
            // Message Bubbles stream
            <div className="pb-16">
              {messages.map((message, index) => (
                <div key={message.id} className="group">
                  <MessageBubble
                    message={message}
                    isLast={index === messages.length - 1}
                  />
                </div>
              ))}

              {/* API Fetch loader state */}
              {isLoading && <BubbleSkeleton />}
            </div>
          )}

        </div>
      </div>

      {/* Floating Scroll Down button */}
      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-28 right-8 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-300 shadow-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all focus:outline-none"
          title="Scroll to bottom"
        >
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </button>
      )}

    </div>
  );
};

export default ChatWindow;
