import React, { useState } from 'react';
import { X, Trash2, Sliders, Cpu, Sparkles } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useChat } from '../contexts/ChatContext';
import { AnimatePresence, motion } from 'framer-motion';

export const SettingsModal = () => {
  const { settings, updateSetting, isSettingsOpen, setIsSettingsOpen, resetSettings } = useSettings();
  const { clearAllConversations, showToast } = useChat();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleClearHistory = () => {
    clearAllConversations();
    setShowConfirmClear(false);
    setIsSettingsOpen(false);
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSettingsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            id="settings-modal-dialog"
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 text-slate-800 dark:text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-brand-500" />
                <h2 className="text-xl font-semibold font-sans">Settings</h2>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="py-6 space-y-6">
              
              {/* Model selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Cpu className="h-4 w-4 text-brand-500" />
                  Model Selection
                </label>
                <select
                  value={settings.model}
                  onChange={(e) => updateSetting('model', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer"
                >
                  <option value="fast-finetuned">Fast Fine-Tuned (Local)</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="llama-3-70b">Llama 3 70B</option>
                </select>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                    <Sparkles className="h-4 w-4 text-brand-500" />
                    Temperature
                  </label>
                  <span className="font-mono bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded text-xs">
                    {settings.temperature}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-zinc-800 accent-brand-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Deterministic</span>
                  <span>Creative</span>
                </div>
              </div>

              {/* Max Tokens Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                    <Sliders className="h-4 w-4 text-brand-500" />
                    Max Tokens
                  </label>
                  <span className="font-mono bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded text-xs">
                    {settings.maxTokens}
                  </span>
                </div>
                <input
                  type="range"
                  min="256"
                  max="4096"
                  step="128"
                  value={settings.maxTokens}
                  onChange={(e) => updateSetting('maxTokens', parseInt(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-zinc-800 accent-brand-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>256 tokens</span>
                  <span>4096 tokens</span>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-zinc-800" />

              {/* Danger Zone */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-red-500 dark:text-red-400">Danger Zone</h4>
                
                {showConfirmClear ? (
                  <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4 space-y-3">
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Are you sure? This will permanently delete all conversations and message history. This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearHistory}
                        className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs font-semibold transition-colors"
                      >
                        Yes, Delete All
                      </button>
                      <button
                        onClick={() => setShowConfirmClear(false)}
                        className="rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 px-3 py-1.5 text-xs font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConfirmClear(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 px-4 py-2.5 text-sm font-medium transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All Chat History
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-4 mt-2">
              <button
                onClick={() => {
                  resetSettings();
                  showToast('Settings reset to defaults', 'info');
                }}
                className="text-xs text-gray-500 hover:text-brand-500 transition-colors"
              >
                Reset to defaults
              </button>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 text-sm font-medium transition-all shadow-md shadow-brand-500/10"
              >
                Save & Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
