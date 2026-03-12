"use client";

import Link from "next/link";
import { Instagram, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.8 }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        >
            <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-[2rem] border border-white/10 bg-[#121214]/60 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all hover:bg-[#121214]/80 hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)] ring-1 ring-white/5">
                {/* Logo Section */}
                <Link href="/" className="group flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-blue-500/30"
                    >
                        <Instagram className="h-5 w-5" />
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-950 shadow-sm ring-2 ring-indigo-500/30">
                            <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                        </span>
                    </motion.div>
                    <span className="font-display text-xl font-black tracking-tighter text-white drop-shadow-sm transition-all group-hover:text-indigo-400">
                        IGA<span className="text-indigo-400">.</span>
                    </span>
                </Link>

                {/* Navigation - Centered Floating Links */}
                <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/5 p-1 shadow-inner ring-1 ring-white/10">
                    {["Home", "Features", "Pricing", "Testimonials"].map((item) => (
                        <Link
                            key={item}
                            href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                            className="relative px-5 py-2 text-sm font-bold text-zinc-400 transition-colors hover:text-white group rounded-full hover:bg-white/10 overflow-hidden"
                        >
                            <span className="relative z-10">{item}</span>
                        </Link>
                    ))}
                </nav>

                {/* CTA Action */}
                <div className="flex items-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/"
                            className="group relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-6 text-sm font-bold text-zinc-900 shadow-xl transition-all hover:bg-zinc-200 hover:shadow-indigo-500/25"
                        >
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"></span>
                            <span>Get Started</span>
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
}
