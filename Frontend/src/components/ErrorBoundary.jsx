import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('chat_conversations');
    localStorage.removeItem('current_conversation_id');
    localStorage.removeItem('chat_settings');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-slate-100">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur text-center space-y-6">
            <div className="inline-flex rounded-full bg-red-500/10 p-3 text-red-500">
              <AlertTriangle className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold font-sans text-red-500">Something went wrong</h1>
              <p className="text-sm text-gray-400">
                The application encountered an unexpected error and failed to render. This may be due to corrupted session data.
              </p>
            </div>

            {this.state.error && (
              <div className="rounded-lg bg-zinc-950 p-3 text-left overflow-auto max-h-32 text-xs font-mono border border-zinc-800 text-red-400">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white py-3 text-sm font-semibold transition-colors shadow-lg shadow-brand-500/25"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Application
              </button>
              
              <button
                onClick={this.handleReset}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Clear stored data & reset app
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
