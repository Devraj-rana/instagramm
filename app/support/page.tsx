import Link from "next/link";
import {
  ArrowRight,
  BadgeHelp,
  Clock3,
  LifeBuoy,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import SupportContactForm from "@/components/modern/SupportContactForm";

const supportChannels = [
  {
    icon: Mail,
    title: "Email support",
    description:
      "Reach us for billing issues, account access questions, or help understanding your analytics results.",
    actionLabel: "support@socialinsight.tech",
    actionHref: "mailto:support@socialinsight.tech",
    accent: "from-cyan-400/30 to-blue-500/10",
    iconColor: "text-cyan-300",
  },
  {
    icon: LifeBuoy,
    title: "Product guidance",
    description:
      "Need help using profile analysis, reports, or account settings? We can point you to the fastest path.",
    actionLabel: "Open support email",
    actionHref: "mailto:support@socialinsight.tech?subject=Product%20Support",
    accent: "from-indigo-400/30 to-purple-500/10",
    iconColor: "text-indigo-300",
  },
  {
    icon: ShieldCheck,
    title: "Security concerns",
    description:
      "If you notice suspicious activity or think something is off, contact us right away and we will prioritize it.",
    actionLabel: "Report an issue",
    actionHref: "mailto:support@socialinsight.tech?subject=Security%20Concern",
    accent: "from-emerald-400/30 to-cyan-500/10",
    iconColor: "text-emerald-300",
  },
];

const supportTopics = [
  "Account access and sign-in problems",
  "Billing questions and purchase support",
  "Instagram analysis results and report clarity",
  "Feature requests or unexpected behavior",
];

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      <main className="relative flex-1 overflow-hidden pt-32 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="absolute left-1/2 top-0 h-80 w-[72rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 lg:px-8">
          <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-300">
                  Support Center
                </span>
              </div>

              <h1 className="max-w-3xl font-display text-5xl font-black tracking-tighter text-white sm:text-6xl">
                Help for accounts, billing, and product questions that need a
                real answer.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                Contact the Social Insight.Tech support team for troubleshooting,
                plan questions, report clarity, or anything that blocks your
                workflow. We keep it simple and respond by email.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
                  <Clock3 className="h-6 w-6 text-cyan-300" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Response window
                  </p>
                  <p className="mt-3 text-3xl font-black tracking-tight text-white">
                    24-48 hours
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    Include your account email, Instagram username, and a short
                    description of the issue so we can help faster.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {supportChannels.map((channel) => (
              <article
                key={channel.title}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${channel.accent} opacity-80`}
                />
                <div className="relative">
                  <div className="mb-6 inline-flex rounded-2xl border border-white/10 bg-black/20 p-3 backdrop-blur-sm">
                    <channel.icon className={`h-6 w-6 ${channel.iconColor}`} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    {channel.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-zinc-300">
                    {channel.description}
                  </p>
                  <a
                    href={channel.actionHref}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-cyan-200"
                  >
                    <span>{channel.actionLabel}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
              <div className="mb-6 flex items-center gap-3">
                <BadgeHelp className="h-5 w-5 text-indigo-300" />
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Common support topics
                </h2>
              </div>

              <div className="space-y-4">
                {supportTopics.map((topic) => (
                  <div
                    key={topic}
                    className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-4"
                  >
                    <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
                    <p className="text-sm leading-7 text-zinc-300">{topic}</p>
                  </div>
                ))}
              </div>
            </div>

            <SupportContactForm />
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-zinc-500">
              Before you email
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight text-white">
              A little context helps us solve the issue in one reply instead of
              five.
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Share the email attached to your account",
                "Tell us which page or action caused the issue",
                "Mention whether this is billing, access, or analysis related",
                "Add screenshots if the bug is visual or intermittent",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-5 text-sm leading-7 text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="mailto:support@socialinsight.tech"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-950 transition-all hover:bg-zinc-200"
              >
                <Mail className="h-4 w-4" />
                Email support
              </a>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
              >
                Privacy policy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
