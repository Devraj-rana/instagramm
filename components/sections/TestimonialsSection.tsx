'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import TextReveal from '@/components/ui/TextReveal';

const testimonials = [
    {
        name: 'Sarah Chen',
        handle: '@sarahcreates',
        role: 'Content Creator',
        followers: '125K',
        image: '👩‍🎨',
        quote: 'This tool completely changed how I approach Instagram. The AI insights helped me increase engagement by 300% in just two months!',
        gradient: 'from-purple-500/10 to-pink-500/10',
    },
    {
        name: 'Marcus Rodriguez',
        handle: '@marcusfitness',
        role: 'Fitness Influencer',
        followers: '89K',
        image: '💪',
        quote: 'The profile analysis was spot-on. Implemented the recommendations and gained 20K followers in 3 weeks. Absolutely game-changing.',
        gradient: 'from-blue-500/10 to-cyan-500/10',
    },
    {
        name: 'Emma Thompson',
        handle: '@emmastyle',
        role: 'Fashion Blogger',
        followers: '210K',
        image: '👗',
        quote: 'Finally, actionable insights instead of generic advice. The AI understands my niche better than expensive consultants I\'ve hired.',
        gradient: 'from-pink-500/10 to-orange-500/10',
    },
    {
        name: 'David Kim',
        handle: '@davidtravels',
        role: 'Travel Photographer',
        followers: '156K',
        image: '📸',
        quote: 'The trend detection feature is incredible. I\'m always ahead of the curve now. My reach has doubled in the past month.',
        gradient: 'from-cyan-500/10 to-green-500/10',
    },
    {
        name: 'Olivia Martinez',
        handle: '@oliviacooks',
        role: 'Food Influencer',
        followers: '178K',
        image: '👩‍🍳',
        quote: 'Best investment of time I\'ve made. The growth strategy was personalized and actually worked. Engagement is through the roof!',
        gradient: 'from-orange-500/10 to-yellow-500/10',
    },
    {
        name: 'Alex Turner',
        handle: '@alextech',
        role: 'Tech Reviewer',
        followers: '95K',
        image: '💻',
        quote: 'As someone who analyzes tech, I\'m impressed by the AI accuracy. The recommendations are data-driven and highly effective.',
        gradient: 'from-indigo-500/10 to-purple-500/10',
    },
];

/**
 * Testimonials section — social proof with user reviews
 */
export default function TestimonialsSection() {
    return (
        <section className="relative py-20 sm:py-28 lg:py-36 px-5 sm:px-6 overflow-hidden">
            {/* Background gradient blobs */}
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[rgba(236,72,153,0.04)] rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[rgba(168,85,247,0.04)] rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full
                       bg-[rgba(236,72,153,0.08)] border border-[rgba(236,72,153,0.15)]
                       text-xs sm:text-sm text-gradient-instagram"
                    >
                        Testimonials
                    </motion.div>

                    <h2 className="text-[clamp(1.6rem,6vw,3.5rem)] font-bold mb-4 sm:mb-6 tracking-[-0.02em]">
                        <TextReveal delay={0.1}>
                            Loved by thousands of
                        </TextReveal>
                        <TextReveal delay={0.3} className="text-gradient-vibrant">
                            Instagram creators
                        </TextReveal>
                    </h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-sm sm:text-base lg:text-lg text-[--text-secondary] max-w-2xl mx-auto px-2"
                    >
                        Join successful creators who transformed their Instagram presence.
                    </motion.p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, i) => (
                        <GlassCard
                            key={testimonial.handle}
                            delay={0.08 * i}
                            className="p-7 sm:p-8 flex flex-col h-full text-center"
                        >
                            {/* Avatar centered */}
                            <div className="text-5xl sm:text-6xl mb-5 mx-auto">{testimonial.image}</div>

                            {/* Name and handle */}
                            <div className="mb-5">
                                <h4 className="font-bold text-lg sm:text-xl text-white mb-1.5">
                                    {testimonial.name}
                                </h4>
                                <p className="text-sm sm:text-base text-gray-400 mb-2.5">
                                    {testimonial.handle}
                                </p>
                                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                                    <span className="text-gray-400">
                                        {testimonial.role}
                                    </span>
                                    <span className="text-gray-600">•</span>
                                    <span className="text-gradient font-semibold">
                                        {testimonial.followers}
                                    </span>
                                </div>
                            </div>

                            {/* Quote */}
                            <blockquote className="text-sm sm:text-base text-gray-300 leading-relaxed flex-1 mb-5">
                                &quot;{testimonial.quote}&quot;
                            </blockquote>

                            {/* Rating stars centered */}
                            <div className="flex gap-1 text-yellow-400 justify-center text-xl">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
                            </div>

                            {/* Gradient overlay on hover */}
                            <div
                                className={`absolute inset-0 rounded-2xl bg-linear-to-br ${testimonial.gradient} 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                            />
                        </GlassCard>
                    ))}
                </div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10
                   p-8 sm:p-10 lg:p-12 rounded-3xl 
                   border border-[rgba(168,85,247,0.2)]
                   bg-[rgba(10,10,10,0.9)] backdrop-blur-xl
                   shadow-[0_0_80px_rgba(168,85,247,0.1)]"
                >
                    {[
                        { label: 'Active Users', value: '50K+' },
                        { label: 'Profiles Analyzed', value: '1M+' },
                        { label: 'Avg. Engagement Boost', value: '215%' },
                        { label: 'User Satisfaction', value: '4.9/5' },
                    ].map((stat, i) => (
                        <motion.div 
                            key={stat.label} 
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.7 + (i * 0.1) }}
                        >
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-instagram mb-3">
                                {stat.value}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400 font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
