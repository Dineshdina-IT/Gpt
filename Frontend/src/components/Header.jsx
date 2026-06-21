import React from 'react';
import { Menu, ChevronRight, Activity, Cpu } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useChat } from '../contexts/ChatContext';
import ThemeToggle from './ThemeToggle';

export const Header = ({ isCollapsed, setIsCollapsed, toggleMobileSidebar }) => {
  const { settings } = useSettings();
  const { conversations, currentConversation } = useChat();

  // Determine model label
  const getModelLabel = () => {
    switch (settings.model) {
      case 'gpt-4o': return 'GPT-4o';
      case 'gpt-4-turbo': return 'GPT-4 Turbo';
      case 'claude-3-5-sonnet': return 'Claude 3.5 Sonnet';
      case 'gemini-1.5-pro': return 'Gemini 1.5 Pro';
      case 'llama-3-70b': return 'Llama 3 70B';
      default: return settings.model;
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-gray-200/50 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md px-4 select-none">
      
      {/* Left side actions */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={toggleMobileSidebar}
          id="mobile-sidebar-toggle"
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-700 dark:hover:text-zinc-300 md:hidden transition-all focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Collapsed sidebar trigger (desktop) */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            id="desktop-sidebar-expand"
            className="hidden md:flex p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-700 dark:hover:text-zinc-300 transition-all focus:outline-none"
            title="Expand Sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Logo & Model badge */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block font-sans font-bold text-sm tracking-wide bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {currentConversation ? currentConversation.title : 'New Chat'}
          </span>
          <div className="flex items-center gap-1.5 rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-400 border border-brand-500/15">
            <Cpu className="h-3 w-3" />
            <span>{getModelLabel()}</span>
          </div>
        </div>
      </div>

      {/* Right side settings/actions */}
      <div className="flex items-center gap-3">
        
        {/* Status indicator */}
        <div 
          className="hidden sm:flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-zinc-800/80 px-2.5 py-0.5 text-[10px] font-mono text-gray-500 dark:text-zinc-400 border border-gray-200/50 dark:border-zinc-800/40"
          title="FastAPI server endpoint check"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span>Standalone Mode</span>
        </div>

        <ThemeToggle />
      </div>

    </header>
  );
};

export default Header;
