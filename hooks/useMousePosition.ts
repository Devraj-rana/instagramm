'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface MousePosition {
    /** Raw pixel X */
    x: number;
    /** Raw pixel Y */
    y: number;
    /** Normalized X (-1 to 1) */
    nx: number;
    /** Normalized Y (-1 to 1) */
    ny: number;
}

/**
 * Tracks mouse position with smoothed normalized coords for parallax/lighting.
 * Uses lerp interpolation for fluid movement without jank.
 */
export function useMousePosition(smoothing = 0.08): MousePosition {
    const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0, nx: 0, ny: 0 });
    const target = useRef({ nx: 0, ny: 0 });
    const current = useRef({ nx: 0, ny: 0 });
    const rafId = useRef<number>(0);

    const lerp = (start: number, end: number, factor: number) =>
        start + (end - start) * factor;

    const animate = useCallback(() => {
        current.current.nx = lerp(current.current.nx, target.current.nx, smoothing);
        current.current.ny = lerp(current.current.ny, target.current.ny, smoothing);

        setPosition((prev) => ({
            ...prev,
            nx: current.current.nx,
            ny: current.current.ny,
        }));

        rafId.current = requestAnimationFrame(animate);
    }, [smoothing]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = -(e.clientY / window.innerHeight) * 2 + 1;
            target.current = { nx, ny };
            setPosition((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        rafId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafId.current);
        };
    }, [animate]);

    return position;
}
