import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Copy, Check, RotateCcw, Sparkles } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

// Simple lightweight syntax highlighting helper for Code Blocks
const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format code strings with simple regex tokens
  const highlightCode = (code, lang) => {
    if (!code) return '';
    // Standard sanitization
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (lang === 'python' || lang === 'py' || lang === 'javascript' || lang === 'js' || lang === 'sql') {
      return escaped
        // Highlight Comments
        .replace(/(#.*|\/\/.*)/g, '<span class="text-emerald-500 font-sans">$1</span>')
        // Highlight Strings
        .replace(/(["'])(.*?)\1/g, '<span class="text-amber-500">$&</span>')
        // Highlight Keywords
        .replace(/\b(def|class|return|if|else|import|from|for|in|while|const|let|var|function|async|await|SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY|SUM|COUNT|LIMIT|AS|AND|OR|ON|INSERT|INTO|VALUES|UPDATE|DELETE)\b/g, '<span class="text-brand-500 font-semibold">$1</span>')
        // Highlight Numbers
        .replace(/\b(\d+)\b/g, '<span class="text-pink-500">$1</span>');
    }
    return escaped;
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-gray-200/80 dark:border-zinc-800 bg-zinc-950 shadow-lg text-slate-200">
      {/* Code Header */}
      <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 text-xs font-mono select-none border-b border-zinc-800">
        <span className="text-zinc-400 capitalize">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-slate-100 transition-all focus:outline-none"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        <pre className="m-0">
          <code
            className="block whitespace-pre"
            dangerouslySetInnerHTML={{ __html: highlightCode(value, language) || value }}
          />
        </pre>
      </div>
    </div>
  );
};

export const MessageBubble = ({ message, isLast }) => {
  const { role, content, timestamp, modelUsed, isRegenerated } = message;
  const { regenerateResponse, activeStreamingMessageId, showToast } = useChat();
  const [msgCopied, setMsgCopied] = useState(false);

  const isUser = role === 'user';
  const isStreaming = activeStreamingMessageId === message.id;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(content);
    setMsgCopied(true);
    showToast('Message copied to clipboard', 'success');
    setTimeout(() => setMsgCopied(false), 2000);
  };

  const handleRegenerate = () => {
    regenerateResponse(message.id);
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      
      {/* Main Container */}
      <div className={`flex max-w-[85%] md:max-w-[75%] items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs select-none shadow ${
          isUser 
            ? 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300' 
            : 'bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-brand-500/15'
        }`}>
          {isUser ? 'U' : <Sparkles className="h-4 w-4" />}
        </div>

        {/* Message Bubble Panel */}
        <div className="space-y-1">
          
          {/* Metadata */}
          <div className={`flex items-center gap-2 text-[10px] text-gray-400 dark:text-zinc-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span>{!isUser && modelUsed ? `${modelUsed} • ` : ''}{timestamp}</span>
            {isRegenerated && <span className="bg-brand-50 dark:bg-brand-950/20 text-brand-500 dark:text-brand-400 px-1 rounded">Regenerated</span>}
          </div>

          {/* Text Bubble */}
          <div className={`rounded-2xl px-4.5 py-3.5 border text-sm shadow-sm transition-all ${
            isUser
              ? 'bg-brand-600 text-white border-brand-700/30 rounded-tr-none'
              : 'bg-chatbg-bubbleBotLight dark:bg-chatbg-bubbleBotDark text-slate-800 dark:text-zinc-100 border-gray-200/50 dark:border-zinc-800/60 rounded-tl-none'
          }`}>
            <div className={`markdown-container ${isStreaming ? 'streaming-cursor' : ''}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !className;
                    return !isInline && match ? (
                      <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {content || (isStreaming ? '' : '...')}
              </ReactMarkdown>
            </div>
          </div>

          {/* Action Row */}
          {!isUser && content && (
            <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <button
                onClick={handleCopyMessage}
                className="flex items-center gap-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800/60 text-gray-400 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors focus:outline-none"
                title="Copy Message"
              >
                {msgCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              
              {isLast && !isStreaming && (
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800/60 text-gray-400 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors focus:outline-none"
                  title="Regenerate Response"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default MessageBubble;
