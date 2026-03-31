"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

const issueTypes = [
  "General support",
  "Account access",
  "Billing question",
  "Analysis issue",
  "Bug report",
  "Security concern",
];

export default function SupportContactForm() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [issueType, setIssueType] = useState(issueTypes[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      setIsAuthLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setIsAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const accountName = useMemo(() => {
    if (!session?.user) return "";
    const metadata = session.user.user_metadata as Record<string, string | undefined>;
    return metadata?.full_name || metadata?.username || session.user.email || "";
  }, [session]);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    } else {
      setEmail("");
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (accountName && !name) {
      setName(accountName);
    }
  }, [accountName, name]);

  const isAuthenticated = Boolean(session?.user);

  const isValid = useMemo(() => {
    return (
      isAuthenticated &&
      name.trim() &&
      email.trim() &&
      message.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    );
  }, [isAuthenticated, email, message, name]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setError("Log in to your account to contact support.");
      setSuccess("");
      return;
    }

    if (!isValid) {
      setError("Add your name and a short message.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;

      if (!accessToken) {
        throw new Error("Log in again to send your support request.");
      }

      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email,
          username: username.replace(/^@/, "").trim(),
          issueType,
          message: message.trim(),
        }),
      });

      const json = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to send your support message right now.");
      }

      setSuccess("Support request sent. Check your inbox if we reply there.");
      setUsername("");
      setIssueType(issueTypes[0]);
      setMessage("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send your support message right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailHelper = isAuthenticated
    ? "Using your account email"
    : "Log in to send from your account email";

  return (
    <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8">
      <p className="text-sm font-bold uppercase tracking-[0.24em] text-zinc-500">
        Send a request
      </p>
      <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight text-white">
        Fill this out and send your support message faster.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
        Send a request directly from the site and it will be delivered to your
        support inbox.
      </p>

      {!isAuthenticated && !isAuthLoading ? (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <span>Log in to your account to send support requests.</span>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-zinc-900 hover:bg-zinc-200"
          >
            Go to login
          </Link>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="h-13 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition-all placeholder:text-zinc-500 focus:border-cyan-400/40"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Email (account)
            </span>
            <input
              type="email"
              value={email}
              readOnly
              disabled
              placeholder="you@example.com"
              className="h-13 w-full cursor-not-allowed rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white opacity-80 outline-none"
            />
            <span className="mt-1 block text-xs text-zinc-500">{emailHelper}</span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Instagram username
            </span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="@username"
              className="h-13 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition-all placeholder:text-zinc-500 focus:border-cyan-400/40"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Issue type
            </span>
            <select
              value={issueType}
              onChange={(event) => setIssueType(event.target.value)}
              className="h-13 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition-all focus:border-cyan-400/40"
            >
              {issueTypes.map((option) => (
                <option key={option} value={option} className="bg-[#111111]">
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            Message
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell us what happened, what you expected, and any details that can help."
            rows={6}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-white outline-none transition-all placeholder:text-zinc-500 focus:border-cyan-400/40"
          />
        </label>

        {error ? <p className="text-sm font-medium text-rose-300">{error}</p> : null}
        {success ? (
          <p className="text-sm font-medium text-emerald-300">{success}</p>
        ) : null}

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={isSubmitting || isAuthLoading}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-950 transition-all hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Mail className="h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send support email"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
