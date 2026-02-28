'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * Enhanced cursor glow with:
 * - Multiple layered glow rings (blue + purple)
 * - Spring-based smooth following
 * - Hidden on mobile (no hover)
 */
export default function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    // Detect touch devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(isTouch);
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [x, y]);

  if (isMobile) return null;

  return (
    <>
      {/* Outer glow — large, subtle purple */}
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full mix-blend-screen"
        style={{
          x,
          y,
          width: 500,
          height: 500,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, rgba(129, 140, 248, 0.03) 40%, transparent 70%)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Inner glow — smaller, brighter blue */}
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full mix-blend-screen"
        style={{
          x,
          y,
          width: 200,
          height: 200,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.10) 0%, rgba(167, 139, 250, 0.05) 50%, transparent 70%)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </>
  );
}
