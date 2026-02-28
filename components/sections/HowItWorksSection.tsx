'use client';

import { motion } from 'framer-motion';
import TextReveal from '@/components/ui/TextReveal';

const steps = [
    {
        number: '01',
        title: 'Enter Username',
        description: 'Simply type in any public Instagram username. No login or authentication required.',
        icon: '📝',
        gradient: 'from-purple-500/20 via-violet-500/20 to-purple-500/20',
        color: 'var(--accent-purple)',
    },
    {
        number: '02',
        title: 'AI Analysis',
        description: 'Our advanced AI scans profile data, content patterns, and engagement metrics in real-time.',
        icon: '🤖',
        gradient: 'from-pink-500/20 via-fuchsia-500/20 to-pink-500/20',
        color: 'var(--accent-pink)',
    },
    {
        number: '03',
        title: 'Get Insights',
        description: 'Receive actionable recommendations, growth strategies, and detailed performance breakdown.',
        icon: '✨',
        gradient: 'from-orange-500/20 via-amber-500/20 to-orange-500/20',
        color: 'var(--accent-orange)',
    },
];

/**
 * How It Works section — clean step-by-step process
 */
export default function HowItWorksSection() {
    return (
        <section className="relative py-20 sm:py-28 lg:py-36 px-5 sm:px-6 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-surface to-transparent opacity-50" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full
                       bg-[rgba(167,139,250,0.08)] border border-[rgba(167,139,250,0.15)]
                       text-xs sm:text-sm text-gradient"
                    >
                        How It Works
                    </motion.div>

                    <h2 className="text-[clamp(1.6rem,6vw,3.5rem)] font-bold mb-4 sm:mb-6 tracking-[-0.02em]">
                        <TextReveal delay={0.1}>
                            Three simple steps to
                        </TextReveal>
                        <TextReveal delay={0.3} className="text-gradient-instagram">
                            Instagram mastery
                        </TextReveal>
                    </h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto px-2"
                    >
                        Get professional-grade insights in seconds, completely free.
                    </motion.p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 * i }}
                            className="relative group"
                        >
                            {/* Connecting line (desktop only) */}
                            {i < steps.length - 1 && (
                                <div className="hidden md:block absolute top-16 left-full w-full h-px">
                                    <div
                                        className="h-full bg-linear-to-r from-[rgba(255,255,255,0.08)] to-transparent"
                                        style={{
                                            background: `linear-gradient(to right, ${step.color}40, transparent)`,
                                        }}
                                    />
                                </div>
                            )}

                            {/* Card */}
                            <div className="relative h-full p-7 sm:p-9 rounded-2xl border border-[rgba(255,255,255,0.08)] 
                          bg-[rgba(17,17,17,0.60)] backdrop-blur-xl
                          transition-all duration-500 hover:border-[rgba(255,255,255,0.15)]
                          hover:shadow-[0_0_40px_rgba(102,126,234,0.15)]">
                                {/* Step number */}
                                <div className="absolute -top-4 -left-4 w-14 h-14 rounded-full 
                              flex items-center justify-center
                              font-bold text-base
                              border-2 border-[rgba(167,139,250,0.25)]
                              bg-elevated
                              transition-all duration-500 group-hover:scale-110"
                                    style={{ color: step.color }}>
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className="mb-6 text-6xl sm:text-7xl opacity-90 text-center
                             transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white text-center">
                                    {step.title}
                                </h3>

                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed text-center">
                                    {step.description}
                                </p>

                                {/* Gradient overlay */}
                                <div
                                    className={`absolute inset-0 rounded-2xl bg-linear-to-br ${step.gradient} 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
