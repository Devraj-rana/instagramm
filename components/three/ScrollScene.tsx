'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import FloatingParticles from './FloatingParticles';
import { gradientBackgroundVertex, gradientBackgroundFragment } from '@/shaders/gradientBackground';

/**
 * Shader background plane — animated deep space gradient.
 */
function GradientBackground({ mouse }: { mouse: { nx: number; ny: number } }) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
            materialRef.current.uniforms.uMouse.value.set(mouse.nx, mouse.ny);
        }
    });

    return (
        <mesh position={[0, 0, -10]}>
            <planeGeometry args={[50, 50]} />
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={gradientBackgroundVertex}
                fragmentShader={gradientBackgroundFragment}
            />
        </mesh>
    );
}

/**
 * Orbiting rings — geometric decoration elements.
 */
function OrbitalRings() {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.z = state.clock.elapsedTime * 0.05;
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
        }
    });

    return (
        <group ref={group} position={[0, 0, -3]}>
            {[2.5, 3.5, 4.8].map((radius, i) => (
                <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
                    <torusGeometry args={[radius, 0.005, 8, 128]} />
                    <meshBasicMaterial
                        color={i === 0 ? '#6366F1' : i === 1 ? '#818CF8' : '#A78BFA'}
                        transparent
                        opacity={0.15 - i * 0.03}
                    />
                </mesh>
            ))}
        </group>
    );
}

interface ScrollSceneProps {
    mouse: { nx: number; ny: number };
    scrollProgress?: number;
    particleCount?: number;
}

/**
 * Scroll-driven 3D scene:
 * - Shader gradient background
 * - Floating particles
 * - Orbital decorative rings
 * - Camera dolly based on scroll progress
 * - Bloom postprocessing
 */
export default function ScrollScene({
    mouse,
    scrollProgress = 0,
    particleCount = 150,
}: ScrollSceneProps) {
    const cameraTarget = useRef(new THREE.Vector3(0, 0, 5));

    useFrame(({ camera }) => {
        // Scroll-driven camera dolly
        const targetZ = 5 - scrollProgress * 3;
        const targetY = scrollProgress * 1.5;
        cameraTarget.current.set(mouse.nx * 0.3, targetY + mouse.ny * 0.2, targetZ);

        camera.position.lerp(cameraTarget.current, 0.03);
        camera.lookAt(0, scrollProgress * 0.5, -5);
    });

    return (
        <>
            <ambientLight intensity={0.1} />
            <pointLight position={[3, 3, 3]} intensity={0.7} color="#6366F1" distance={15} />
            <pointLight position={[-3, -2, 2]} intensity={0.4} color="#818CF8" distance={12} />

            <GradientBackground mouse={mouse} />
            <OrbitalRings />
            <FloatingParticles count={particleCount} spread={18} speed={0.15} />

            <fog attach="fog" args={['#09090B', 8, 30]} />

            <EffectComposer>
                <Bloom
                    intensity={0.5}
                    luminanceThreshold={0.3}
                    luminanceSmoothing={0.8}
                    mipmapBlur
                />
            </EffectComposer>
        </>
    );
}
