"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Mail, Instagram } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

// Premium Grain/Noise Overlay for the luxurious texture
const NoiseOverlay = () => (
    <div className="absolute inset-0 w-full h-full opacity-[0.03] z-[1] pointer-events-none mix-blend-overlay" 
         style={{ 
             backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
             backgroundRepeat: "repeat"
         }}
    />
);

// Super-smooth Physics Magnetic Button
function MagneticHover({ children, className = "", strength = 0.4 }: { children: React.ReactNode, className?: string, strength?: number }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 100, damping: 10, mass: 0.5 });
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 10, mass: 0.5 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * strength);
        y.set((e.clientY - centerY) * strength);
    };
    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div 
            onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
            style={{ x: mouseXSpring, y: mouseYSpring, transformStyle: "preserve-3d" }}
            className={`cursor-pointer ${className}`}
        >
            {children}
        </motion.div>
    );
}

export default function Footer() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end end"] });
    
    // Container Entrance Parallax
    const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

    // 3D Spatial Mouse Tracking
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    
    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        // Normalize between -0.5 and 0.5
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // Smooth rotation springs (Reversed for natural tilt feel: looking up when mouse is up)
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 30 });
    
    // Lighting reflection based on mouse
    const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [100, 0]), { stiffness: 150 });
    const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [100, 0]), { stiffness: 150 });

    return (
        <footer 
            ref={containerRef} 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full min-h-screen flex items-center justify-center bg-[#030303] text-zinc-300 pt-32 pb-16 overflow-hidden border-t border-white/5" 
            style={{ perspective: '2000px' }}
        >
            <NoiseOverlay />

            {/* LIQUID AMBIENT BACKGROUNDS */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-60 pointer-events-none">
                {/* Giant Soft Orbs */}
                <motion.div 
                    animate={{ 
                        rotate: 360, 
                        scale: [1, 1.2, 1], 
                        borderRadius: ["40% 60% 70% 30%", "50% 50% 30% 70%", "40% 60% 70% 30%"] 
                    }} 
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] blur-[120px] bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 mix-blend-screen"
                />
                <motion.div 
                    animate={{ 
                        rotate: -360, 
                        scale: [1, 1.5, 1], 
                        borderRadius: ["60% 40% 30% 70%", "30% 70% 70% 30%", "60% 40% 30% 70%"] 
                    }} 
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] blur-[100px] bg-gradient-to-r from-cyan-600/30 to-blue-600/30 mix-blend-screen ml-[20vw] mt-[10vh]"
                />
            </div>

            {/* MAIN 3D SPATIAL CARD EVENT */}
            <motion.div 
                style={{ y, opacity, rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10 flex flex-col justify-between h-full"
            >
                {/* GLASS GLARE REFLECTION */}
                <motion.div 
                    className="absolute inset-0 pointer-events-none rounded-[3rem] z-50 mix-blend-overlay opacity-30"
                    style={{ 
                        background: useTransform(
                            [glareX, glareY], 
                            ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.8) 0%, transparent 50%)`
                        ) 
                    }}
                />

                {/* FLOATING HEADER TEXT */}
                <div className="flex flex-col items-center justify-center py-20 relative" style={{ transform: "translateZ(120px)" }}>
                    <MagneticHover strength={0.2}>
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl text-white text-xs tracking-[0.2em] font-medium mb-12 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
                            <Sparkles className="w-4 h-4 text-cyan-400" /> EXPLORE THE FUTURE
                        </div>
                    </MagneticHover>

                    <h2 className="text-[12vw] sm:text-[8vw] font-black text-center tracking-tighter uppercase leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/10 drop-shadow-[0_0_80px_rgba(255,255,255,0.15)]" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                        SOCIAL<br/>INSIGHT
                    </h2>
                </div>

                {/* 3D GLASS GRIDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20" style={{ transform: "translateZ(60px)" }}>
                    
                    {/* CARD 1: PLATFORM */}
                    <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-2xl hover:bg-white/[0.04] transition-colors duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <h3 className="text-white font-semibold text-lg mb-8 tracking-wide">Platform</h3>
                        <div className="flex flex-col gap-4 text-zinc-400 font-medium">
                             <Link href="/" className="hover:text-cyan-400 hover:translate-x-2 transition-all duration-300 w-fit">Overview</Link>
                             <Link href="/analytics" className="hover:text-cyan-400 hover:translate-x-2 transition-all duration-300 w-fit">Deep Analytics</Link>
                             <Link href="/services" className="hover:text-cyan-400 hover:translate-x-2 transition-all duration-300 w-fit">Pro Services</Link>
                             <Link href="/testimonials" className="hover:text-cyan-400 hover:translate-x-2 transition-all duration-300 w-fit">Testimonials</Link>
                        </div>
                    </div>

                    {/* CARD 2: ACCOUNT */}
                    <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-2xl hover:bg-white/[0.04] transition-colors duration-500 overflow-hidden" style={{ transform: "translateZ(20px)" }}>

                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <h3 className="text-white font-semibold text-lg mb-8 tracking-wide">Account</h3>
                        <div className="flex flex-col gap-4 text-zinc-400 font-medium">
                             <Link href="/sign-in" className="hover:text-purple-400 hover:translate-x-2 transition-all duration-300 w-fit">Sign In</Link>
                             <Link href="/sign-up" className="hover:text-purple-400 hover:translate-x-2 transition-all duration-300 w-fit">Create Account</Link>
                             <Link href="/reset-password" className="hover:text-purple-400 hover:translate-x-2 transition-all duration-300 w-fit">Reset Password</Link>
                        </div>
                    </div>

                    {/* CARD 3: SUPPORT & LEGAL */}
                    <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-2xl hover:bg-white/[0.04] transition-colors duration-500 flex flex-col justify-between">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        
                        <div>
                             <h3 className="text-white font-semibold text-lg mb-8 tracking-wide">Support</h3>
                             <div className="flex flex-col gap-4 text-zinc-300 font-medium">
                                 <MagneticHover>
                                     <a
                                         href="mailto:support@socialinsight.tech"
                                         className="text-sm sm:text-base font-bold text-white hover:text-cyan-400 transition-colors duration-300 flex items-center gap-3 w-fit"
                                     >
                                         <Mail className="w-5 h-5" />
                                         support@socialinsight.tech
                                     </a>
                                 </MagneticHover>
                                 <MagneticHover>
                                     <a
                                         href="https://www.instagram.com/socialinsight.tech/"
                                         target="_blank"
                                         rel="noreferrer"
                                         className="text-sm sm:text-base font-bold text-white hover:text-pink-400 transition-colors duration-300 flex items-center gap-3 w-fit"
                                     >
                                         <Instagram className="w-5 h-5" />
                                         @socialinsight.tech
                                     </a>
                                 </MagneticHover>
                             </div>
                        </div>
                        
                        <div className="mt-12 flex flex-col gap-4 text-zinc-400 font-medium">
                            <Link href="/privacy" className="hover:text-blue-400 hover:translate-x-2 transition-all duration-300 w-fit">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-blue-400 hover:translate-x-2 transition-all duration-300 w-fit">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR - HIGHEST Z-INDEX */}
                <div className="flex flex-col md:flex-row justify-between items-center py-8 text-xs font-medium text-zinc-500 uppercase tracking-widest" style={{ transform: "translateZ(80px)" }}>
                    <div className="flex items-center gap-6 mb-6 md:mb-0">
                        <span>© {new Date().getFullYear()} SOCIALINSIGHT</span>
                    </div>
                    
                    <MagneticHover strength={0.5}>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
                            className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-3xl hover:bg-white/10 text-white transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                        >
                            BACK TO TOP <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </MagneticHover>
                </div>

            </motion.div>
        </footer>
    );
}