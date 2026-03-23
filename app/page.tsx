"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import FuturisticHero from "@/components/modern/FuturisticHero";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    const cleanUsername = username.replace(/^@/, "").trim();
    router.push(`/analytics/${cleanUsername}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />
      <main className="flex-1 w-full">
        <FuturisticHero
          username={username}
          setUsername={setUsername}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />
      </main>
      <Footer />
    </div>
  );
}
