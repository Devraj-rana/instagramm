'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    /** Enable animated gradient border on hover */
    glowBorder?: boolean;
    /** Delay for staggered entrance */
    delay?: number;
}

/**
 * Glassmorphism card with:
 * - Frosted glass background
 * - Mouse-tracking spotlight overlay
 * - Hover lift + glow intensification
 * - Animated gradient border
 */
export default function GlassCard({
    children,
    className = '',
    glowBorder = true,
    delay = 0,
}: GlassCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
        relative overflow-hidden rounded-2xl
        bg-[rgba(15,15,23,0.6)] backdrop-blur-xl
        border border-[rgba(255,255,255,0.06)]
        transition-all duration-500 ease-out
        ${isHovered ? 'border-[rgba(99,102,241,0.15)] shadow-[0_0_40px_rgba(99,102,241,0.06)]' : ''}
        ${isHovered ? '-translate-y-1' : ''}
        ${className}
      `}
            style={{
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
            }}
        >
            {/* Mouse spotlight overlay */}
            {isHovered && (
                <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-60 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.05), transparent 60%)`,
                    }}
                />
            )}

            {/* Gradient border glow on hover */}
            {glowBorder && isHovered && (
                <div
                    className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-100 transition-opacity duration-500"
                    style={{
                        padding: '1px',
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3), rgba(217,70,239,0.3))',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        borderRadius: 'inherit',
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
