"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

// Pre-calculate to satisfy ESLint bounds/purity
const SHAPES = [
    { position: [-6, 3, -5] as [number, number, number], color: "#4f46e5", scale: 1.5, speed: 0.2, distort: 0.4 },
    { position: [6, -2, -8] as [number, number, number], color: "#06b6d4", scale: 2, speed: 0.15, distort: 0.3 },
    { position: [-4, -4, -6] as [number, number, number], color: "#10b981", scale: 1.2, speed: 0.3, distort: 0.5 },
    { position: [5, 5, -10] as [number, number, number], color: "#8b5cf6", scale: 1.8, speed: 0.25, distort: 0.4 },
];

function FloatingBlob({ position, color, scale, speed, distort }: { position: [number, number, number], color: string, scale: number, speed: number, distort: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * speed;
            meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.8;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2} position={position}>
            <mesh ref={meshRef} scale={scale}>
                <icosahedronGeometry args={[1, 4]} />
                <MeshDistortMaterial
                    color={color}
                    envMapIntensity={1}
                    clearcoat={0.8}
                    clearcoatRoughness={0}
                    metalness={0.8}
                    roughness={0.2}
                    distort={distort}
                    speed={speed * 10}
                    transparent
                    opacity={0.6}
                />
            </mesh>
        </Float>
    );
}

export default function Testimonials3DBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4f46e5" />
                
                <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                
                {SHAPES.map((shape, i) => (
                    <FloatingBlob key={i} {...shape} />
                ))}

                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
