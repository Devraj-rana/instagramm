"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sparkles, ContactShadows, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles as SparklesIcon, CheckCircle2, Instagram } from "lucide-react";
import * as THREE from "three";

type AbstractShapeProps = {
    position: [number, number, number];
    scale: number;
    materialColor: string;
    distort: number;
    speed: number;
    type: "torus" | "icosahedron" | "octahedron";
};

function AbstractShape({ position, scale, materialColor, distort, speed, type }: AbstractShapeProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2} position={position}>
            <mesh ref={meshRef} scale={scale} receiveShadow castShadow>
                {type === 'torus' ? <torusGeometry args={[1, 0.3, 32, 64]} /> :
                    type === 'icosahedron' ? <icosahedronGeometry args={[1, 0]} /> :
                        <octahedronGeometry args={[1, 0]} />}
                <MeshDistortMaterial
                    color={materialColor}
                    envMapIntensity={1}
                    clearcoat={0.8}
                    clearcoatRoughness={0.2}
                    metalness={0.8}
                    roughness={0.1}
                    distort={distort}
                    speed={speed}
                />
            </mesh>
        </Float>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={2} color="#4f46e5" castShadow />
            <directionalLight position={[-10, 10, -5]} intensity={1.5} color="#ec4899" />
            <pointLight position={[0, -5, 5]} intensity={1} color="#06b6d4" />

            <group position={[0, 0, -3]}>
                <AbstractShape position={[4, 1, 0]} scale={1.5} materialColor="#4f46e5" distort={0.4} speed={2} type="icosahedron" />
                <AbstractShape position={[-4, -1, 1]} scale={1.2} materialColor="#ec4899" distort={0.3} speed={1.5} type="torus" />
                <AbstractShape position={[0, 2, -2]} scale={0.8} materialColor="#06b6d4" distort={0.5} speed={3} type="octahedron" />
                <AbstractShape position={[-2, 3, -1]} scale={0.6} materialColor="#8b5cf6" distort={0.2} speed={1} type="icosahedron" />
                <AbstractShape position={[3, -2, -1]} scale={1} materialColor="#3b82f6" distort={0.6} speed={2.5} type="torus" />
            </group>

            <Environment preset="city" />
            <Sparkles count={200} scale={15} size={2} speed={0.4} opacity={0.5} color="#a5b4fc" />
            <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />

            <EffectComposer>
                <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.2} />
                <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
            </EffectComposer>
        </>
    );
}

export default function FuturisticHero({
    username,
    setUsername,
    onAnalyze,
    isLoading
}: {
    username: string;
    setUsername: (val: string) => void;
    onAnalyze: (e: React.FormEvent) => void;
    isLoading: boolean;
}) {
    return (
        <div className="relative w-full h-screen min-h-200 overflow-hidden bg-black selection:bg-cyan-500/30">
            {/* 3D Canvas Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
                    <Scene />
                </Canvas>
            </div>

            {/* Foreground UI Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="pointer-events-auto flex flex-col items-center w-full max-w-5xl mx-auto mt-20"
                >
                    <div className="mb-8 flex justify-center w-full">
                        <div className="relative rounded-full px-5 py-2 text-sm/6 text-zinc-300 ring-1 ring-white/10 hover:ring-white/20 transition-all bg-white/5 backdrop-blur-xl shadow-[0_0_20px_rgba(79,70,229,0.2)]">
                            <span className="flex items-center gap-2">
                                <SparklesIcon className="h-4 w-4 text-cyan-400" />
                                <span className="font-medium text-white">Next-Gen Analytics Engine</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-600 mx-1"></span>
                                <span className="text-cyan-400 font-semibold cursor-pointer hover:underline">See how it works</span>
                            </span>
                        </div>
                    </div>

                    <h1 className="font-display text-5xl font-black tracking-tighter text-white drop-shadow-2xl sm:text-7xl lg:text-8xl leading-[1.1] max-w-4xl mx-auto">
                        Decode the <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-indigo-400 to-pink-500">social DNA</span> <br className="hidden sm:block" />
                        of any brand.
                    </h1>

                    <p className="mt-8 text-lg font-medium text-zinc-300/80 leading-relaxed sm:text-xl/8 max-w-2xl mx-auto">
                        Dive deep into your audience metrics with AI-powered analysis. A cinematic approach to understanding social growth, curated for modern creators.
                    </p>

                    {/* Glassmorphism Input Field */}
                    <div className="mt-12 flex w-full flex-col items-center justify-center gap-4 sm:flex-row max-w-3xl mx-auto relative z-60">
                        <form onSubmit={onAnalyze} className="flex w-full items-center pl-6 pr-2 py-2.5 rounded-2xl bg-[#0F0F11]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/15 transition-all hover:ring-white/30 focus-within:ring-2 focus-within:ring-pink-500 focus-within:shadow-[0_0_50px_rgba(236,72,153,0.3)] group">
                            <Instagram className="h-7 w-7 text-zinc-400 group-focus-within:text-pink-500 transition-colors mr-4 shrink-0" />
                            <input
                                type="text"
                                placeholder="Enter Instagram username..."
                                spellCheck="false"
                                autoCapitalize="none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-transparent border-0 text-white placeholder:text-zinc-500 flex-1 min-w-0 text-lg sm:text-2xl outline-none font-medium transition-all h-16 focus:ring-0"
                            />
                            <button
                                type="submit"
                                disabled={!username.trim() || isLoading}
                                className="flex items-center justify-center gap-2 rounded-xl bg-white text-black px-10 h-14 sm:text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed ml-2 whitespace-nowrap"
                            >
                                {isLoading ? "Scanning..." : "Get Started"}
                                {!isLoading && <ArrowRight className="h-6 w-6" />}
                            </button>
                        </form>
                    </div>

                    <div className="mt-14 flex items-center justify-center gap-x-8 text-sm text-zinc-400 font-medium">
                        <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            </div>
                            Real-time processing
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            </div>
                            Powered by advanced AI
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Foreground gradient fade out */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>
        </div>
    );
}
