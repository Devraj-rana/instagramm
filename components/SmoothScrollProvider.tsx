'use client';

import { useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import Lenis from 'lenis';

interface ScrollContextValue {
  /** Current scroll progress 0→1 */
  progress: number;
  /** Current scroll velocity */
  velocity: number;
  /** Lenis instance for imperative control */
  lenis: Lenis | null;
}

const ScrollContext = createContext<ScrollContextValue>({
  progress: 0,
  velocity: 0,
  lenis: null,
});

export const useSmoothScroll = () => useContext(ScrollContext);

/**
 * Global smooth scroll provider using Lenis.
 * Exposes scroll progress and velocity via context.
 */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const contextRef = useRef<ScrollContextValue>({
    progress: 0,
    velocity: 0,
    lenis: null,
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    contextRef.current.lenis = lenis;

    lenis.on('scroll', ({ progress, velocity }: { progress: number; velocity: number }) => {
      contextRef.current.progress = progress;
      contextRef.current.velocity = velocity;
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <ScrollContext.Provider value={contextRef.current}>
      {children}
    </ScrollContext.Provider>
  );
}
