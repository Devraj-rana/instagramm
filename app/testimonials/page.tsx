import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import { Star } from "lucide-react";

const testimonials = [
    {
        body: "Social Insight completely changed how I approach brand deals. Being able to instantly generate an audit of my engagement rate vs my competitors gave me the leverage to double my sponsored post rates.",
        author: {
            name: "Sarah Chen",
            handle: "@sarah.explores",
            imageUrl:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        body: "The shadowban detection feature alone is worth its weight in gold. We realized an entire batch of our latest posts were algorithmically crushed. We adjusted our hashtag strategy and immediately surged back up.",
        author: {
            name: "Marcus Thorne",
            handle: "@thornestudios",
            imageUrl:
                "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        body: "Before using this tool, our agency spent hours manually calculating engagement across clients. Now, we just drop the handle in here and export the exact metrics our clients care about. It's magic.",
        author: {
            name: "Elena Rodriguez",
            handle: "@elena.digital",
            imageUrl:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        body: "I was skeptical about AI analyzing my profile, but the 'Actionable Improvements' it suggested were actually highly specific. It told me to stop using ghost followers, which I didn't even realize I had.",
        author: {
            name: "David Kim",
            handle: "@davidkimsnaps",
            imageUrl:
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        body: "The UI is just stunning. A lot of analytics tools look like spreadsheets from 1999. Social Insight is gorgeous, lightning-fast, and doesn't make me want to rip my hair out while looking at data.",
        author: {
            name: "Chloe Jenkins",
            handle: "@chloedesigns",
            imageUrl:
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        body: "Best investment I've made for my creator business. It accurately predicted my last viral ceiling and helped me prepare my content calendar to match the exact moment my audience was online.",
        author: {
            name: "Alex Vance",
            handle: "@vancetravel",
            imageUrl:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
]

export default function TestimonialsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[#0A0A0A] selection:bg-indigo-500/30 selection:text-indigo-200">
            <Header />
            <main className="flex-1 relative pb-24 pt-32 sm:pt-40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-display font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-sm">
                            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">creators</span> worldwide.
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-zinc-400">
                            See what top creators and agencies are saying about the insights they've gained using Social Insight.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                        <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.author.handle} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                                    <figure className="rounded-2xl bg-[#121214] p-8 text-sm leading-6 ring-1 ring-white/10 shadow-lg transition-all hover:-translate-y-1 hover:shadow-indigo-500/10 hover:ring-white/20">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <blockquote className="text-zinc-300">
                                            <p>{`"${testimonial.body}"`}</p>
                                        </blockquote>
                                        <figcaption className="mt-6 flex items-center gap-x-4">
                                            <img className="h-10 w-10 rounded-full border border-white/20 bg-zinc-800" src={testimonial.author.imageUrl} alt="" />
                                            <div>
                                                <div className="font-semibold text-white">{testimonial.author.name}</div>
                                                <div className="text-indigo-400">{testimonial.author.handle}</div>
                                            </div>
                                        </figcaption>
                                    </figure>
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
