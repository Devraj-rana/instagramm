'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import TextReveal from '@/components/ui/TextReveal';
import GlassCard from '@/components/ui/GlassCard';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useMobileDetect } from '@/hooks/useMobileDetect';

const SceneContainer = dynamic(() => import('@/components/three/SceneContainer'), { ssr: false });
const ScrollScene = dynamic(() => import('@/components/three/ScrollScene'), { ssr: false });

const stats = [
    { value: 10000, suffix: '+', label: 'Profiles Analyzed' },
    { value: 98, suffix: '%', label: 'Accuracy Rate' },
    { value: 30, suffix: 's', label: 'Analysis Time' },
    { value: 4.9, suffix: '⭐', label: 'User Rating', decimals: 1 },
];

/**
 * Animated counter that counts up to target value when in view.
 */
function AnimatedCounter({
    value,
    suffix,
    decimals = 0,
}: {
    value: number;
    suffix: string;
    decimals?: number;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        const duration = 2000;
        const steps = 60;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            const t = step / steps;
            const eased = 1 - Math.pow(1 - t, 3);
            setCount(value * eased);

            if (step >= steps) {
                setCount(value);
                clearInterval(interval);
            }
        }, duration / steps);

        return () => clearInterval(interval);
    }, [isInView, value]);

    return (
        <div ref={ref} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-instagram">
            {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
            <span className="text-base sm:text-lg lg:text-2xl ml-1">{suffix}</span>
        </div>
    );
}

/**
 * Showcase section — mobile-optimized:
 * - No 3D canvas on mobile (fallback gradient)
 * - Responsive stat counter sizes
 * - Stacked showcase cards on mobile
 * - Responsive section padding
 */
export default function ShowcaseSection() {
    const mouse = useMousePosition(0.05);
    const [sectionRef, { progress }] = useScrollProgress();
    const { particleMultiplier, maxDpr, isMobile } = useMobileDetect();

    return (
        <section ref={sectionRef} className="relative min-h-[80vh] lg:min-h-[120vh] py-20 sm:py-28 lg:py-36 overflow-hidden">
            {/* 3D Background — desktop only */}
            {!isMobile && (
                <div className="absolute inset-0 z-0 opacity-60">
                    <SceneContainer
                        className="w-full h-full"
                        fov={50}
                        cameraPosition={[0, 0, 5]}
                        maxDpr={maxDpr}
                    >
                        <ScrollScene
                            mouse={mouse}
                            scrollProgress={progress}
                            particleCount={Math.floor(150 * particleMultiplier)}
                        />
                    </SceneContainer>
                </div>
            )}

            {/* Mobile gradient fallback */}
            {isMobile && (
                <div className="absolute inset-0 z-0 bg-linear-to-b from-void via-[rgba(168,85,247,0.04)] to-void" />
            )}

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
                {/* Section header */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full
                       bg-[rgba(168,85,247,0.08)] border border-[rgba(168,85,247,0.15)]
                       text-xs sm:text-sm text-gradient"
                    >
                        Why Choose Us
                    </motion.div>

                    <h2 className="text-[clamp(1.5rem,6vw,3.5rem)] font-bold mb-4 sm:mb-6 tracking-[-0.02em]">
                        <TextReveal delay={0.1}>
                            Built for creators who
                        </TextReveal>
                        <TextReveal delay={0.3} className="text-gradient-modern">
                            demand excellence
                        </TextReveal>
                    </h2>
                </div>

                {/* Stats Row — 2x2 grid on mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-12 sm:mb-16 lg:mb-20 max-w-6xl mx-auto">
                    {stats.map((stat, i) => (
                        <GlassCard key={stat.label} delay={0.1 * i} className="p-5 sm:p-6 lg:p-7 text-center">
                            <AnimatedCounter
                                value={stat.value}
                                suffix={stat.suffix}
                                decimals={stat.decimals}
                            />
                            <p className="text-xs sm:text-sm lg:text-base text-gray-400 mt-2 sm:mt-3">{stat.label}</p>
                        </GlassCard>
                    ))}
                </div>

                {/* Showcase Cards — stacked on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
                    <motion.div
                        style={{
                            y: isMobile ? 0 : progress * -30,
                        }}
                    >
                        <GlassCard delay={0.2} className="p-6 sm:p-7 lg:p-9">
                            <div className="mb-4 sm:mb-5 text-3xl sm:text-4xl">🔍</div>
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-white">
                                Deep Profile Analysis
                            </h3>
                            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-5">
                                Our AI scans every visible aspect of your Instagram presence — from bio
                                optimization and visual consistency to posting patterns and hashtag strategy.
                            </p>
                            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                {['Bio Scan', 'Visual AI', 'Content Analysis', 'Hashtag Audit'].map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm
                               bg-[rgba(168,85,247,0.08)] border border-[rgba(168,85,247,0.15)]
                               text-gradient font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>

                    <motion.div
                        style={{
                            y: isMobile ? 0 : progress * -60 + 30,
                        }}
                    >
                        <GlassCard delay={0.4} className="p-6 sm:p-7 lg:p-9">
                            <div className="mb-4 sm:mb-5 text-3xl sm:text-4xl">💡</div>
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-white">
                                Actionable Insights
                            </h3>
                            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-5">
                                No vague advice. Every recommendation comes with specific steps, priority levels,
                                and expected impact metrics for your growth.
                            </p>
                            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                {['Priority System', 'Step-by-Step', 'Impact Score', 'Timeline'].map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm
                               bg-[rgba(168,85,247,0.08)] border border-[rgba(168,85,247,0.15)]
                               text-gradient font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
