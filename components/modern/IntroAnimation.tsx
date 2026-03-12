"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════
   OPTION 1: Crystal Fly-Through (GSAP Enhanced)
   ═══════════════════════════════════════════════════ */

function CrystalShape({ position, scale, color, speed, geometryType }: {
    position: [number, number, number];
    scale: number;
    color: string;
    speed: number;
    geometryType: "icosahedron" | "octahedron" | "dodecahedron";
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.15 * speed;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.1 * speed;
        }
    });

    return (
        <Float speed={speed * 2} rotationIntensity={1.5} floatIntensity={3} position={position}>
            <mesh ref={meshRef} scale={scale}>
                {geometryType === "icosahedron" && <icosahedronGeometry args={[1, 1]} />}
                {geometryType === "octahedron" && <octahedronGeometry args={[1, 0]} />}
                {geometryType === "dodecahedron" && <dodecahedronGeometry args={[1, 0]} />}
                <MeshDistortMaterial
                    color={color}
                    envMapIntensity={2}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    metalness={1}
                    roughness={0.05}
                    distort={0.35}
                    speed={speed * 3}
                />
            </mesh>
        </Float>
    );
}

function Particles({ count = 500 }: { count?: number }) {
    const meshRef = useRef<THREE.Points>(null);

    const { positions } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 40;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
        }
        return { positions: pos };
    }, [count]);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.01;
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
            </bufferGeometry>
            <pointsMaterial size={0.08} color="#a5b4fc" transparent opacity={0.6} sizeAttenuation />
        </points>
    );
}

function CameraRig() {
    const { camera } = useThree();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        camera.position.x = Math.sin(t * 0.3) * 8;
        camera.position.y = Math.cos(t * 0.2) * 3 + Math.sin(t * 0.1) * 2;
        camera.position.z = 10 - t * 1.2;
        camera.lookAt(0, 0, camera.position.z - 5);
    });

    return null;
}

function CrystalScene() {
    const crystals = [
        { position: [3, 2, -5] as [number, number, number], scale: 1.2, color: "#4f46e5", speed: 1.5, geometryType: "icosahedron" as const },
        { position: [-4, -1, -8] as [number, number, number], scale: 1.8, color: "#06b6d4", speed: 1, geometryType: "octahedron" as const },
        { position: [1, 3, -12] as [number, number, number], scale: 0.8, color: "#ec4899", speed: 2, geometryType: "dodecahedron" as const },
        { position: [-2, -3, -15] as [number, number, number], scale: 1.5, color: "#8b5cf6", speed: 1.2, geometryType: "icosahedron" as const },
        { position: [5, 0, -18] as [number, number, number], scale: 1, color: "#06b6d4", speed: 1.8, geometryType: "octahedron" as const },
        { position: [-3, 2, -22] as [number, number, number], scale: 2, color: "#4f46e5", speed: 0.8, geometryType: "dodecahedron" as const },
        { position: [0, -2, -25] as [number, number, number], scale: 1.3, color: "#ec4899", speed: 1.5, geometryType: "icosahedron" as const },
        { position: [4, 3, -28] as [number, number, number], scale: 0.9, color: "#3b82f6", speed: 2.2, geometryType: "octahedron" as const },
        { position: [-5, -1, -32] as [number, number, number], scale: 1.6, color: "#8b5cf6", speed: 1, geometryType: "dodecahedron" as const },
        { position: [2, 1, -35] as [number, number, number], scale: 1.1, color: "#06b6d4", speed: 1.7, geometryType: "icosahedron" as const },
    ];

    return (
        <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={3} color="#4f46e5" />
            <directionalLight position={[-10, -5, -10]} intensity={2} color="#ec4899" />
            <pointLight position={[0, 0, -15]} intensity={5} color="#06b6d4" distance={30} />
            <pointLight position={[5, 5, -25]} intensity={3} color="#8b5cf6" distance={20} />

            {crystals.map((c, i) => (
                <CrystalShape key={i} {...c} />
            ))}

            <Particles count={800} />
            <CameraRig />
            <Environment preset="night" />

            <EffectComposer>
                <Bloom luminanceThreshold={0.3} mipmapBlur intensity={2} radius={0.8} />
            </EffectComposer>
        </>
    );
}

/* ═══════════════════════════════════════════════════
   Main Intro Component (GSAP Timeline)
   ═══════════════════════════════════════════════════ */

export default function IntroAnimation({ children }: { children: React.ReactNode }) {
    const [showIntro, setShowIntro] = useState(true);
    const overlayRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const progressTextRef = useRef<HTMLParagraphElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showIntro || !overlayRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setShowIntro(false);
            },
        });

        // Phase 1: Progress bar fills (0-10s as background)
        tl.to(progressBarRef.current, {
            width: "100%",
            duration: 10,
            ease: "power1.inOut",
        }, 0);

        // Phase 2: Logo reveal at 3s
        tl.fromTo(logoRef.current, {
            opacity: 0,
            scale: 0.3,
            filter: "blur(30px)",
            y: 30,
        }, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1.5,
            ease: "expo.out",
        }, 3);

        // Logo glow pulse
        tl.fromTo(glowRef.current, {
            opacity: 0,
            scale: 0.5,
        }, {
            opacity: 0.6,
            scale: 1.5,
            duration: 1.2,
            ease: "power2.out",
        }, 3.3);

        tl.to(glowRef.current, {
            opacity: 0.2,
            scale: 1,
            duration: 2,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 2,
        }, 4.5);

        // Phase 3: Tagline at 5.5s — character-by-character reveal
        tl.fromTo(taglineRef.current, {
            opacity: 0,
            y: 20,
            letterSpacing: "0.5em",
        }, {
            opacity: 1,
            y: 0,
            letterSpacing: "0.15em",
            duration: 1,
            ease: "power3.out",
        }, 5.5);

        // Phase 4: Status text change
        tl.to(progressTextRef.current, {
            textContent: "Welcome",
            duration: 0,
        }, 9);

        // Phase 5: Exit at 9.5s — everything fades + zooms
        tl.to(logoRef.current, {
            scale: 1.3,
            opacity: 0,
            filter: "blur(10px)",
            duration: 0.6,
            ease: "power2.in",
        }, 9.2);

        tl.to(taglineRef.current, {
            opacity: 0,
            y: -10,
            duration: 0.4,
            ease: "power2.in",
        }, 9.2);

        tl.to(overlayRef.current, {
            opacity: 0,
            scale: 1.1,
            duration: 0.8,
            ease: "power3.inOut",
        }, 9.5);

        return () => {
            tl.kill();
        };
    }, [showIntro]);

    if (!showIntro) return <>{children}</>;

    return (
        <>
            <div
                ref={overlayRef}
                className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
            >
                {/* 3D Canvas */}
                <div className="absolute inset-0">
                    <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
                        <CrystalScene />
                    </Canvas>
                </div>

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 pointer-events-none z-10" />

                {/* Logo + Tagline */}
                <div className="relative z-20 flex flex-col items-center justify-center">
                    {/* Glow effect behind logo */}
                    <div
                        ref={glowRef}
                        className="absolute w-[400px] h-[200px] bg-indigo-500/30 rounded-full blur-[80px] pointer-events-none opacity-0"
                    />
                    <div ref={logoRef} className="flex items-center gap-3 opacity-0">
                        <span className="font-display text-7xl sm:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_60px_rgba(79,70,229,0.5)]">
                            IGA
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">.</span>
                        </span>
                    </div>

                    <p
                        ref={taglineRef}
                        className="mt-6 text-lg sm:text-xl text-zinc-400 font-medium tracking-wide opacity-0"
                    >
                        Decoding your digital presence
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 z-20">
                    <div className="h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            ref={progressBarRef}
                            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full"
                            style={{ width: "0%" }}
                        />
                    </div>
                    <p
                        ref={progressTextRef}
                        className="mt-3 text-center text-xs text-zinc-600 font-medium tracking-widest uppercase"
                    >
                        Loading experience...
                    </p>
                </div>
            </div>
            {children}
        </>
    );
}
