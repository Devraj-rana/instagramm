"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Instagram, Twitter, Github, Sparkles, ArrowRight, Mail, Zap, Hexagon, Command } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Stars, ContactShadows, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function CrazyFloatingShape({ position, scale, color, speed, distort, shapeType }: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.15 * speed;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.25 * speed;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
        }
    });

    return (
        <Float speed={speed * 2} rotationIntensity={1.5} floatIntensity={3} position={position}>
            <mesh ref={meshRef} scale={scale} castShadow receiveShadow>
                {shapeType === 'icosahedron' && <icosahedronGeometry args={[1, 1]} />}
                {shapeType === 'torusKnot' && <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />}
                {shapeType === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
                <MeshDistortMaterial
                    color={color}
                    envMapIntensity={2}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    metalness={0.9}
                    roughness={0.1}
                    distort={distort}
                    speed={speed * 3}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>
        </Float>
    );
}

function Crazy3DFooterBackground() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none opacity-40">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2.5]}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 20, 10]} intensity={3} color="#ec4899" castShadow />
                <directionalLight position={[-10, -20, -10]} intensity={2} color="#06b6d4" />
                <pointLight position={[0, 0, 2]} intensity={2} color="#8b5cf6" />
                
                <PresentationControls
                    global
                    rotation={[0, 0, 0]}
                    polar={[-0.4, 0.2]}
                    azimuth={[-0.4, 0.4]}
                >
                    <CrazyFloatingShape position={[4, 2, -2]} scale={1.2} color="#ec4899" speed={1.2} distort={0.6} shapeType="icosahedron" />
                    <CrazyFloatingShape position={[-5, -1, -4]} scale={1.5} color="#06b6d4" speed={0.8} distort={0.4} shapeType="torusKnot" />
                    <CrazyFloatingShape position={[0, -3, -5]} scale={2} color="#8b5cf6" speed={1} distort={0.5} shapeType="icosahedron" />
                    <CrazyFloatingShape position={[6, -2, -6]} scale={1} color="#3b82f6" speed={1.5} distort={0.3} shapeType="octahedron" />
                    <CrazyFloatingShape position={[-4, 3, -3]} scale={0.9} color="#eab308" speed={2} distort={0.7} shapeType="octahedron" />
                </PresentationControls>

                <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={1.5} />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}

export default function Footer() {
    const { scrollYProgress } = useScroll();
    const yTransform = useTransform(scrollYProgress, [0.8, 1], [150, 0]);
    const opacityTransform = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
    const blurTransform = useTransform(scrollYProgress, [0.8, 1], ["blur(20px)", "blur(0px)"]);

    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    const navLinks = [
        { title: "Ecosystem", icon: Command, links: ["Pro Analytics", "Creator Studio", "Enterprise API", "App Integrations"] },
        { title: "Knowledge", icon: Zap, links: ["Algorithm Guide", "Engagement Docs", "Growth Case Studies", "Help Center"] },
        { title: "Network", icon: Hexagon, links: ["About IGA", "Careers", "Press Kit", "Contact Us"] },
    ];

    return (
        <footer className="relative w-full bg-[#030305] pt-40 pb-16 overflow-hidden selection:bg-pink-500/30 font-sans border-t border-white/5">
            {/* Extreme 3D Background */}
            <Crazy3DFooterBackground />

            {/* Cinematic Lighting overlays */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent shadow-[0_0_30px_rgba(236,72,153,0.8)]"></div>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-pink-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-cyan-600/20 blur-[200px] rounded-[100%] pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

            <motion.div
                style={{ y: yTransform, opacity: opacityTransform, filter: blurTransform }}
                className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center"
            >
                {/* Crazy Holographic CTA Box */}
                <div className="relative w-full max-w-5xl mx-auto mb-32 rounded-[3.5rem] p-[2px] bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 shadow-[0_0_100px_rgba(236,72,153,0.3)] hover:shadow-[0_0_150px_rgba(6,182,212,0.4)] transition-shadow duration-[1500ms] group hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-500 opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-1000"></div>
                    
                    <div className="relative flex flex-col overflow-hidden lg:flex-row items-center justify-between gap-12 rounded-[3.4rem] bg-[#0A0A0E]/95 backdrop-blur-3xl px-8 py-16 sm:px-12 lg:px-20 lg:py-24">
                        {/* Internal Animated Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>
                        
                        <div className="flex-1 text-center lg:text-left relative z-10">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
                            >
                                <Sparkles className="h-4 w-4 text-pink-400" />
                                <span className="text-sm font-bold tracking-widest uppercase text-zinc-300">Ready to Ascend?</span>
                            </motion.div>
                            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-6 drop-shadow-2xl leading-[1.1]">
                                Hack the <br className="hidden lg:block"/>
                                <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#ec4899,45%,#8b5cf6,55%,#06b6d4)] bg-[length:200%_100%] animate-pulse">Algorithm.</span>
                            </h2>
                            <p className="text-zinc-400 text-xl max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                                Join 10,000+ top-tier creators using dimensional AI to dominate their niche.
                            </p>
                        </div>
                        
                        <div className="flex-shrink-0 w-full lg:w-auto relative z-10">
                            <div className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/0 shadow-2xl">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const val = (e.currentTarget.elements.namedItem('footer-username') as HTMLInputElement).value;
                                        if (val) window.location.href = `/analyze/${val.replace(/^@/, '').trim()}`;
                                    }}
                                    className="flex items-center pl-6 pr-2 py-2 rounded-[1.4rem] bg-[#0A0A0E] ring-1 ring-inset ring-white/10 focus-within:ring-pink-500 shadow-inner w-full lg:w-[420px] transition-all duration-500 group/input"
                                >
                                    <span className="text-zinc-500 font-bold text-2xl mr-3 group-focus-within/input:text-pink-500 transition-colors drop-shadow-md">@</span>
                                    <input
                                        type="text"
                                        name="footer-username"
                                        placeholder="Enter your IG handle..."
                                        spellCheck="false"
                                        autoCapitalize="none"
                                        className="w-full bg-transparent border-0 text-white placeholder:text-zinc-600 flex-1 min-w-0 outline-none font-medium h-16 focus:ring-0 text-xl"
                                    />
                                    <button type="submit" className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95 flex-shrink-0 ml-2 group-focus-within/input:bg-pink-500 group-focus-within/input:text-white group-focus-within/input:shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                                        <ArrowRight className="h-6 w-6" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ultimate Grid Layout */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24 relative z-10">
                    
                    {/* Brand Master Column */}
                    <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left pr-0 lg:pr-12">
                        <Link href="/" className="group flex items-center gap-4 mb-8">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl transition-all duration-700 group-hover:border-pink-500/50 group-hover:shadow-[0_0_50px_rgba(236,72,153,0.4)] overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
                                <Instagram className="relative z-10 h-8 w-8 text-white transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12" />
                            </div>
                            <span className="font-display text-4xl font-black tracking-tighter text-white drop-shadow-2xl">
                                IGA<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">.</span>
                            </span>
                        </Link>
                        <p className="text-zinc-400 text-lg leading-relaxed max-w-sm mb-10">
                            A completely unhinged cinematic analytics experience. We decode massive engagement datasets into unbelievably beautiful, actionable insights.
                        </p>

                        <div className="flex gap-4">
                            {[Twitter, Github, Mail].map((Icon, i) => (
                                <Link key={i} href="#" className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-zinc-400 overflow-hidden group/social hover:-translate-y-2 transition-transform duration-500 shadow-xl">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover/social:opacity-100 transition-opacity"></div>
                                    <Icon className="relative z-10 h-6 w-6 group-hover/social:text-white transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
                        {navLinks.map((column, idx) => (
                            <div key={idx} className="flex flex-col items-center sm:items-start">
                                <div className="flex items-center gap-3 mb-8">
                                    <column.icon className="h-5 w-5 text-pink-500" />
                                    <h4 className="text-sm font-black text-white uppercase tracking-[0.25em]">{column.title}</h4>
                                </div>
                                <ul className="flex flex-col gap-5 text-center sm:text-left w-full sm:w-auto">
                                    {column.links.map((link) => (
                                        <li key={link}>
                                            <Link
                                                href="#"
                                                className="relative group/link inline-block py-1 text-base font-semibold text-zinc-400 transition-colors hover:text-white"
                                                onMouseEnter={() => setHoveredLink(link)}
                                                onMouseLeave={() => setHoveredLink(null)}
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    {link}
                                                    {(link === "Enterprise API" || link === "Pro Analytics") && (
                                                        <span className="inline-flex items-center rounded-full bg-pink-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-pink-400 ring-1 ring-inset ring-pink-500/30">
                                                            NEW
                                                        </span>
                                                    )}
                                                </span>
                                                <AnimatePresence>
                                                    {hoveredLink === link && (
                                                        <motion.span
                                                            layoutId="footer-hover-glow"
                                                            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                                                            initial={{ opacity: 0, scaleX: 0 }}
                                                            animate={{ opacity: 1, scaleX: 1 }}
                                                            exit={{ opacity: 0, scaleX: 0 }}
                                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cyberpunk Bottom Bar */}
                <div className="w-full relative pt-10 pb-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>

                    <div className="relative flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-bold text-zinc-500">
                        <Link href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors duration-300">Cookie Settings</Link>
                    </div>

                    <div className="relative flex items-center gap-2 text-sm font-bold text-zinc-500 drop-shadow-md">
                        <span>Forged with</span>
                        <div className="relative flex items-center justify-center px-1">
                            <div className="absolute inset-0 bg-pink-500/50 blur-[8px] rounded-full animate-pulse"></div>
                            <Sparkles className="relative z-10 h-4 w-4 text-pink-400" />
                        </div>
                        <span>for elite creators &copy; {new Date().getFullYear()}</span>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}
