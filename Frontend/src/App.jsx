import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ChatProvider, useChat } from './contexts/ChatContext';
import ChatPage from './pages/ChatPage';
import ErrorBoundary from './components/ErrorBoundary';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Toast Notification Container Component
const ToastContainer = () => {
  const { toasts } = useChat();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let colorClass = 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40 text-blue-800 dark:text-blue-300';
          
          if (toast.type === 'success') {
            Icon = CheckCircle;
            colorClass = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            colorClass = 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-300';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              layout
              className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg pointer-events-auto backdrop-blur-md ${colorClass}`}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs font-medium font-sans">
                {toast.message}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Sub-App component to resolve hook references correctly inside ChatProvider
const MainApp = () => {
  return (
    <ErrorBoundary>
      <ChatPage />
      <ToastContainer />
    </ErrorBoundary>
  );
};

export const App = () => {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <ChatProvider>
          <MainApp />
        </ChatProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
};

export default App;
