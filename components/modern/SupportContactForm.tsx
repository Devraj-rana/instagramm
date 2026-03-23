"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

const issueTypes = [
  "General support",
  "Account access",
  "Billing question",
  "Analysis issue",
  "Bug report",
  "Security concern",
];

export default function SupportContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [issueType, setIssueType] = useState(issueTypes[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(() => {
    return (
      name.trim() &&
      email.trim() &&
      message.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    );
  }, [email, message, name]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      setError("Add your name, a valid email, and a short message.");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
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
      setName("");
      setEmail("");
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
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-13 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition-all placeholder:text-zinc-500 focus:border-cyan-400/40"
            />
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
            disabled={isSubmitting}
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
