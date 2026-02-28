'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
    children: ReactNode;
    /** Animation mode */
    mode?: 'words' | 'lines';
    /** Stagger delay between items */
    stagger?: number;
    /** CSS class for the wrapper */
    className?: string;
    /** Delay before animation starts */
    delay?: number;
}

/**
 * Scroll-triggered text reveal with clip-path mask animation.
 * Supports word-by-word or line-by-line staggered reveal.
 */
export default function TextReveal({
    children,
    mode = 'words',
    stagger = 0.04,
    className = '',
    delay = 0,
}: TextRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    // If children is a string, split into words
    const text = typeof children === 'string' ? children : null;

    if (text && mode === 'words') {
        const words = text.split(' ');
        return (
            <div ref={ref} className={`flex flex-wrap gap-x-[0.3em] ${className}`}>
                {words.map((word, i) => (
                    <span key={i} className="overflow-hidden inline-block">
                        <motion.span
                            className="inline-block"
                            initial={{ y: '110%', opacity: 0 }}
                            animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: delay + i * stagger,
                                ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                        >
                            {word}
                        </motion.span>
                    </span>
                ))}
            </div>
        );
    }

    // Fallback: single block reveal
    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
                transition={{
                    duration: 0.8,
                    delay,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}
