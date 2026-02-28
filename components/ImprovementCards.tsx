'use client';

import { motion } from 'framer-motion';

interface Improvement {
  title: string;
  suggestions: string[];
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

interface ImprovementData {
  improvements: Improvement[];
}

function ImprovementCard({ improvement, index }: { improvement: Improvement; index: number }) {
  const getPriorityLabel = () => {
    switch (improvement.priority) {
      case 'high': return { text: 'High Priority', color: 'text-red-400 border-red-400/20 bg-red-400/5' };
      case 'medium': return { text: 'Medium', color: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5' };
      case 'low': return { text: 'Low Priority', color: 'text-blue-400 border-blue-400/20 bg-blue-400/5' };
    }
  };

  const badge = getPriorityLabel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-[#111113] border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{improvement.icon}</span>
          <h3 className="text-lg font-semibold text-[#FAFAFA]">
            {improvement.title}
          </h3>
        </div>
        <span className={`px-2 py-1 rounded text-xs border ${badge.color}`}>
          {badge.text}
        </span>
      </div>

      {/* Suggestions */}
      <ul className="space-y-3">
        {improvement.suggestions.map((suggestion, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-[#A1A1AA]">
            <span className="text-[#6366F1] mt-1">•</span>
            <span className="flex-1">{suggestion}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function ImprovementCards({ data }: { data: ImprovementData }) {
  return (
    <section className="relative w-full py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-2">
            Recommendations
          </h2>
          <p className="text-[#A1A1AA]">
            Actionable insights to improve your profile
          </p>
        </motion.div>

        {/* Cards */}
        <div className="space-y-4">
          {data.improvements.map((improvement, index) => (
            <ImprovementCard key={improvement.title} improvement={improvement} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
