'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoadingState({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 400);
          return 100;
        }
        const increment = Math.random() * 8 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <section className="relative w-full py-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#111113] border border-zinc-800 rounded-xl p-12 text-center"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#6366F1]"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Percentage */}
          <motion.div
            className="text-5xl font-bold text-[#FAFAFA] mb-4"
            key={Math.floor(progress)}
          >
            {Math.floor(progress)}%
          </motion.div>

          {/* Status Text */}
          <p className="text-[#A1A1AA]">Analyzing profile...</p>
        </motion.div>
      </div>
    </section>
  );
}
