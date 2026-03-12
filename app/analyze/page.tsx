"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import Header from "@/components/modern/Header";
import { Button } from "@/components/modern/Button";

export default function AnalyzeIndexPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsLoading(true);
        const cleanUsername = username.replace(/^@/, "").trim();
        router.push(`/analyze/${cleanUsername}`);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#FAFAFA] selection:bg-blue-100 selection:text-blue-900">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Soft Background Gradients */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-[#FAFAFA] to-[#FAFAFA]"></div>

                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl ring-1 ring-zinc-200/50 p-8 sm:p-10 relative z-10">
                    <div className="mx-auto mb-6 h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <Search className="h-6 w-6 text-blue-600" />
                    </div>

                    <h1 className="text-2xl font-display font-bold text-center text-zinc-900 mb-2">
                        Analyze a Profile
                    </h1>
                    <p className="text-center text-zinc-500 text-sm mb-8">
                        Enter an Instagram username below to generate a comprehensive AI audit.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">@</span>
                            <input
                                type="text"
                                placeholder="cristiano"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-14 rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                                autoFocus
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!username.trim() || isLoading}
                            className="w-full h-14 text-base rounded-xl"
                        >
                            {isLoading ? "Starting Analysis..." : "Analyze Profile"}
                            {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
