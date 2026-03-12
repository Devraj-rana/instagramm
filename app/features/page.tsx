import { Sparkles, Users, Clock, Target, Shield, Zap, TrendingUp } from "lucide-react";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";

const features = [
    {
        name: "Deep Audience Analytics",
        description: "Understand exactly who your followers are, where they live, and what content they engage with most. Stop guessing and start targeting.",
        icon: Users,
    },
    {
        name: "Growth Trajectory Forecasting",
        description: "Our AI models predict your future follower growth based on your current trajectory and historical performance data.",
        icon: TrendingUp,
    },
    {
        name: "Best Time to Post",
        description: "Maximize your reach by posting exactly when your audience is most active. We calculate this down to the minute.",
        icon: Clock,
    },
    {
        name: "Competitor Benchmarking",
        description: "See how your engagement and growth stack up against industry leaders and direct competitors in your niche.",
        icon: Target,
    },
    {
        name: "Shadowban Detection",
        description: "Worried your posts aren't reaching non-followers? We scan your engagement patterns to detect potential algorithm penalties.",
        icon: Shield,
    },
    {
        name: "Instant Content Audits",
        description: "Evaluate your recent posts instantly. Find out which hashtags, formats, and captions actually drive results.",
        icon: Zap,
    },
];

export default function FeaturesPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[#0A0A0A] selection:bg-indigo-500/30 selection:text-indigo-200">
            <Header />
            <main className="flex-1 relative pb-24 pt-32 sm:pt-40">
                {/* Background glow */}
                <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 ring-1 ring-white/10 mb-8">
                            <Sparkles className="h-4 w-4 text-indigo-400" />
                            <span className="text-sm font-semibold text-zinc-300">Advanced Analytics Toolkit</span>
                        </div>
                        <h1 className="text-4xl font-display font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-sm">
                            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">dominate</span> the algorithm.
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-zinc-400">
                            Stop relying on raw follower counts. Our proprietary AI dives deep into your profile to extract meaningful, actionable insights that actually drive growth.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {features.map((feature) => (
                                <div key={feature.name} className="flex flex-col p-8 rounded-3xl bg-[#121214] ring-1 ring-white/10 shadow-xl transition-all hover:bg-[#18181B] hover:ring-white/20">
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                                        <feature.icon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-xl font-bold leading-7 text-white drop-shadow-sm">
                                        {feature.name}
                                    </h3>
                                    <p className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-400">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
