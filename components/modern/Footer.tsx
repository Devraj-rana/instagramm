"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Magnetic Button
function MagneticHover({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * 0.3);
        y.set((e.clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0); y.set(0);
    };

    return (
        <motion.div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: mouseXSpring, y: mouseYSpring }}
            className={`cursor-pointer ${className}`}
        >
            {children}
        </motion.div>
    );
}

export default function Footer() {
    const [currentTime, setCurrentTime] = useState("");
    const currentYear = new Date().getFullYear();
    const displayTimeZone = "Asia/Kolkata";
    const displayTimeZoneLabel = "IST";

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: displayTimeZone,
                    hour12: true,
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [displayTimeZone]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer className="relative w-full bg-[#050505] text-[#f5f5f5] pt-16 pb-8 overflow-hidden z-0 border-t border-white/5" style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
            <div className="h-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col justify-between">
               
                {/* ---------- MID SECTION: Standard Clean Grid Links ---------- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16 text-sm uppercase tracking-[0.1em] font-medium text-zinc-300">
                    <div className="flex flex-col gap-6">
                        <span className="text-zinc-600 mb-2">Menu</span>
                        <Link href="/" className="hover:text-cyan-400 transition-colors duration-300 w-fit">Home</Link>
                        <Link href="/analytics" className="hover:text-cyan-400 transition-colors duration-300 w-fit">Analytics</Link>
                        <Link href="/services" className="hover:text-cyan-400 transition-colors duration-300 w-fit">Services</Link>
                        <Link href="/testimonials" className="hover:text-cyan-400 transition-colors duration-300 w-fit">Testimonials</Link>
                        <Link href="/support" className="hover:text-cyan-400 transition-colors duration-300 w-fit">Support</Link>
                    </div>

                    <div className="flex flex-col gap-6">
                        <span className="text-zinc-600 mb-2">Account</span>
                        <Link href="/sign-in" className="hover:text-cyan-400 transition-colors duration-300 w-fit">Sign In</Link>
                        <Link href="/sign-up" className="hover:text-cyan-400 transition-colors duration-300 w-fit">Sign Up</Link>
                        <Link href="/account" className="hover:text-cyan-400 transition-colors duration-300 w-fit">My Account</Link>
                        <Link href="/privacy" className="hover:text-cyan-400 transition-colors duration-300 w-fit">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-cyan-400 transition-colors duration-300 w-fit">Terms Of Service</Link>
                    </div>

                    <div className="flex flex-col gap-6">
                        <span className="text-zinc-600 mb-2">Support</span>
                        <MagneticHover className="w-fit">
                            <a href="mailto:support@socialinsight.tech" className="text-3xl md:text-4xl lg:text-4xl font-black text-white hover:text-cyan-400 transition-colors duration-500 lowercase tracking-tight">
                                support@socialinsight.tech
                            </a>
                        </MagneticHover>
                        
                        <div className="mt-4 flex flex-col sm:flex-row gap-6 items-start sm:items-center p-5 rounded-2xl bg-[#0a0a0a] border border-white/5 w-fit">
                            <div>
                                <span className="block text-[10px] text-zinc-500 mb-1 tracking-[0.2em] font-medium">LOCAL TIME</span>
                                <span className="font-mono text-white tracking-widest text-sm">{currentTime} {displayTimeZoneLabel}</span>
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                                <span className="text-xs text-zinc-300 font-medium tracking-[0.1em]">SUPPORT AVAILABLE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------- BOTTOM SECTION: Copyright & Back to Top ---------- */}
                <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-white/10 uppercase tracking-[0.15em] text-[10px] font-bold text-zinc-500">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <span>© {currentYear}, SOCIALINSIGHT TECH</span>
                        <span className="hidden md:inline w-1 h-1 rounded-full bg-zinc-800"></span>
                        <Link href="/privacy" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
                        <span className="hidden md:inline w-1 h-1 rounded-full bg-zinc-800"></span>
                        <Link href="/terms" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
                        <span className="hidden md:inline w-1 h-1 rounded-full bg-zinc-800"></span>
                        <Link href="/support" className="hover:text-white transition-colors">SUPPORT</Link>
                    </div>

                    <MagneticHover>
                        <button onClick={scrollToTop} className="mt-8 md:mt-0 px-6 py-3 rounded-full border border-white/10 hover:border-white hover:text-white transition-all flex items-center gap-3 group text-[10px] tracking-[0.15em]">
                            BACK TO TOP <ArrowUpRight className="w-3 h-3 transform -rotate-45 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </MagneticHover>
                </div>
                
            </div>
        </footer>
    );
}
