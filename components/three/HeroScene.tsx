'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import FloatingParticles from './FloatingParticles';
import GridFloor from './GridFloor';
import { noiseMaterialVertex, noiseMaterialFragment } from '@/shaders/noiseMaterial';

/**
 * Morphing icosahedron with custom noise shader displacement.
 * Dynamic lighting that reacts to mouse position.
 */
function MorphingGeometry({ mouse }: { mouse: { nx: number; ny: number } }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSpeed: { value: 0.4 },
        uNoiseStrength: { value: 0.35 },
        uFrequency: { value: 1.2 },
        uColor1: { value: new THREE.Color('#141420') },
        uColor2: { value: new THREE.Color('#6366F1') },
        uColor3: { value: new THREE.Color('#A78BFA') },
    }), []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = time;
        }

        if (meshRef.current) {
            // Gentle floating rotation
            meshRef.current.rotation.y = time * 0.1;
            meshRef.current.rotation.x = Math.sin(time * 0.15) * 0.15;

            // Mouse-based parallax position shift
            meshRef.current.position.x = THREE.MathUtils.lerp(
                meshRef.current.position.x,
                mouse.nx * 0.3,
                0.02
            );
            meshRef.current.position.y = THREE.MathUtils.lerp(
                meshRef.current.position.y,
                mouse.ny * 0.2 + 0.3,
                0.02
            );
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0.3, 0]}>
            <icosahedronGeometry args={[1.8, 64]} />
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={noiseMaterialVertex}
                fragmentShader={noiseMaterialFragment}
            />
        </mesh>
    );
}

/**
 * Dynamic lights that follow mouse position for cinematic feel.
 */
function DynamicLights({ mouse }: { mouse: { nx: number; ny: number } }) {
    const light1Ref = useRef<THREE.PointLight>(null);
    const light2Ref = useRef<THREE.PointLight>(null);

    useFrame(() => {
        if (light1Ref.current) {
            light1Ref.current.position.x = THREE.MathUtils.lerp(
                light1Ref.current.position.x,
                mouse.nx * 5,
                0.03
            );
            light1Ref.current.position.y = THREE.MathUtils.lerp(
                light1Ref.current.position.y,
                mouse.ny * 3 + 3,
                0.03
            );
        }
        if (light2Ref.current) {
            light2Ref.current.position.x = THREE.MathUtils.lerp(
                light2Ref.current.position.x,
                -mouse.nx * 4,
                0.02
            );
            light2Ref.current.position.y = THREE.MathUtils.lerp(
                light2Ref.current.position.y,
                -mouse.ny * 2 + 2,
                0.02
            );
        }
    });

    return (
        <>
            <ambientLight intensity={0.12} color="#9898B8" />
            <pointLight
                ref={light1Ref}
                position={[5, 3, 4]}
                intensity={1.6}
                color="#6366F1"
                distance={20}
                decay={2}
            />
            <pointLight
                ref={light2Ref}
                position={[-4, 2, -3]}
                intensity={1.2}
                color="#818CF8"
                distance={18}
                decay={2}
            />
            <spotLight
                position={[0, 8, 2]}
                angle={0.4}
                penumbra={1}
                intensity={0.6}
                color="#A78BFA"
                distance={25}
                decay={2}
            />
        </>
    );
}

/**
 * Mouse-reactive camera with subtle parallax movement.
 */
function ParallaxCamera({ mouse }: { mouse: { nx: number; ny: number } }) {
    const { camera } = useThree();

    useFrame(() => {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.nx * 0.5, 0.02);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.ny * 0.3 + 0.5, 0.02);
        camera.lookAt(0, 0, 0);
    });

    return null;
}

interface HeroSceneProps {
    mouse: { nx: number; ny: number };
    particleCount?: number;
}

/**
 * Full hero 3D scene:
 * - Morphing icosahedron with noise shader
 * - Dynamic mouse-reactive lighting
 * - Floating particles
 * - Animated grid floor
 * - Postprocessing (Bloom, Noise, Vignette)
 * - Parallax camera
 */
export default function HeroScene({ mouse, particleCount = 200 }: HeroSceneProps) {
    return (
        <>
            <ParallaxCamera mouse={mouse} />
            <DynamicLights mouse={mouse} />
            <MorphingGeometry mouse={mouse} />
            <FloatingParticles count={particleCount} spread={12} />
            <GridFloor />

            {/* Depth fog simulation */}
            <fog attach="fog" args={['#09090B', 5, 25]} />

            {/* Postprocessing stack */}
            <EffectComposer>
                <Bloom
                    intensity={0.8}
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.9}
                    mipmapBlur
                />
                <Noise
                    opacity={0.02}
                    blendFunction={BlendFunction.SOFT_LIGHT}
                />
                <Vignette
                    offset={0.3}
                    darkness={0.7}
                    blendFunction={BlendFunction.NORMAL}
                />
            </EffectComposer>
        </>
    );
}
