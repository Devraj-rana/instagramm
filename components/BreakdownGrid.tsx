'use client';

import { motion } from 'framer-motion';

interface CategoryData {
  title: string;
  score: number;
  insight: string;
  icon: string;
}

interface BreakdownData {
  categories: CategoryData[];
}

function ProgressBar({ score }: { score: number }) {
  return (
    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-[#6366F1]"
        initial={{ width: 0 }}
        whileInView={{ width: `${score}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </div>
  );
}

function CategoryCard({ category, index }: { category: CategoryData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-[#111113] border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <h3 className="text-base font-semibold text-[#FAFAFA]">
            {category.title}
          </h3>
        </div>
        <span className="text-sm font-medium text-[#A1A1AA]">
          {category.score}%
        </span>
      </div>

      {/* Progress Bar */}
      <ProgressBar score={category.score} />

      {/* Insight */}
      <p className="mt-4 text-sm text-[#A1A1AA] leading-relaxed">
        {category.insight}
      </p>
    </motion.div>
  );
}

export default function BreakdownGrid({ data }: { data: BreakdownData }) {
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
            Detailed Breakdown
          </h2>
          <p className="text-[#A1A1AA]">
            Performance analysis across key metrics
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.categories.map((category, index) => (
            <CategoryCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
