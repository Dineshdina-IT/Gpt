import React, { useState } from 'react';
import {
  Plus, Search, MessageSquare, Trash2, Edit2,
  Settings, Check, X, ChevronLeft, LogOut
} from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useSettings } from '../contexts/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const {
    filteredConversations,
    currentConversationId,
    setCurrentConversationId,
    createConversation,
    deleteConversation,
    renameConversation,
    searchQuery,
    setSearchQuery
  } = useChat();

  const { setIsSettingsOpen } = useSettings();
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const startEditing = (e, id, currentTitle) => {
    e.stopPropagation(); // Avoid switching conversation
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveEdit = (e, id) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      renameConversation(id, editTitle);
    }
    setEditingId(null);
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <motion.aside
      animate={{
        width: isCollapsed ? 0 : 280,
        opacity: isCollapsed ? 0 : 1,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      }}
      className="relative z-30 flex h-full flex-col bg-chatbg-sidebarLight dark:bg-chatbg-sidebarDark border-r border-gray-200/60 dark:border-zinc-800/80 overflow-hidden"
    >
      {/* Top Header & New Chat */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-semibold font-sans text-sm">A</div>
            <span className="font-semibold text-slate-800 dark:text-slate-100 font-sans text-sm tracking-wide">Chatbot AI</span>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-200/60 dark:hover:bg-zinc-800/60 hover:text-gray-700 dark:hover:text-zinc-300 transition-all focus:outline-none"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
        </div>

        <button
          onClick={() => createConversation()}
          id="new-chat-btn"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-zinc-800/60 focus:ring-2 focus:ring-brand-500 transition-all shadow-sm group"
        >
          <Plus className="h-4 w-4 text-brand-500 group-hover:scale-110 transition-transform" />
          New Chat
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-slate-700 dark:text-slate-300 placeholder-gray-400"
          />
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 dark:text-zinc-500 px-4">
            <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">No conversations found</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredConversations.map((conv) => {
              const isActive = conv.id === currentConversationId;
              const isEditing = conv.id === editingId;

              return (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm cursor-pointer transition-all ${isActive
                      ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium'
                      : 'text-slate-600 dark:text-zinc-400 hover:bg-gray-200/50 dark:hover:bg-zinc-800/40'
                    }`}
                  onClick={() => {
                    if (!isEditing) {
                      setCurrentConversationId(conv.id);
                    }
                  }}
                >
                  <MessageSquare className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-brand-500' : 'text-gray-400'}`} />

                  {isEditing ? (
                    <div className="flex flex-1 items-center gap-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(e, conv.id);
                          if (e.key === 'Escape') cancelEdit(e);
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-white dark:bg-zinc-800 text-xs px-1.5 py-0.5 rounded border border-brand-500 focus:outline-none"
                      />
                      <button
                        onClick={(e) => saveEdit(e, conv.id)}
                        className="p-0.5 rounded text-emerald-500 hover:bg-emerald-500/10"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-0.5 rounded text-red-500 hover:bg-red-500/10"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex-1 truncate text-xs font-sans tracking-normal">
                      {conv.title}
                    </span>
                  )}

                  {/* Actions (visible on hover) */}
                  {!isEditing && (
                    <div className="absolute right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-gray-200/90 dark:from-zinc-800/90 pl-3 py-1 rounded">
                      <button
                        onClick={(e) => startEditing(e, conv.id, conv.title)}
                        className="p-0.5 rounded text-gray-500 dark:text-zinc-400 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-gray-300/40 dark:hover:bg-zinc-700/50"
                        title="Rename"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        className="p-0.5 rounded text-gray-500 dark:text-zinc-400 hover:text-red-500 hover:bg-gray-300/40 dark:hover:bg-zinc-700/50"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Bottom User / Settings section */}
      <div className="border-t border-gray-200/60 dark:border-zinc-800/80 p-4 space-y-3 bg-gray-200/20 dark:bg-zinc-900/10">

        {/* Settings button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          id="sidebar-settings-btn"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-zinc-300 hover:bg-gray-200/60 dark:hover:bg-zinc-800/60 transition-all font-sans"
        >
          <Settings className="h-4.5 w-4.5 text-gray-500 dark:text-zinc-400" />
          Settings
        </button>

        {/* User Profile */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200/40 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/40 p-2.5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="relative h-8 w-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold flex items-center justify-center text-xs shadow shadow-brand-500/20">
              U
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-zinc-900 bg-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">Dinesh Chellappa</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">dinesh@example.com</span>
            </div>
          </div>
        </div>

      </div>
    </motion.aside>
  );
};

export default Sidebar;
