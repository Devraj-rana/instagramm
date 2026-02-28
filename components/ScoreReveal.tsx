'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface ScoreData {
  overall: number;
  username: string;
}

export default function ScoreReveal({ scoreData }: { scoreData: ScoreData }) {
  const [showScore, setShowScore] = useState(false);
  const motionScore = useMotionValue(0);
  const springScore = useSpring(motionScore, { stiffness: 50, damping: 20 });
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    setTimeout(() => setShowScore(true), 200);
    setTimeout(() => {
      motionScore.set(scoreData.overall);
    }, 600);

    const unsubscribe = springScore.on('change', (latest) => {
      setDisplayScore(latest);
    });

    return () => unsubscribe();
  }, [scoreData.overall, motionScore, springScore]);

  return (
    <section className="relative w-full py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left - Large Score Display */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5"
          >
            <div className="bg-[#111113] border border-zinc-800 rounded-xl p-12 text-center h-full flex flex-col justify-center">
              <p className="text-sm text-[#A1A1AA] mb-2">Profile Score</p>
              <motion.div
                className="text-8xl font-bold text-[#FAFAFA] mb-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: showScore ? 1 : 0.8 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                {displayScore.toFixed(1)}
              </motion.div>
              <div className="text-[#A1A1AA] text-lg">out of 10</div>
              
              <div className="mt-8 pt-8 border-t border-zinc-800">
                <p className="text-sm text-[#A1A1AA]">@{scoreData.username}</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="bg-[#111113] border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#FAFAFA] mb-4">Analysis Summary</h3>
              <p className="text-[#A1A1AA]">
                {scoreData.overall >= 8 ? 'Excellent profile! Your content strategy is working well.' :
                 scoreData.overall >= 6 ? 'Good foundation with room for optimization.' :
                 scoreData.overall >= 4 ? 'Several areas need attention to improve growth.' :
                 'Significant improvements needed for better performance.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Content Quality', value: 'Good' },
                { label: 'Engagement', value: 'Average' },
                { label: 'Bio Strength', value: 'Strong' },
                { label: 'Growth Potential', value: 'High' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                  className="bg-[#111113] border border-zinc-800 rounded-xl p-4"
                >
                  <div className="text-xs text-[#A1A1AA] mb-1">{stat.label}</div>
                  <div className="text-sm font-medium text-[#FAFAFA]">{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
