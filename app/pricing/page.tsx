import { Check, Sparkles } from "lucide-react";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import { Button } from "@/components/modern/Button";
import { cn } from "@/lib/utils";

const tiers = [
    {
        name: "Creator Basic",
        id: "tier-basic",
        href: "#",
        priceMonthly: "$0",
        description: "Perfect for individuals starting to take their growth seriously.",
        features: ["1 Profile Analysis / Day", "Basic Engagement Metrics", "7-Day Historical Data", "Standard Email Support"],
        mostPopular: false,
    },
    {
        name: "Pro Growth",
        id: "tier-pro",
        href: "#",
        priceMonthly: "$29",
        description: "Advanced AI insights for serious creators and small agencies.",
        features: [
            "Unlimited Profile Analysis",
            "Deep AI Content Audits",
            "Competitor Benchmarking (Up to 5)",
            "Shadowban Detection",
            "30-Day Historical Data",
            "Priority Support",
        ],
        mostPopular: true,
    },
    {
        name: "Agency Enterprise",
        id: "tier-agency",
        href: "#",
        priceMonthly: "$99",
        description: "Full-scale brand monitoring and bulk analysis infrastructure.",
        features: [
            "Everything in Pro Growth",
            "Unlimited Competitor Tracking",
            "Exportable PDF/CSV Reports",
            "Custom Branded Dashboards",
            "API Access",
            "24/7 Dedicated Account Manager",
        ],
        mostPopular: false,
    },
];

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[#0A0A0A] selection:bg-indigo-500/30 selection:text-indigo-200">
            <Header />
            <main className="flex-1 relative pb-24 pt-32 sm:pt-40">
                {/* Background glow */}
                <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl opacity-30" aria-hidden="true">
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-500/30 to-rose-500/30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="mt-2 text-4xl font-display font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-sm">
                            Pricing that scales with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">audience</span>.
                        </h1>
                    </div>
                    <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-zinc-400">
                        Whether you are a solo creator or managing a massive roster of influencer talent, we have a tier designed specifically for your analytics volume.
                    </p>

                    <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {tiers.map((tier) => (
                            <div
                                key={tier.id}
                                className={cn(
                                    tier.mostPopular ? "ring-2 ring-indigo-500 bg-[#121214] scale-105 z-10" : "ring-1 ring-white/10 bg-[#121214]/50",
                                    "rounded-3xl p-8 xl:p-10 flex flex-col justify-between shadow-2xl transition-all"
                                )}
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-x-4">
                                        <h3
                                            id={tier.id}
                                            className={cn(
                                                tier.mostPopular ? "text-indigo-400" : "text-white",
                                                "text-xl font-bold leading-8 drop-shadow-sm"
                                            )}
                                        >
                                            {tier.name}
                                        </h3>
                                        {tier.mostPopular ? (
                                            <p className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold leading-5 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                                                Most popular
                                            </p>
                                        ) : null}
                                    </div>
                                    <p className="mt-4 text-sm leading-6 text-zinc-400">{tier.description}</p>
                                    <p className="mt-6 flex items-baseline gap-x-1">
                                        <span className="text-4xl font-display font-bold tracking-tight text-white">{tier.priceMonthly}</span>
                                        <span className="text-sm font-semibold leading-6 text-zinc-500">/month</span>
                                    </p>
                                    <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-zinc-300 xl:mt-10">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex gap-x-3 items-start">
                                                <Check className="h-6 w-5 flex-none text-indigo-400" aria-hidden="true" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-8">
                                    <Button
                                        className={cn(
                                            "w-full h-12 rounded-xl font-bold shadow-lg transition-all active:scale-95",
                                            tier.mostPopular
                                                ? "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/25"
                                                : "bg-white/10 text-white hover:bg-white/20"
                                        )}
                                    >
                                        Buy {tier.name}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
