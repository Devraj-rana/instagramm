'use client';

import { useState, useEffect, useRef } from 'react';

interface ScrollProgress {
    /** 0→1 progress of element through viewport */
    progress: number;
    /** Whether the element is in the viewport */
    isInView: boolean;
}

/**
 * Tracks scroll progress of a ref element through the viewport.
 * Uses IntersectionObserver + scroll listener for efficiency.
 */
export function useScrollProgress(): [React.RefObject<HTMLDivElement | null>, ScrollProgress] {
    const ref = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
        progress: 0,
        isInView: false,
    });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let isInView = false;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isInView = entry.isIntersecting;
                setScrollProgress((prev) => ({ ...prev, isInView }));
            },
            { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
        );

        const handleScroll = () => {
            if (!isInView || !el) return;

            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Progress: 0 when element enters bottom, 1 when exits top
            const progress = Math.max(
                0,
                Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height))
            );

            setScrollProgress({ progress, isInView: true });
        };

        observer.observe(el);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return [ref, scrollProgress];
}
