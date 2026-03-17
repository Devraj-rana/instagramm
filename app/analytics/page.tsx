"use client";

import { useRef, useEffect } from "react";
import { TrendingUp, Users, Zap, BarChart3, Shield, Globe } from "lucide-react";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AnalyticsPage() {
    // Refs for GSAP scroll animations
    const showcaseRef = useRef<HTMLDivElement>(null);
    const showcaseInnerRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Showcase section animation
            if (showcaseInnerRef.current) {
                gsap.fromTo(showcaseInnerRef.current, {
                    y: 80,
                    opacity: 0,
                    scale: 0.92,
                }, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: showcaseRef.current,
                        start: "top 85%",
                        end: "top 40%",
                        toggleActions: "play none none reverse",
                    },
                });
            }

            // Stats counter animation
            if (statsRef.current) {
                const statItems = statsRef.current.querySelectorAll(".stat-item");
                gsap.fromTo(statItems, {
                    y: 40,
                    opacity: 0,
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });

                const counters = statsRef.current.querySelectorAll(".stat-number");
                counters.forEach((counter) => {
                    const target = parseInt(counter.getAttribute("data-value") || "0");
                    gsap.fromTo(counter, { textContent: "0" }, {
                        textContent: target,
                        duration: 2,
                        ease: "power2.out",
                        snap: { textContent: 1 },
                        scrollTrigger: {
                            trigger: statsRef.current,
                            start: "top 85%",
                            toggleActions: "play none none reverse",
                        },
                    });
                });
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200">
            <Header />
            <main className="flex-1 pt-32 sm:pt-40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center mb-24">
                    <h1 className="text-4xl font-display font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-sm mb-6">
                        Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500">Analytics</span> Engine.
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-zinc-400 max-w-2xl mx-auto">
                        Deep dive into your digital presence with our cinema-grade analytics suite. We decode the complex data signals into actionable growth intelligence.
                    </p>
                </div>

                {/* Showcase section */}
                <div ref={showcaseRef} className="relative z-10 pb-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div ref={showcaseInnerRef} className="mx-auto max-w-4xl rounded-[2.5rem] bg-zinc-900/20 p-4 ring-1 ring-inset ring-white/5 backdrop-blur-xl opacity-0 overflow-hidden shadow-2xl">
                            <div className="rounded-[2rem] bg-[#0d0d0f] ring-1 ring-white/5 overflow-hidden flex flex-col items-center justify-center py-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black z-10 pointer-events-none"></div>

                                <div className="relative z-20 flex flex-col sm:flex-row gap-8 px-10">
                                    {/* Score Card */}
                                    <div className="relative w-full sm:w-[340px] rounded-3xl bg-[#0F0F11]/90 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] ring-1 ring-white/10 overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                        
                                        <div className="p-7 flex flex-col justify-between h-[190px] relative z-10">
                                            <div className="flex justify-between items-start">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
                                                    <TrendingUp className="h-6 w-6 text-white drop-shadow-md" />
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="px-3 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/20 rounded-full flex items-center gap-1.5 shadow-sm shadow-emerald-500/10">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                        </span>
                                                        +12.5%
                                                    </span>
                                                    <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mt-2">Live Trend</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-1">Impact Score</p>
                                                <div className="flex items-baseline gap-1 mt-1">
                                                    <p className="text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight drop-shadow-sm">8.4</p>
                                                    <span className="text-xl text-zinc-500 font-bold">/10</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>
                                    </div>

                                    {/* Engagement Detail Card */}
                                    <div className="relative w-full sm:w-[340px] flex flex-col gap-6">
                                        <div className="relative w-full rounded-2xl bg-[#0F0F11]/90 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] ring-1 ring-white/10 p-6 overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:bg-cyan-500/20 pointer-events-none"></div>
                                            <div className="flex items-center gap-4 relative z-10 w-full">
                                                <div className="h-12 w-12 rounded-2xl bg-zinc-800/80 ring-1 ring-white/10 flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                                                    <Users className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="text-white font-bold text-lg leading-tight truncate pr-2">High Retention</p>
                                                        <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                                                    </div>
                                                    <p className="text-cyan-400 text-sm font-semibold truncate">Top 5% Engagement Rate</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative w-full rounded-2xl bg-[#0F0F11]/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] ring-1 ring-white/5 p-6 border-l-4 border-l-indigo-500">
                                            <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-widest">Growth Forecast</h4>
                                            <div className="flex items-end justify-between">
                                                <p className="text-zinc-400 text-xs">Estimated followers by next month</p>
                                                <p className="text-2xl font-black text-white">+14,500</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div ref={statsRef} className="py-32 border-t border-white/5 bg-[#080808]">
                    <div className="mx-auto max-w-5xl px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                            {[
                                { label: "Profiles Analyzed", value: 12847, suffix: "+" },
                                { label: "AI Insights Generated", value: 98432, suffix: "+" },
                                { label: "Avg Score Improvement", value: 34, suffix: "%" },
                                { label: "Creator Satisfaction", value: 99, suffix: "%" },
                            ].map((stat, i) => (
                                <div key={i} className="stat-item text-center flex flex-col items-center gap-4 group">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <span className="relative text-4xl sm:text-6xl font-display font-black text-white">
                                            <span className="stat-number" data-value={stat.value}>0</span>{stat.suffix}
                                        </span>
                                    </div>
                                    <span className="text-sm text-zinc-500 font-bold uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
