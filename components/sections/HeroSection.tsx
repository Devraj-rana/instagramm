'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import TextReveal from '@/components/ui/TextReveal';
import MagneticButton from '@/components/ui/MagneticButton';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useMobileDetect } from '@/hooks/useMobileDetect';

// Lazy load 3D scene for performance
const SceneContainer = dynamic(() => import('@/components/three/SceneContainer'), { ssr: false });
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

interface HeroSectionProps {
    onCTAClick?: () => void;
}

/**
 * Fullscreen hero section — mobile-optimized:
 * - Responsive font sizes (clamp)
 * - Centered layout on all screens
 * - Reduced 3D complexity on mobile
 * - Proper spacing and padding
 */
export default function HeroSection({ onCTAClick }: HeroSectionProps) {
    const mouse = useMousePosition(0.05);
    const { isMobile, particleMultiplier, maxDpr } = useMobileDetect();

    return (
        <section className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden">
            {/* 3D Canvas Background */}
            <div className="absolute inset-0 z-0">
                <SceneContainer
                    className="w-full h-full"
                    fov={isMobile ? 55 : 45}
                    cameraPosition={isMobile ? [0, 0.5, 8] : [0, 0.5, 6]}
                    maxDpr={maxDpr}
                >
                    <HeroScene
                        mouse={isMobile ? { nx: 0, ny: 0 } : mouse}
                        particleCount={Math.floor(300 * particleMultiplier)}
                    />
                </SceneContainer>
            </div>

            {/* Gradient overlay for text readability — stronger on mobile */}
            <div className="absolute inset-0 z-1 bg-linear-to-b from-[rgba(9,9,11,0.4)] via-[rgba(9,9,11,0.15)] to-[rgba(9,9,11,0.85)] md:from-[rgba(9,9,11,0.3)] md:via-transparent md:to-[rgba(9,9,11,0.8)]" />

            {/* Content */}
            <div className="relative z-2 text-center max-w-4xl mx-auto px-5 sm:px-6">
                {/* Status badge */}
                <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="inline-flex items-center gap-2 mb-5 sm:mb-8 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full
                     bg-[rgba(168,85,247,0.08)] backdrop-blur-xl
                     border border-[rgba(168,85,247,0.15)]"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-purple opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-purple" />
                    </span>
                    <span className="text-xs sm:text-sm text-gradient">Powered by AI</span>
                </motion.div>

                {/* Headline — responsive clamp sizing */}
                <h1 className="text-[clamp(2rem,8vw,5rem)] font-bold mb-4 sm:mb-6 leading-[1.08] tracking-[-0.03em]">
                    <TextReveal delay={0.4}>
                        Analyze your
                    </TextReveal>
                    <TextReveal delay={0.6} className="text-gradient-instagram">
                        Instagram profile
                    </TextReveal>
                </h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="text-sm sm:text-lg text-gray-300 max-w-lg sm:max-w-2xl mx-auto mb-7 sm:mb-10 leading-relaxed px-2"
                >
                    Get instant AI-powered insights to understand your profile&apos;s strengths
                    and discover growth opportunities.
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                >
                    <MagneticButton onClick={onCTAClick} strength={isMobile ? 0 : 25}>
                        Get Started — It&apos;s Free
                    </MagneticButton>
                </motion.div>
            </div>

            {/* Scroll indicator — hidden on very small screens */}
            <motion.div
                className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-2 flex-col items-center gap-2 hidden sm:flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 1 }}
            >
                <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
                <motion.div
                    className="w-5 h-8 rounded-full border border-[rgba(255,255,255,0.1)] flex justify-center pt-1.5"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <motion.div
                        className="w-1 h-2 rounded-full bg-gradient-modern"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
