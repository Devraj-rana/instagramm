import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import TestimonialForm from "@/components/modern/TestimonialForm";
import TestimonialsGrid from "@/components/modern/TestimonialsGrid";
import Testimonials3DBackground from "@/components/modern/Testimonials3DBackground";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Cache for 60 seconds

type DbTestimonialRow = {
    id: string;
    user_id: string | null;
    body: string;
    author_name: string;
    author_handle: string;
    author_image_url: string;
    rating: number | null;
};

export default async function TestimonialsPage() {
    const { data: dbTestimonials } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

    const testimonials = ((dbTestimonials ?? []) as DbTestimonialRow[]).map((t) => ({
            id: t.id,
            userId: t.user_id,
            body: t.body,
            author: { name: t.author_name, handle: t.author_handle, imageUrl: t.author_image_url },
            rating: t.rating || 5
        }));

    return (
        <div className="flex min-h-screen flex-col bg-[#0A0A0A] selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden relative">
            <Testimonials3DBackground />

            {/* Content Container (Ensure it stacks above absolute elements) */}
            <div className="relative z-10 w-full flex-1 flex flex-col">
                <Header />
                <main className="flex-1 pb-24 pt-32 sm:pt-40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-display font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-sm">
                            Loved by <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-indigo-400">creators</span> worldwide.
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-zinc-400">
                            See what top creators and agencies are saying about the insights they&apos;ve gained using Social Insight.
                        </p>
                    </div>
                    
                    <TestimonialForm />

                    <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                        {testimonials.length > 0 ? (
                            <TestimonialsGrid testimonials={testimonials} />
                        ) : (
                            <div className="rounded-3xl border border-white/10 bg-[#0f0f12]/70 p-10 text-center text-zinc-300 backdrop-blur-md">
                                <p className="text-lg font-semibold text-white">No testimonials yet</p>
                                <p className="mt-2 text-sm text-zinc-400">Be the first to share your experience.</p>
                            </div>
                        )}
                    </div>
                </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
