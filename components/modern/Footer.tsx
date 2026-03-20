"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Magnetic Social/Link Button for specific interactive targets
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
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: mouseXSpring, y: mouseYSpring }}
            className={`${className}`}
            data-cursor="-pointer"
        >
            {children}
        </motion.div>
    );
}

export default function Footer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentTime, setCurrentTime] = useState("");
    
    // Parallax scroll effect for overall footer wrapper overlapping the section before it
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });
    
    const yTransform = useTransform(scrollYProgress, [0, 1], [-200, 0]);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "America/New_York" }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Text reveal animations like Uni
            gsap.from(".reveal-text span", {
                y: "110%",
                duration: 1.2,
                stagger: 0.05,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            });
            gsap.from(".fade-stagger", {
                opacity: 0,
                y: 20,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                }
            });
        });
        return () => ctx.revert();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <motion.footer 
            ref={containerRef}
            className="relative w-full bg-[#0a0a0a] text-[#f5f5f5] pt-32 pb-8 font-sans overflow-hidden z-0"
            style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
        >
            {/* The structural container gets slightly pulled down for an un-clipping parallax feel */}
            <motion.div style={{ y: yTransform }} className="h-full flex flex-col justify-between max-w-350 mx-auto px-6 md:px-12">
               
                {/* ---------- TOP SECTION: Huge Call to Action ---------- */}
                <div className="flex flex-col gap-12 border-b border-white/10 pb-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                        <div className="reveal-text overflow-hidden flex flex-col leading-[0.9]">
                            <div className="overflow-hidden"><span className="block text-6xl md:text-8xl lg:text-[180px] font-black tracking-tighter uppercase">BECOME</span></div>
                            <div className="overflow-hidden"><span className="block text-6xl md:text-8xl lg:text-[180px] font-black tracking-tighter uppercase text-zinc-500">ONE OF</span></div>
                            <div className="overflow-hidden"><span className="block text-6xl md:text-8xl lg:text-[180px] font-black tracking-tighter uppercase">US</span></div>
                        </div>

                        <div className="flex flex-col gap-4 items-start md:items-end max-w-sm text-left md:text-right fade-stagger">
                            <p className="text-xl md:text-3xl font-light text-zinc-400">
                                Let&apos;s devise a plan and make a real impact. Let&apos;s make it big!
                            </p>
                            <MagneticHover>
                                <a href="mailto:hello@socialinsight.tech" className="inline-flex items-center gap-4 px-8 py-5 mt-6 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors duration-300 font-bold uppercase tracking-widest text-sm">
                                    Let&apos;s Discuss <ArrowUpRight className="w-5 h-5" />
                                </a>
                            </MagneticHover>
                        </div>
                    </div>
                </div>

                {/* ---------- MID SECTION: Grid Links ---------- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16 text-sm uppercase tracking-widest font-semibold fade-stagger">
                    <div className="flex flex-col gap-6">
                        <span className="text-zinc-600 mb-2">Our Socials</span>
                        <Link href="#" className="hover:text-cyan-400 transition-colors hover:translate-x-2 transform duration-300">Instagram</Link>
                        <Link href="#" className="hover:text-cyan-400 transition-colors hover:translate-x-2 transform duration-300">LinkedIn</Link>
                        <Link href="#" className="hover:text-cyan-400 transition-colors hover:translate-x-2 transform duration-300">Twitter</Link>
                        <Link href="#" className="hover:text-cyan-400 transition-colors hover:translate-x-2 transform duration-300">Dribbble</Link>
                    </div>

                    <div className="flex flex-col gap-6">
                        <span className="text-zinc-600 mb-2">Menu</span>
                        <Link href="/analyze" className="hover:text-cyan-400 transition-colors hover:translate-x-2 transform duration-300">Analytics</Link>
                        <Link href="/features" className="hover:text-cyan-400 transition-colors hover:translate-x-2 transform duration-300">Features</Link>
                        <Link href="/cases" className="hover:text-cyan-400 transition-colors hover:translate-x-2 transform duration-300">Cases</Link>
                        <Link href="/pricing" className="hover:text-cyan-400 transition-colors hover:translate-x-2 transform duration-300">Pricing</Link>
                    </div>

                    <div className="flex flex-col gap-6 md:col-span-2">
                        <span className="text-zinc-600 mb-2">Work With Us</span>
                        <MagneticHover className="inline-block">
                            <a href="mailto:hello@socialinsight.tech" className="text-2xl md:text-4xl font-black hover:text-cyan-400 transition-colors lowercase tracking-normal">
                                hello@socialinsight.tech
                            </a>
                        </MagneticHover>
                        <div className="mt-8 flex gap-4 text-zinc-500">
                            <div>NEW YORK, US <span>{currentTime} EST</span></div>
                        </div>
                    </div>
                </div>

                {/* ---------- BOTTOM SECTION: Copyright & Back to Top ---------- */}
                <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-white/10 uppercase tracking-widest text-xs font-bold text-zinc-500 fade-stagger">
                    <div className="flex gap-4">
                        <span>© {new Date().getFullYear()}, SocialInsight Tech</span>
                        <span className="hidden md:inline">•</span>
                        <span>All rights reserved</span>
                    </div>

                    <MagneticHover>
                        <button onClick={scrollToTop} className="mt-4 md:mt-0 px-6 py-3 rounded-full border border-zinc-800 hover:border-white hover:text-white transition-all flex items-center gap-2">
                            Back To Top <ArrowUpRight className="w-4 h-4 transform -rotate-45" />
                        </button>
                    </MagneticHover>
                </div>
            </motion.div>
        </motion.footer>
    );
}
