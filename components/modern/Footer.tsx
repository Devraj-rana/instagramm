"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Twitter, Github, Sparkles, ArrowRight, Mail, Zap, Hexagon, Command } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Stars, ContactShadows, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function CrazyFloatingShape({ position, scale, color, speed, distort, shapeType }: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.2;
        }
    });

    return (
        <Float speed={speed} rotationIntensity={0.5} floatIntensity={1} position={position}>
            <mesh ref={meshRef} scale={scale}>
                {shapeType === 'icosahedron' && <icosahedronGeometry args={[1, 1]} />}
                {shapeType === 'torusKnot' && <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />}
                <MeshDistortMaterial
                    color={color}
                    envMapIntensity={1}
                    clearcoat={0.5}
                    metalness={0.8}
                    roughness={0.2}
                    distort={distort}
                    speed={speed}
                    emissive={color}
                    emissiveIntensity={0.1}
                />
            </mesh>
        </Float>
    );
}

function Crazy3DFooterBackground() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none opacity-20">
            <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#6366f1" />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#06b6d4" />
                
                <PresentationControls global rotation={[0, 0, 0]} polar={[-0.2, 0.1]} azimuth={[-0.2, 0.2]}>
                    <CrazyFloatingShape position={[6, 3, -4]} scale={1} color="#6366f1" speed={0.5} distort={0.3} shapeType="icosahedron" />
                    <CrazyFloatingShape position={[-6, -4, -6]} scale={1.4} color="#06b6d4" speed={0.4} distort={0.2} shapeType="torusKnot" />
                </PresentationControls>

                <Stars radius={100} depth={50} count={1500} factor={2} saturation={0} fade speed={1} />
            </Canvas>
        </div>
    );
}

export default function Footer() {
    const { scrollYProgress } = useScroll();
    const yTransform = useTransform(scrollYProgress, [0.9, 1], [40, 0]);
    const opacityTransform = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    const navLinks = [
        { title: "Ecosystem", links: ["Services", "Creator Studio", "Enterprise API", "App Integrations"] },
        { title: "Knowledge", links: ["Algorithm Guide", "Engagement Docs", "Growth Case Studies", "Help Center"] },
        { title: "Network", links: ["About Social Insight", "Careers", "Press Kit", "Contact Us"] },
    ];

    return (
        <footer className="relative w-full bg-[#030305] pt-32 pb-12 overflow-hidden selection:bg-indigo-500/30 font-sans border-t border-white/5">
            <Crazy3DFooterBackground />

            {/* Subtle Lighting */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div
                style={{ y: yTransform, opacity: opacityTransform }}
                className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 flex flex-col items-center"
            >
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-20">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <Link href="/" className="mb-8 block transition-opacity hover:opacity-80">
                            <Logo />
                        </Link>
                        <p className="text-zinc-500 text-base leading-relaxed max-w-sm mb-8 font-medium">
                            The definitive social analytics platform. We transform complex digital footprints into actionable growth intelligence.
                        </p>

                        <div className="flex gap-6">
                            {[Twitter, Github, Mail].map((Icon, i) => (
                                <Link key={i} href="#" className="text-zinc-500 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-8">
                        {navLinks.map((column, idx) => (
                            <div key={idx} className="flex flex-col items-center sm:items-start">
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 opacity-50">{column.title}</h4>
                                <ul className="flex flex-col gap-4 text-center sm:text-left">
                                    {column.links.map((link) => (
                                        <li key={link}>
                                            <Link
                                                href={link === "Services" ? "/pricing" : link === "Privacy" ? "/privacy" : "#"}
                                                className="relative text-sm font-semibold text-zinc-500 transition-colors hover:text-white"
                                                onMouseEnter={() => setHoveredLink(link)}
                                                onMouseLeave={() => setHoveredLink(null)}
                                            >
                                                {link}
                                                {hoveredLink === link && (
                                                    <motion.span
                                                        layoutId="footer-hover-line"
                                                        className="absolute -bottom-1 left-0 right-0 h-px bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: 1 }}
                                                        exit={{ scaleX: 0 }}
                                                    />
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="w-full pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-[12px] font-bold text-zinc-600 uppercase tracking-tighter">
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-white transition-opacity">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-opacity">Terms of Service</Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>Elite Growth Intelligence &copy; {new Date().getFullYear()}</span>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}
