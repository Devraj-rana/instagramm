"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AtSign,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import { Button } from "@/components/modern/Button";

const sampleUsernames = ["cristiano", "zendaya", "natgeo"];

const featurePills = [
  {
    icon: BarChart3,
    title: "Score the profile",
    description: "Review audience quality, profile strength, and content signals in one pass.",
  },
  {
    icon: Target,
    title: "Find weak spots",
    description: "See where the account loses momentum and what to improve next.",
  },
  {
    icon: ShieldCheck,
    title: "Fast no-login flow",
    description: "Analyze a public Instagram profile without connecting your own account.",
  },
];

const auditSteps = [
  "We fetch the public profile and engagement signals.",
  "The analyzer scores key categories and content quality.",
  "You get a summary plus practical next-step recommendations.",
];

export default function AnalyzeIndexPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const cleanUsername = useMemo(
    () => username.replace(/^@/, "").trim().replace(/\s+/g, ""),
    [username]
  );

  const previewHandle = cleanUsername || "yourhandle";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cleanUsername) {
      setError("Enter an Instagram username to continue.");
      return;
    }

    if (!/^[a-zA-Z0-9._]+$/.test(cleanUsername)) {
      setError("Use only letters, numbers, periods, or underscores.");
      return;
    }

    setError("");
    setIsLoading(true);
    router.push(`/analytics/${cleanUsername}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#060606] text-zinc-100 selection:bg-cyan-400/20 selection:text-cyan-100">
      <Header />

      <main className="relative flex-1 overflow-hidden pt-28 sm:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(180deg,_#070707_0%,_#050505_100%)]" />
        <div className="absolute left-1/2 top-0 h-[28rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

        <section className="relative mx-auto grid w-full max-w-7xl gap-14 px-6 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-zinc-300">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Instagram Audit
            </div>

            <h1 className="mt-7 max-w-4xl font-display text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Turn any public profile into a clear growth report.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              Drop in a username and get an instant AI read on engagement,
              profile quality, audience signals, and what to improve next.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="group flex h-16 flex-1 items-center gap-4 rounded-[1.25rem] border border-white/10 bg-black/20 px-5 transition-all focus-within:border-cyan-400/40 focus-within:bg-black/30">
                  <AtSign className="h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-cyan-300" />
                  <input
                    type="text"
                    placeholder="cristiano"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (error) {
                        setError("");
                      }
                    }}
                    className="h-full w-full bg-transparent text-lg font-medium text-white outline-none placeholder:text-zinc-500"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoFocus
                  />
                </label>

                <Button
                  type="submit"
                  disabled={!cleanUsername || isLoading}
                  className="h-16 rounded-[1.25rem] bg-white px-8 text-base font-bold text-zinc-950 hover:bg-zinc-200"
                >
                  {isLoading ? "Starting Analysis..." : "Analyze Profile"}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-zinc-300">
                  Preview: @{previewHandle}
                </span>
                <span>Public profiles work best.</span>
              </div>

              {error && (
                <p className="mt-4 text-sm font-medium text-rose-300">{error}</p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
                  Try one
                </span>
                {sampleUsernames.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setUsername(sample);
                      setError("");
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-white"
                  >
                    @{sample}
                  </button>
                ))}
              </div>
            </form>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {featurePills.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="mb-4 inline-flex rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
                    <item.icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <h2 className="text-lg font-bold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-400/10 via-blue-500/8 to-transparent blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d10]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
                    Audit Preview
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    @{previewHandle}
                  </h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Ready
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Overall Score", value: "8.4/10" },
                  { label: "Engagement Review", value: "Strong" },
                  { label: "Profile Positioning", value: "Clear" },
                  { label: "Content Momentum", value: "Improving" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                      {item.label}
                    </p>
                    <p className="mt-3 text-2xl font-black text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-cyan-300" />
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                    What you get
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {auditSteps.map((step) => (
                    <div key={step} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-300" />
                      <p className="text-sm leading-7 text-zinc-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-indigo-400/10 bg-gradient-to-br from-indigo-400/10 to-cyan-400/5 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Best for
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Creators, agencies, and brands that want a fast profile check
                  before making content, pricing, or growth decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
