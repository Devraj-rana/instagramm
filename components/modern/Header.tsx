"use client";

import Link from "next/link";
import { ChevronRight, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session as SupabaseSession } from "@supabase/supabase-js";

export default function Header() {
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.8 }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        >
            <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-4xl border border-white/10 bg-[#121214]/60 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all hover:bg-[#121214]/80 hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)] ring-1 ring-white/5">
                <Link href="/" className="group flex items-center gap-3">
                    <Logo />
                </Link>

                <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/5 p-1 shadow-inner ring-1 ring-white/10">
                    {["Home", "Analytics", "Features", "Pricing", "Testimonials"].map((item) => (
                        <Link
                            key={item}
                            href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                            className="relative px-5 py-2 text-sm font-bold text-zinc-400 transition-colors hover:text-white group rounded-full hover:bg-white/10 overflow-hidden"
                        >
                            <span className="relative z-10">{item}</span>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <AuthButton />
                </div>
            </div>
        </motion.header>
    );
}

function AuthButton() {
    const [supabaseSession, setSupabaseSession] = useState<SupabaseSession | null>(null);
    const [isSupabaseLoading, setIsSupabaseLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!isMounted) {
                return;
            }

            setSupabaseSession(data.session);
            setIsSupabaseLoading(false);
        };

        loadSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSupabaseSession(session);
            setIsSupabaseLoading(false);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const activeUser = useMemo(() => {
        if (supabaseSession?.user) {
            const metadata = supabaseSession.user.user_metadata;
            return {
                image: metadata?.avatar_url ?? null,
                name: metadata?.full_name ?? metadata?.username ?? supabaseSession.user.email ?? "User",
            };
        }

        return null;
    }, [supabaseSession]);

    const isLoading = isSupabaseLoading;
    const isAuthenticated = Boolean(supabaseSession?.user);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        setIsMenuOpen(false);

        if (supabaseSession?.user) {
            await supabase.auth.signOut();
        }

        setIsSigningOut(false);
    };

    if (isLoading) {
        return <div className="h-11 w-24 animate-pulse rounded-full bg-white/5" />;
    }

    if (isAuthenticated && activeUser) {
        return (
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 px-3 transition-all hover:bg-white/10"
                >
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-indigo-500">
                        {activeUser.image ? (
                            <img src={activeUser.image} alt={activeUser.name} className="h-full w-full object-cover" />
                        ) : (
                            <Logo showText={false} className="scale-75" />
                        )}
                    </div>
                    <span className="hidden max-w-25 truncate text-sm font-bold text-white sm:block">
                        {activeUser.name.split(" ")[0]}
                    </span>
                </motion.button>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl border border-white/10 bg-[#121214] p-2 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl"
                        >
                            <Link
                                href="/account"
                                onClick={() => setIsMenuOpen(false)}
                                className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
                            >
                                <Settings className="h-4 w-4 transition-transform group-hover:rotate-12" />
                                My Account
                            </Link>
                            <button
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                                className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                {isSigningOut ? "Signing Out..." : "Sign Out"}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
                href="/sign-up"
                className="group relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-6 text-sm font-bold text-zinc-900 shadow-xl transition-all hover:bg-zinc-200 hover:shadow-indigo-500/25"
            >
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"></div>
                <span>Sign Up</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
        </motion.div>
    );
}
