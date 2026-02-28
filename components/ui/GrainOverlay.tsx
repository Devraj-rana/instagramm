'use client';

/**
 * Fullscreen film grain overlay.
 * Uses CSS animation with SVG noise filter for subtle analog texture.
 * Fixed position, pointer-events-none — sits above all content.
 */
export default function GrainOverlay() {
    return (
        <div
            className="grain-overlay"
            aria-hidden="true"
        />
    );
}
