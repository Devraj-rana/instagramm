"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Instagram } from "lucide-react";

export default function StickySearchBar({ initialUsername = "" }: { initialUsername?: string }) {
    const router = useRouter();
    const [username, setUsername] = useState(initialUsername);
    const [isLoading, setIsLoading] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsLoading(true);
        const cleanUsername = username.replace(/^@/, "").trim();
        router.push(`/analytics/${cleanUsername}`);
    };

    return (
        <div 
            className={`fixed left-0 right-0 z-[100] flex justify-center px-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pb-4 sm:pb-8 ${
                isScrolled ? 'bottom-0 opacity-100 pointer-events-auto translate-y-0' : '-bottom-20 opacity-0 pointer-events-none translate-y-10'
            }`}
        >
            <div className="w-full max-w-3xl drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                <form onSubmit={handleAnalyze} className="flex w-full items-center pl-6 pr-2 py-2.5 rounded-3xl bg-[#0F0F11]/95 backdrop-blur-2xl ring-1 ring-white/15 transition-all hover:ring-white/30 focus-within:ring-2 focus-within:ring-pink-500 focus-within:shadow-[0_0_50px_rgba(236,72,153,0.3)] group shadow-[0_4px_40px_rgba(0,0,0,0.5)]">
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
                        {isLoading ? "Scanning..." : "Analyze"}
                        {!isLoading && <ArrowRight className="h-6 w-6" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
