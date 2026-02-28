'use client';

import { useState, useEffect } from 'react';

interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    /** Recommended particle count multiplier (0.2 mobile, 0.5 tablet, 1.0 desktop) */
    particleMultiplier: number;
    /** Recommended max DPR */
    maxDpr: number;
}

/**
 * Detects device type for adaptive 3D complexity.
 * Reduces particles, geometry detail, and DPR on mobile/tablet.
 */
export function useMobileDetect(): DeviceInfo {
    const [device, setDevice] = useState<DeviceInfo>({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        particleMultiplier: 1,
        maxDpr: 2,
    });

    useEffect(() => {
        const check = () => {
            const w = window.innerWidth;
            const isMobile = w < 768;
            const isTablet = w >= 768 && w < 1024;
            const isDesktop = w >= 1024;

            setDevice({
                isMobile,
                isTablet,
                isDesktop,
                particleMultiplier: isMobile ? 0.2 : isTablet ? 0.5 : 1,
                maxDpr: isMobile ? 1 : isTablet ? 1.5 : 2,
            });
        };

        check();
        window.addEventListener('resize', check, { passive: true });
        return () => window.removeEventListener('resize', check);
    }, []);

    return device;
}
