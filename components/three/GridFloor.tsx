'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Animated infinite wireframe grid floor with fade-to-depth-fog.
 * Creates a cinematic sci-fi ground plane effect.
 */
export default function GridFloor() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#3B82F6') },
        uFogColor: { value: new THREE.Color('#050507') },
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
            <planeGeometry args={[80, 80, 80, 80]} />
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                transparent
                wireframe
                vertexShader={/* glsl */ `
          varying vec2 vUv;
          varying float vDist;
          void main() {
            vUv = uv;
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vDist = length(worldPos.xz);
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
                fragmentShader={/* glsl */ `
          uniform float uTime;
          uniform vec3 uColor;
          uniform vec3 uFogColor;
          varying vec2 vUv;
          varying float vDist;

          void main() {
            // Distance-based fade
            float fade = 1.0 - smoothstep(5.0, 35.0, vDist);

            // Animated pulse along grid
            float pulse = sin(vDist * 0.3 - uTime * 0.5) * 0.3 + 0.7;

            // Final color with fog blend
            vec3 color = mix(uFogColor, uColor, fade * pulse * 0.3);
            float alpha = fade * 0.25 * pulse;

            gl_FragColor = vec4(color, alpha);
          }
        `}
            />
        </mesh>
    );
}
