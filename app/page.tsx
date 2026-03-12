"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Users, Zap, BarChart3, Shield, Globe } from "lucide-react";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import FuturisticHero from "@/components/modern/FuturisticHero";
import StickySearchBar from "@/components/modern/StickySearchBar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Refs for GSAP scroll animations
  const showcaseRef = useRef<HTMLDivElement>(null);
  const showcaseInnerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    const cleanUsername = username.replace(/^@/, "").trim();
    router.push(`/analyze/${cleanUsername}`);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Showcase section: 3D tilt + scale up on scroll ──
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

      // ── Feature cards: staggered slide-up ──
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

      // ── Stats counter animation ──
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

        // Animate stat numbers
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
    <div className="flex min-h-screen flex-col selection:bg-cyan-100 selection:text-cyan-900 bg-[#0A0A0A]">
      <StickySearchBar initialUsername={username} />
      <Header />

      <main className="flex-1 w-full">
        <FuturisticHero
          username={username}
          setUsername={setUsername}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* ═══ Decorative App Screenshot — GSAP ScrollTrigger ═══ */}
        <div ref={showcaseRef} className="relative -mt-32 sm:-mt-40 z-10 pb-20 pointer-events-none">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div ref={showcaseInnerRef} className="pointer-events-auto mx-auto max-w-4xl rounded-3xl sm:rounded-[2.5rem] bg-zinc-900/40 p-2 sm:p-4 ring-1 ring-inset ring-white/10 backdrop-blur-sm opacity-0">
              <div className="rounded-2xl sm:rounded-[2rem] bg-[#0d0d0f] ring-1 ring-white/5 shadow-2xl overflow-hidden flex flex-col items-center justify-center py-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#0A0A0A]/100 z-10 pointer-events-none"></div>

                <div className="relative z-20 flex gap-6 px-10">
                  <div className="hidden sm:flex flex-col gap-4 opacity-50 translate-y-12">
                    <div className="w-64 h-32 rounded-2xl bg-zinc-900/80 backdrop-blur-xl shadow-sm ring-1 ring-white/10"></div>
                    <div className="w-64 h-48 rounded-2xl bg-zinc-900/80 backdrop-blur-xl shadow-sm ring-1 ring-white/10"></div>
                  </div>
                  <div className="flex flex-col gap-6 z-30 transform hover:-translate-y-2 transition-transform duration-700 w-full max-w-[340px]">
                    {/* The Main Score Card */}
                    <div className="relative w-full rounded-3xl bg-[#0F0F11]/90 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] ring-1 ring-white/10 overflow-hidden group">
                      {/* Animated Glow behind the card */}
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
                            <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mt-2">30 Day Trend</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-1">Profile Score</p>
                          <div className="flex items-baseline gap-1 mt-1">
                            <p className="text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight drop-shadow-sm">8.4</p>
                            <span className="text-xl text-zinc-500 font-bold">/10</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Decorative bottom bar */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>
                    </div>

                    {/* The Engagement Card */}
                    <div className="relative w-full rounded-2xl bg-[#0F0F11]/90 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] ring-1 ring-white/10 p-6 overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:bg-cyan-500/20 pointer-events-none"></div>
                      <div className="flex items-center gap-4 relative z-10 w-full">
                        <div className="h-12 w-12 rounded-2xl bg-zinc-800/80 ring-1 ring-white/10 flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                          <Users className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-white font-bold text-lg leading-tight truncate pr-2">High Engagement</p>
                            <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                          </div>
                          <p className="text-cyan-400 text-sm font-semibold truncate">Top 5% of creators</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col gap-4 opacity-50 translate-y-8">
                    <div className="w-64 h-40 rounded-2xl bg-zinc-900/80 backdrop-blur-xl shadow-sm ring-1 ring-white/10"></div>
                    <div className="w-64 h-32 rounded-2xl bg-zinc-900/80 backdrop-blur-xl shadow-sm ring-1 ring-white/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Stats Section — GSAP Counter Animation ═══ */}
        <div ref={statsRef} className="py-20 border-y border-white/5">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Profiles Analyzed", value: 12847, suffix: "+" },
                { label: "AI Insights Generated", value: 98432, suffix: "+" },
                { label: "Avg Score Improvement", value: 34, suffix: "%" },
                { label: "Creator Satisfaction", value: 99, suffix: "%" },
              ].map((stat, i) => (
                <div key={i} className="stat-item text-center flex flex-col items-center gap-2">
                  <span className="text-4xl sm:text-5xl font-display font-black text-white">
                    <span className="stat-number" data-value={stat.value}>0</span>{stat.suffix}
                  </span>
                  <span className="text-sm text-zinc-500 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Features Section — GSAP Staggered Cards ═══ */}
        <div ref={featuresRef} className="py-24">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
                Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">dominate</span>
              </h2>
              <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
                Our AI engine analyzes every dimension of your Instagram presence to give you unfair advantages.
              </p>
            </div>

            <div ref={featureCardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: "AI-Powered Scoring", desc: "Get an instant overall score with detailed breakdowns across 6 key metric dimensions.", color: "text-amber-400", bg: "bg-amber-500/10" },
                { icon: BarChart3, title: "Engagement Analytics", desc: "Deep-dive into your like-to-follower ratio, comment sentiment, and posting cadence.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
                { icon: Users, title: "Audience Insights", desc: "Understand your follower demographics, growth trajectory, and retention signals.", color: "text-indigo-400", bg: "bg-indigo-500/10" },
                { icon: TrendingUp, title: "Growth Strategy", desc: "Receive AI-generated recommendations for hashtags, posting times, and content mix.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { icon: Shield, title: "Competitor Analysis", desc: "Benchmark your profile against top creators in your niche with side-by-side insights.", color: "text-rose-400", bg: "bg-rose-500/10" },
                { icon: Globe, title: "Content Optimization", desc: "Optimize every post with AI suggestions for captions, hashtags, and visual appeal.", color: "text-purple-400", bg: "bg-purple-500/10" },
              ].map((feature, i) => (
                <div key={i} className="feature-card group relative rounded-2xl bg-zinc-900/50 border border-white/5 p-8 transition-all duration-500 hover:border-white/10 hover:bg-zinc-900/80 hover:-translate-y-1">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`relative h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5 ring-1 ring-white/5`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="relative text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="relative text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
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
