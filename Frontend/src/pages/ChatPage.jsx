import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ChatWindow } from '../components/ChatWindow';
import { MessageInput } from '../components/MessageInput';
import { SettingsModal } from '../components/SettingsModal';
import { X, PanelLeftClose, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen bg-chatbg-light dark:bg-chatbg-dark text-slate-800 dark:text-zinc-100 overflow-hidden relative">
      
      {/* 1. Mobile Sidebar Drawer Overlay (AnimatePresence) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Sidebar sliding container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-[280px] h-full flex shrink-0"
            >
              <Sidebar 
                isCollapsed={false} 
                setIsCollapsed={() => setIsMobileSidebarOpen(false)} 
              />
              
              {/* Close Button overlaying the drawer edge */}
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute right-[-45px] top-4 p-2 rounded-lg bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
      </div>

      {/* Collapse button floating near edge when sidebar is open */}
      {!isSidebarCollapsed && (
        <button
          onClick={() => setIsSidebarCollapsed(true)}
          className="hidden md:flex absolute left-[262px] top-4 z-40 p-1 rounded-md text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800 hover:text-gray-700 dark:hover:text-zinc-300 transition-all focus:outline-none"
          title="Collapse Sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      )}

      {/* 3. Main Workspace Panel */}
      <main className="flex flex-1 flex-col h-full overflow-hidden relative">
        <Header 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed}
          toggleMobileSidebar={toggleMobileSidebar}
        />
        
        {/* Chat conversations window */}
        <ChatWindow />
        
        {/* Composer message input */}
        <MessageInput />
      </main>

      {/* 4. Global Settings Modal */}
      <SettingsModal />

    </div>
  );
};

export default ChatPage;
