'use client';

import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import { useMobileDetect } from '@/hooks/useMobileDetect';

interface CTASectionProps {
    onCTAClick?: () => void;
}

/**
 * Final CTA section — encourage users to take action
 */
export default function CTASection({ onCTAClick }: CTASectionProps) {
    const { isMobile } = useMobileDetect();

    return (
        <section className="relative py-20 sm:py-28 lg:py-36 px-5 sm:px-6 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-radial from-[rgba(168,85,247,0.08)] via-transparent to-transparent" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgba(236,72,153,0.06)] rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[rgba(59,130,246,0.06)] rounded-full blur-3xl animate-pulse" 
                     style={{ animationDelay: '1s' }} />
            </div>

            {/* Border lines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Main card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative p-10 sm:p-14 lg:p-20 rounded-3xl 
                   border-2 border-[rgba(167,139,250,0.25)]
                   bg-[rgba(10,10,10,0.85)] backdrop-blur-xl
                   shadow-[0_12px_48px_rgba(0,0,0,0.6)]
                   overflow-hidden group"
                >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Animated border gradient */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                         style={{
                             background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.1) 50%, rgba(249,115,22,0.1) 100%)',
                             filter: 'blur(20px)',
                         }} />

                    {/* Content */}
                    <div className="relative z-10 text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-5 py-2.5 rounded-full
                         bg-[rgba(168,85,247,0.12)] border border-[rgba(168,85,247,0.25)]"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-purple opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-purple" />
                            </span>
                            <span className="text-sm sm:text-base font-semibold text-gradient">
                                Limited Time — Completely Free
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-[clamp(2rem,6vw,4rem)] font-bold mb-5 sm:mb-6 tracking-[-0.02em] leading-[1.1]"
                        >
                            Ready to transform your
                            <br />
                            <span className="text-gradient-instagram">Instagram presence?</span>
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-base sm:text-lg lg:text-xl text-gray-300
                         max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed"
                        >
                            Join thousands of creators who are already crushing it on Instagram.
                            Get your free AI-powered analysis in seconds.
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mb-10"
                        >
                            <MagneticButton
                                onClick={onCTAClick}
                                strength={isMobile ? 0 : 30}
                                className="text-lg sm:text-xl px-10 sm:px-12 py-5 sm:py-6 font-bold"
                            >
                                Analyze Your Profile Now
                            </MagneticButton>
                        </motion.div>

                        {/* Trust indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm sm:text-base text-gray-400"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-green-400 text-lg">✓</span>
                                <span>No login required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400 text-lg">✓</span>
                                <span>100% Free forever</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400 text-lg">✓</span>
                                <span>Instant results</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-accent-purple rounded-tl-3xl opacity-30" />
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-accent-pink rounded-br-3xl opacity-30" />
                </motion.div>
            </div>
        </section>
    );
}
