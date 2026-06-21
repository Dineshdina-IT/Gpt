import React from 'react';
import { Sparkles, Code, FileText, Database, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SUGGESTED_CARDS = [
  {
    title: 'Explain Transformers',
    desc: 'Deep-dive into self-attention and transformer architecture with equations.',
    prompt: 'Explain Transformers architecture step by step, including position encoding and multi-head attention.',
    icon: Sparkles,
    color: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },
  {
    title: 'Write Python Code',
    desc: 'Generate a clean, commented implementation of a Binary Search Tree.',
    prompt: 'Write Python Code for a Binary Search Tree with insert and in-order traversal.',
    icon: Code,
    color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  },
  {
    title: 'Summarize a Document',
    desc: 'Extract key findings, actions, and summaries from a reports page.',
    prompt: 'Summarize a Document about frontend layout performance and rendering costs of LLM streams.',
    icon: FileText,
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  },
  {
    title: 'Generate SQL Query',
    desc: 'Create an aggregate query to retrieve top customers by Q3 spends.',
    prompt: 'Generate SQL Query to find top 5 spending customers in Q3 2025.',
    icon: Database,
    color: 'from-purple-500/10 to-fuchsia-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
  }
];

export const WelcomeScreen = ({ onSelectPrompt }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center max-w-4xl mx-auto select-none">
      
      {/* Animated Glowing Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mb-6"
      >
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-500 opacity-60 blur-xl animate-pulse-subtle" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-2xl">
          <Sparkles className="h-10 w-10 animate-pulse" />
        </div>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="space-y-3 mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-brand-600 to-indigo-600 dark:from-white dark:via-brand-400 dark:to-indigo-400 bg-clip-text text-transparent font-sans">
          How can I help you today?
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-base md:text-lg max-w-lg mx-auto font-normal">
          Ask questions, implement complex algorithms, analyze data, and custom-tailor your workflow.
        </p>
      </motion.div>

      {/* Grid Cards Container */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3
            }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
      >
        {SUGGESTED_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelectPrompt(card.prompt)}
              className={`group flex items-start text-left p-5 rounded-2xl border bg-white/40 dark:bg-zinc-900/30 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-900/60 transition-all cursor-pointer shadow-sm hover:shadow-md border-gray-200/60 dark:border-zinc-800/80`}
            >
              <div className={`mr-4 rounded-xl p-3 bg-gradient-to-br ${card.color.split(' ')[0]} ${card.color.split(' ')[1]} ${card.color.split(' ')[2]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm md:text-base group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 dark:text-zinc-500">
                  {card.desc}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 ml-2 mt-1 self-start text-gray-300 dark:text-zinc-700 group-hover:text-brand-500 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
