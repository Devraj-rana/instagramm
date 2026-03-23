"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, TrendingUp, Users, Eye, Target, Sparkles, MessageCircle, Heart, ArrowLeft } from "lucide-react";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/modern/Card";
import { Button } from "@/components/modern/Button";
import { cn } from "@/lib/utils";
import type { AnalysisResult, AnalysisAPIResponse } from "@/lib/types";
import gsap from "gsap";

export default function AnalysisResultsPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;

    const [state, setState] = useState<"loading" | "success" | "error">("loading");
    const [data, setData] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState("");
    const [progress, setProgress] = useState(0);
    const [imgError, setImgError] = useState(false);
    const bentoGridRef = useRef<HTMLDivElement>(null);

    const runAnalysis = useCallback(async () => {
        setState("loading");
        setProgress(0);
        setError("");

        const progressInterval = setInterval(() => {
            setProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 5 + 1));
        }, 200);

        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const json: AnalysisAPIResponse = await res.json();

            if (!json.success || !json.data) {
                throw new Error(json.error || "Analysis failed");
            }

            clearInterval(progressInterval);
            setProgress(100);
            await new Promise((r) => setTimeout(r, 400));

            setData(json.data);
            setState("success");

            // Trigger GSAP staggered entrance after React renders
            requestAnimationFrame(() => {
                if (bentoGridRef.current) {
                    const cards = bentoGridRef.current.children;
                    gsap.fromTo(cards, {
                        y: 50,
                        opacity: 0,
                        scale: 0.92,
                    }, {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.7,
                        stagger: 0.1,
                        ease: "back.out(1.4)",
                        delay: 0.2,
                    });
                }
            });
        } catch (err) {
            clearInterval(progressInterval);
            setError(err instanceof Error ? err.message : "Something went wrong");
            setState("error");
        }
    }, [username]);

    useEffect(() => {
        runAnalysis();
    }, [runAnalysis]);

    return (
        <div className="flex min-h-screen flex-col bg-[#0A0A0A] selection:bg-indigo-500/30 selection:text-indigo-200">
            <Header />

            <main className="flex-1 relative pb-20 pt-32">
                <AnimatePresence mode="wait">
                    {/* ────────────────────── LOADING STATE ────────────────────── */}
                    {state === "loading" && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mx-auto max-w-2xl px-6 text-center"
                        >
                            <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20 shadow-inner">
                                <Sparkles className="h-8 w-8 animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-semibold text-white drop-shadow-sm">Analyzing @{username}</h2>
                            <p className="mt-2 text-zinc-400">Extracting profile data and running AI metrics...</p>

                            <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "easeOut", duration: 0.2 }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* ────────────────────── ERROR STATE ────────────────────── */}
                    {state === "error" && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mx-auto max-w-lg px-6 pt-32 text-center"
                        >
                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
                                <Target className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Analysis Failed</h2>
                            <p className="mt-2 text-zinc-400">{error}</p>
                            <div className="mt-8 flex justify-center gap-4">
                                <Button onClick={() => router.push("/")} variant="outline">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
                                </Button>
                                <Button onClick={runAnalysis}>Try Again</Button>
                            </div>
                        </motion.div>
                    )}

                    {/* ────────────────────── SUCCESS STATE (BENTO DASHBOARD) ────────────────────── */}
                    {state === "success" && data && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, staggerChildren: 0.1 }}
                            className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
                        >
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-display font-bold text-white drop-shadow-sm">Profile Audit</h1>
                                    <p className="text-zinc-400">AI-generated insights and metrics.</p>
                                </div>
                                <Button onClick={() => router.push("/")} variant="outline" className="hidden sm:flex">
                                    Analyze Another
                                </Button>
                            </div>

                            {/* BENTO GRID */}
                            <div ref={bentoGridRef} className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">

                                {/* ── PROFILE HEADER (Spans 2/3 cols on md/lg) ── */}
                                <Card className="col-span-1 md:col-span-2 lg:col-span-2 overflow-hidden relative border-white/10 bg-[#121214]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0"></div>
                                    <CardContent className="relative z-10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 h-full">
                                        <div className="relative shrink-0">
                                            {data.profilePicUrl && !imgError ? (
                                                <img
                                                    src={data.profilePicUrl}
                                                    alt={data.username}
                                                    className="h-24 w-24 rounded-full border-4 border-[#121214] shadow-xl object-cover"
                                                    onError={() => setImgError(true)}
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="h-24 w-24 rounded-full border-4 border-[#121214] shadow-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 text-3xl font-bold">
                                                    {data.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-2xl font-bold text-white">@{data.username}</h2>
                                                {data.isVerified && <CheckCircle2 className="h-5 w-5 text-indigo-400" fill="currentColor" stroke="#121214" />}
                                            </div>
                                            <p className="text-zinc-400 font-medium">{data.fullName}</p>
                                            <p className="mt-3 text-sm text-zinc-400 line-clamp-2">{data.bio || "No bio available."}</p>

                                            <div className="mt-4 flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-3 text-sm text-zinc-300">
                                                <div className="flex items-center gap-1.5 font-semibold text-white bg-white/5 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-lg sm:rounded-none">
                                                    {formatNumber(data.followers)} <span className="text-zinc-400 font-normal">Followers</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 font-semibold text-white bg-white/5 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-lg sm:rounded-none">
                                                    {formatNumber(data.following)} <span className="text-zinc-400 font-normal">Following</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 font-semibold text-white bg-white/5 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-lg sm:rounded-none">
                                                    {formatNumber(data.postsCount)} <span className="text-zinc-400 font-normal">Posts</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* ── AI SCORE (Spans 1 col) ── */}
                                <Card className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col justify-center items-center p-8 text-center bg-[#121214] ring-1 ring-white/10 text-white border-0 shadow-lg">
                                    <div className="mb-2 h-12 w-12 rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20 flex items-center justify-center backdrop-blur-md">
                                        <TrendingUp className="h-6 w-6 text-indigo-400" />
                                    </div>
                                    <p className="text-white/70 font-medium text-sm">Overall Score</p>
                                    <div className="mt-1 flex items-baseline gap-1">
                                        <span className="text-5xl font-display font-bold text-white">{data.overallScore}</span>
                                        <span className="text-white/50 text-xl font-medium">/10</span>
                                    </div>
                                </Card>

                                {/* ── ENGAGEMENT METRICS ── */}
                                <Card className="col-span-1 md:col-span-3 lg:col-span-1 border-0 bg-transparent shadow-none">
                                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
                                        <Card className="p-4 flex flex-col justify-center bg-[#121214] border-white/10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Heart className="h-4 w-4 text-rose-500" />
                                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Avg Likes</span>
                                            </div>
                                            <span className="text-2xl font-bold text-white drop-shadow-sm">{formatNumber(data.avgLikes || 0)}</span>
                                        </Card>
                                        <Card className="p-4 flex flex-col justify-center bg-[#121214] border-white/10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MessageCircle className="h-4 w-4 text-indigo-400" />
                                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Avg Comments</span>
                                            </div>
                                            <span className="text-2xl font-bold text-white drop-shadow-sm">{formatNumber(data.avgComments || 0)}</span>
                                        </Card>
                                    </div>
                                </Card>

                                {/* ── EXECUTIVE SUMMARY ── */}
                                <Card className="col-span-1 md:col-span-3 lg:col-span-2 bg-[#121214] border-white/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-white">
                                            <Sparkles className="h-5 w-5 text-indigo-400" />
                                            Executive Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-zinc-400 leading-relaxed max-w-2xl">{data.summary}</p>

                                        <div className="mt-6 flex flex-col gap-3">
                                            <h4 className="text-sm font-bold tracking-wider text-white uppercase drop-shadow-sm">Actionable Improvements</h4>
                                            <ul className="space-y-3">
                                                {data.improvements.slice(0, 3).map((imp, idx) => (
                                                    <li key={idx} className="flex gap-3 text-sm text-zinc-300 bg-white/5 ring-1 ring-white/10 rounded-xl p-3">
                                                        <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30 font-bold text-xs">
                                                            {idx + 1}
                                                        </span>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-white drop-shadow-sm">{imp.title}</span>
                                                            <span className="text-zinc-400 mt-1">{imp.suggestions[0]}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* ── ACCOUNT DETAILS & CATEGORIES ── */}
                                <Card className="col-span-1 md:col-span-3 lg:col-span-2 bg-[#121214] border-white/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-white">
                                            <Eye className="h-5 w-5 text-purple-400" />
                                            Detailed Breakdown
                                        </CardTitle>
                                        <CardDescription className="text-zinc-400">AI evaluation across key profile vectors.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {data.categories.map((cat, idx) => (
                                                <div key={idx} className="flex flex-col gap-1 p-4 rounded-xl border border-white/10 bg-[#18181B] shadow-sm">
                                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{cat.title}</span>
                                                    <span className={cn(
                                                        "text-lg font-bold drop-shadow-sm",
                                                        cat.score >= 8 ? "text-emerald-400" :
                                                            cat.score >= 5 ? "text-indigo-400" :
                                                                "text-amber-400"
                                                    )}>
                                                        {cat.score * 10}%
                                                    </span>
                                                    <span className="text-xs text-zinc-500 mt-1">{cat.insight}</span>
                                                </div>
                                            ))}

                                            <div className="flex flex-col gap-1 p-4 rounded-xl border border-white/10 bg-[#18181B] shadow-sm">
                                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Account Visibility</span>
                                                <span className="text-lg font-bold text-white drop-shadow-sm">
                                                    {data.isPrivate ? "Private" : "Public"} {data.accountType}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-1 p-4 rounded-xl border border-white/10 bg-[#18181B] shadow-sm">
                                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Engagement Rate</span>
                                                <span className="text-lg font-bold text-white drop-shadow-sm">
                                                    {data.engagementRate}%
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>

                            {/* Bottom Nav */}
                            <div className="mt-12 flex justify-center pb-12 sm:hidden">
                                <Button onClick={() => router.push("/")} variant="outline" size="lg" className="w-full">
                                    Analyze Another Profile
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}

function formatNumber(num: number): string {
    if (num === undefined || num === null) return "0";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
}
