'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function UsernameInput({ onAnalyze }: { onAnalyze: (username: string) => void }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onAnalyze(username.trim());
    }
  };

  return (
    <section className="relative w-full py-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {/* Card */}
          <div className="bg-[#111113] border border-zinc-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-2">
              Analyze your profile
            </h2>
            <p className="text-[#A1A1AA] mb-6">
              Enter your Instagram username to get started
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full px-4 py-3 bg-[#0A0A0B] border border-zinc-800 rounded-lg text-[#FAFAFA] placeholder-[#A1A1AA] outline-none focus:border-[#6366F1] transition-colors duration-200"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!username.trim()}
                className="px-6 py-3 rounded-lg bg-[#6366F1] text-white font-medium hover:bg-[#5558E3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-[rgba(99,102,241,0.25)]"
              >
                Analyze
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

