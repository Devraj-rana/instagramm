'use client';

import { Suspense, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';

interface SceneContainerProps {
    children: ReactNode;
    /** CSS class for the container div */
    className?: string;
    /** Camera FOV */
    fov?: number;
    /** Camera position */
    cameraPosition?: [number, number, number];
    /** Max device pixel ratio */
    maxDpr?: number;
    /** Background color (CSS) */
    style?: React.CSSProperties;
}

/**
 * Reusable R3F Canvas wrapper with:
 * - Suspense boundary with loading fallback
 * - Adaptive DPR for performance
 * - Preloading of assets
 * - Configurable camera
 */
export default function SceneContainer({
    children,
    className = '',
    fov = 50,
    cameraPosition = [0, 0, 5],
    maxDpr = 2,
    style,
}: SceneContainerProps) {
    return (
        <div className={`${className}`} style={style}>
            <Suspense
                fallback={
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-purple)] border-t-transparent animate-spin" />
                    </div>
                }
            >
                <Canvas
                    camera={{ position: cameraPosition, fov }}
                    dpr={[1, maxDpr]}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance',
                    }}
                    style={{ background: 'transparent' }}
                >
                    <AdaptiveDpr pixelated />
                    <Preload all />
                    {children}
                </Canvas>
            </Suspense>
        </div>
    );
}
