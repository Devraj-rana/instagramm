'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
    count?: number;
    spread?: number;
    size?: number;
    color1?: string;
    color2?: string;
    speed?: number;
}

/**
 * Performance-optimized instanced mesh particle system.
 * Floating light particles with gentle orbital motion.
 */
export default function FloatingParticles({
    count = 200,
    spread = 15,
    size = 0.015,
    color1 = '#6366F1',
    color2 = '#A78BFA',
    speed = 0.3,
}: FloatingParticlesProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate particle initial positions and random data
    const particles = useMemo(() => {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * spread,
                    (Math.random() - 0.5) * spread,
                    (Math.random() - 0.5) * spread
                ),
                speed: 0.2 + Math.random() * 0.8,
                offset: Math.random() * Math.PI * 2,
                radius: 0.5 + Math.random() * 2.0,
                phase: Math.random() * Math.PI * 2,
            });
        }
        return data;
    }, [count, spread]);

    // Pre-compute colors for the instanced mesh
    const colorArray = useMemo(() => {
        const c1 = new THREE.Color(color1);
        const c2 = new THREE.Color(color2);
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const t = Math.random();
            const color = new THREE.Color().lerpColors(c1, c2, t);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        return colors;
    }, [count, color1, color2]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.elapsedTime * speed;

        for (let i = 0; i < count; i++) {
            const p = particles[i];

            // Gentle orbital motion
            const x = p.position.x + Math.sin(time * p.speed + p.offset) * p.radius;
            const y = p.position.y + Math.cos(time * p.speed * 0.7 + p.phase) * p.radius * 0.6;
            const z = p.position.z + Math.sin(time * p.speed * 0.5 + p.offset + p.phase) * p.radius * 0.4;

            dummy.position.set(x, y, z);

            // Subtle scale pulsing
            const scale = 0.7 + Math.sin(time * 2 + p.offset) * 0.3;
            dummy.scale.setScalar(scale);

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[size, 6, 6]} />
            <meshBasicMaterial transparent opacity={0.6} toneMapped={false}>
                <instancedBufferAttribute
                    attach="geometry-attributes-color"
                    args={[colorArray, 3]}
                />
            </meshBasicMaterial>
        </instancedMesh>
    );
}
