'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import TextReveal from '@/components/ui/TextReveal';

const features = [
    {
        icon: '🎯',
        title: 'Profile Analysis',
        description: 'Deep scan of your bio, visual identity, and content strategy with AI-driven insights.',
        gradient: 'from-blue-500/20 to-purple-500/20',
    },
    {
        icon: '📊',
        title: 'Engagement Metrics',
        description: 'Understand what drives interaction. Get detailed breakdowns of your engagement patterns.',
        gradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
        icon: '🚀',
        title: 'Growth Strategy',
        description: 'Personalized action plan to boost followers, reach, and engagement with proven techniques.',
        gradient: 'from-cyan-500/20 to-blue-500/20',
    },
    {
        icon: '🧠',
        title: 'AI Recommendations',
        description: 'Smart suggestions powered by machine learning, tailored to your niche and audience.',
        gradient: 'from-pink-500/20 to-orange-500/20',
    },
    {
        icon: '📈',
        title: 'Trend Detection',
        description: 'Stay ahead of the curve with real-time trending analysis for your content category.',
        gradient: 'from-green-500/20 to-cyan-500/20',
    },
    {
        icon: '⚡',
        title: 'Instant Results',
        description: 'No sign-up required. Get comprehensive analysis delivered in under 30 seconds.',
        gradient: 'from-yellow-500/20 to-orange-500/20',
    },
];

/**
 * Features section — mobile-optimized:
 * - Responsive grid (1 col mobile, 2 md, 3 lg)
 * - Proper card padding on all screens
 * - Reduced section padding on mobile
 * - Responsive heading sizes
 */
export default function FeaturesSection() {
    return (
        <section className="relative py-20 sm:py-28 lg:py-36 px-5 sm:px-6 overflow-hidden">
            {/* Background gradient blobs */}
            <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[rgba(99,102,241,0.03)] rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[rgba(129,140,248,0.03)] rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full
                       bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.15)]
                       text-xs sm:text-sm text-gradient-cool"
                    >
                        Features
                    </motion.div>

                    <h2 className="text-[clamp(1.6rem,6vw,3.5rem)] font-bold mb-4 sm:mb-6 tracking-[-0.02em]">
                        <TextReveal delay={0.1}>
                            Everything you need to
                        </TextReveal>
                        <TextReveal delay={0.3} className="text-gradient-vibrant">
                            dominate Instagram
                        </TextReveal>
                    </h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-xl mx-auto px-2"
                    >
                        Powered by advanced AI to give you insights that actually matter.
                    </motion.p>
                </div>

                {/* Feature Cards Grid — responsive columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 max-w-6xl mx-auto">
                    {features.map((feature, i) => (
                        <GlassCard key={feature.title} delay={0.08 * i} className="p-6 sm:p-7 lg:p-9 text-center">
                            {/* Icon with glow */}
                            <div className="relative mb-5 sm:mb-6 mx-auto w-fit">
                                <div className={`absolute inset-0 w-11 sm:w-14 h-11 sm:h-14 rounded-xl bg-linear-to-br ${feature.gradient} blur-xl`} />
                                <div className="relative w-11 sm:w-14 h-11 sm:h-14 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-xl sm:text-2xl">
                                    {feature.icon}
                                </div>
                            </div>

                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4">
                                {feature.title}
                            </h3>

                            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                                {feature.description}
                            </p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
