"use client";

import { useEffect, useRef } from "react";
import { Zap, BarChart3, Users, TrendingUp, Shield, Globe, Sparkles } from "lucide-react";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const featureCards = [
    { icon: Zap, title: "AI-Powered Scoring", desc: "Get an instant overall score with detailed breakdowns across 6 key metric dimensions.", color: "text-amber-400", bg: "bg-amber-500/10" },
    { icon: BarChart3, title: "Engagement Analytics", desc: "Deep-dive into your like-to-follower ratio, comment sentiment, and posting cadence.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { icon: Users, title: "Audience Insights", desc: "Understand your follower demographics, growth trajectory, and retention signals.", color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { icon: TrendingUp, title: "Growth Strategy", desc: "Receive AI-generated recommendations for hashtags, posting times, and content mix.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: Shield, title: "Competitor Analysis", desc: "Benchmark your profile against top creators in your niche with side-by-side insights.", color: "text-rose-400", bg: "bg-rose-500/10" },
    { icon: Globe, title: "Content Optimization", desc: "Optimize every post with AI suggestions for captions, hashtags, and visual appeal.", color: "text-purple-400", bg: "bg-purple-500/10" },
];

export default function FeaturesPage() {
    const featuresRef = useRef<HTMLDivElement>(null);
    const featureCardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (featureCardsRef.current) {
                const cards = featureCardsRef.current.querySelectorAll(".feature-card");
                gsap.fromTo(cards, {
                    y: 60,
                    opacity: 0,
                    scale: 0.95,
                }, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: featuresRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                });
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200">
            <Header />
            <main className="flex-1 pt-32 sm:pt-40">
                <div ref={featuresRef} className="pb-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center mb-20">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 ring-1 ring-white/10 mb-8">
                                <Sparkles className="h-4 w-4 text-indigo-400" />
                                <span className="text-sm font-bold tracking-widest uppercase text-zinc-300">Feature Roadmap</span>
                            </div>
                            <h1 className="text-4xl font-display font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-sm">
                                Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">dominate</span> the algorithm.
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-zinc-400">
                                Stop relying on raw follower counts. Our proprietary AI dives deep into your profile to extract meaningful, actionable insights that actually drive growth.
                            </p>
                        </div>

                        <div ref={featureCardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featureCards.map((feature, i) => (
                                <div key={i} className="feature-card group relative rounded-3xl bg-zinc-900/40 border border-white/5 p-10 transition-all duration-500 hover:border-white/10 hover:bg-zinc-900/80 hover:-translate-y-2 shadow-xl">
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className={`relative h-14 w-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 ring-1 ring-white/10 shadow-lg`}>
                                        <feature.icon className={`h-7 w-7 ${feature.color}`} />
                                    </div>
                                    <h3 className="relative text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                                    <p className="relative text-zinc-400 leading-relaxed font-medium">{feature.desc}</p>
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
