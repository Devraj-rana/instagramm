'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    /** Magnetic pull strength (px) */
    strength?: number;
    /** Enable glow pulse effect */
    glow?: boolean;
}

/**
 * Magnetic button with:
 * - Cursor attraction on hover
 * - Scale + glow pulse
 * - Gradient accent background
 * - Premium hover state
 */
export default function MagneticButton({
    children,
    className = '',
    onClick,
    strength = 20,
    glow = true,
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;

        setPosition({
            x: deltaX * strength,
            y: deltaY * strength,
        });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <motion.button
            ref={buttonRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            animate={{
                x: position.x,
                y: position.y,
            }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            whileTap={{ scale: 0.95 }}
            className={`
        relative px-8 py-4 rounded-xl font-semibold text-white
        bg-gradient-modern
        overflow-hidden cursor-pointer
        transition-shadow duration-500 ease-out
        ${isHovered && glow ? 'shadow-[0_0_50px_rgba(168,85,247,0.3),0_0_100px_rgba(168,85,247,0.15)]' : 'shadow-[0_0_20px_rgba(168,85,247,0.1)]'}
        ${className}
      `}
        >
            {/* Shimmer overlay on hover */}
            <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent"
                initial={{ x: '-100%' }}
                animate={isHovered ? { x: '200%' } : { x: '-100%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {/* Inner glow */}
            <div
                className="absolute inset-0 rounded-xl transition-opacity duration-300"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
                    opacity: isHovered ? 1 : 0,
                }}
            />

            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}
