import React from 'react';
import { motion } from 'framer-motion';

export const TypingIndicator = () => {
  const dotVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '100%',
    },
  };

  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.15,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 px-3.5 py-2.5 rounded-2xl w-max border border-gray-200/50 dark:border-zinc-800/40">
      <motion.div
        variants={containerVariants}
        initial="start"
        animate="end"
        className="flex items-center justify-center gap-1 h-2.5"
      >
        {[1, 2, 3].map((idx) => (
          <motion.span
            key={idx}
            variants={dotVariants}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            className="w-1.5 h-1.5 bg-gray-500 dark:bg-zinc-400 rounded-full"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default TypingIndicator;
