"use client";

import Link from "next/link";
import { ChevronRight, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

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
                    <Logo />
                </Link>

                {/* Navigation - Centered Floating Links */}
                <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/5 p-1 shadow-inner ring-1 ring-white/10">
                    {["Home", "Features", "Services", "Testimonials"].map((item) => (
                        <Link
                            key={item}
                            href={item === "Home" ? "/" : item === "Services" ? "/#services" : `/${item.toLowerCase()}`}
                            className="relative px-5 py-2 text-sm font-bold text-zinc-400 transition-colors hover:text-white group rounded-full hover:bg-white/10 overflow-hidden"
                        >
                            <span className="relative z-10">{item}</span>
                        </Link>
                    ))}
                </nav>

                {/* Auth Action */}
                <div className="flex items-center gap-4">
                    <AuthButton />
                </div>
            </div>
        </motion.header>
    );
}

function AuthButton() {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (status === "loading") {
        return <div className="h-11 w-24 animate-pulse rounded-full bg-white/5" />;
    }

    if (session) {
        return (
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 px-3 transition-all hover:bg-white/10"
                >
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-indigo-500 flex items-center justify-center">
                        {session.user?.image ? (
                            <img src={session.user.image} alt={session.user.name || "User"} className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-4 w-4 text-white" />
                        )}
                    </div>
                    <span className="hidden sm:block text-sm font-bold text-white max-w-[100px] truncate">
                        {session.user?.name?.split(" ")[0]}
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
                            <button
                                onClick={() => signOut()}
                                className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                            >
                                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Sign Out
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
                onClick={() => signIn("google")}
                className="group relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-6 text-sm font-bold text-zinc-900 shadow-xl transition-all hover:bg-zinc-200 hover:shadow-indigo-500/25"
            >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"></div>
                <span>Sign In</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
        </motion.div>
    );
}
