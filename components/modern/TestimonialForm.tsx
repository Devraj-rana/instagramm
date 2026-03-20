"use client";

import { useState } from "react";
import { Star, Loader2, MessageSquarePlus, Sparkles } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function TestimonialForm() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [body, setBody] = useState("");
    const [name, setName] = useState("");
    const [handle, setHandle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [success, setSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [suggestionCount, setSuggestionCount] = useState(0);
    const [previousSuggestions, setPreviousSuggestions] = useState<string[]>([]);

    const getErrorMessage = (error: unknown): string => {
        if (error && typeof error === "object") {
            const maybeMessage = (error as { message?: unknown }).message;
            if (typeof maybeMessage === "string" && maybeMessage.trim()) {
                return maybeMessage;
            }

            const maybeDetails = (error as { details?: unknown }).details;
            if (typeof maybeDetails === "string" && maybeDetails.trim()) {
                return maybeDetails;
            }
        }

        return "Failed to submit testimonial. Please try again.";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");
        setIsSubmitting(true);
        
        try {
            const { data: userData } = await supabase.auth.getUser();
            let savedAvatarUrl = "";

            if (userData.user?.id) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("avatar_url")
                    .eq("id", userData.user.id)
                    .maybeSingle();

                savedAvatarUrl = profile?.avatar_url ?? "";
            }

            const metadataAvatarUrl = userData.user?.user_metadata?.avatar_url as string | undefined;
            const fallbackDicebear = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

            const { error } = await supabase.from("testimonials").insert({
                user_id: userData.user?.id ?? null,
                body,
                author_name: name,
                author_handle: handle.startsWith("@") ? handle : `@${handle}`,
                author_image_url: savedAvatarUrl || metadataAvatarUrl || fallbackDicebear,
                rating,
            });

            if (error) throw error;
            
            setSuccess(true);
            router.refresh();
            
            setTimeout(() => {
                setIsOpen(false);
                setSuccess(false);
                setBody("");
                setName("");
                setHandle("");
                setRating(5);
                setSubmitError("");
            }, 3000);
        } catch (error) {
            setSubmitError(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGenerateSuggestion = async () => {
        setSubmitError("");
        setIsGenerating(true);
        const nextClickId = suggestionCount + 1;

        try {
            const response = await fetch("/api/testimonials/suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    handle,
                    rating,
                    clickId: nextClickId,
                    previousSuggestions,
                }),
            });

            const data: { success?: boolean; suggestion?: string; error?: string } = await response.json();

            if (!response.ok || !data.success || !data.suggestion) {
                throw new Error(data.error || "Could not generate suggestion");
            }

            setBody(data.suggestion);
            setSuggestionCount(nextClickId);
            setPreviousSuggestions((prev) => [...prev.slice(-5), data.suggestion!]);
        } catch (error) {
            setSubmitError(getErrorMessage(error));
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-16 mb-8 flex justify-center relative z-10"
            >
                <button 
                    onClick={() => setIsOpen(true)}
                    className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-full hover:bg-indigo-500 focus:outline-none hover:shadow-[0_0_40px_8px_rgba(99,102,241,0.4)] hover:-translate-y-1"
                >
                    <span className="absolute inset-0 w-full h-full rounded-full bg-linear-to-r from-cyan-400 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-300"></span>
                    <MessageSquarePlus className="w-5 h-5 mr-3" />
                    <span className="relative z-10">Share Your Experience</span>
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: -10 }}
            style={{ perspective: 1200 }}
            className="mt-16 mx-auto max-w-2xl relative z-10"
        >
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
            
            <div className="relative bg-[#0A0A0A]/80 backdrop-blur-2xl p-8 rounded-3xl ring-1 ring-white/20 shadow-[0_8px_40px_rgb(0,0,0,0.8)] overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
                
                <div className="relative z-10">
                    <h3 className="text-3xl font-display font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-400 mb-8">Write a Testimonial</h3>
                    
                    {success ? (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-8 rounded-2xl text-center shadow-inner"
                        >
                            <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                <Star className="w-8 h-8 fill-emerald-400 text-emerald-400" />
                            </div>
                            <p className="font-semibold text-xl">Thank you!</p>
                            <p className="text-zinc-400 mt-2">Your testimonial has been submitted and added to the board.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.button
                                            key={star}
                                            type="button"
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none"
                                        >
                                            <Star 
                                                className={`w-8 h-8 transition-colors duration-300 ${star <= rating ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" : "text-zinc-700 hover:text-zinc-500"}`} 
                                            />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-100 mb-2">Your Name</label>
                                    <Input
                                        required
                                        value={name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                        placeholder="Your full name"
                                        className="w-full bg-zinc-950/90 border-zinc-600/80 text-white placeholder:text-zinc-400 caret-white focus:border-indigo-400 focus-visible:ring-indigo-500/60"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-100 mb-2">Instagram Handle</label>
                                    <Input
                                        required
                                        value={handle}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHandle(e.target.value)}
                                        placeholder="@username"
                                        className="w-full bg-zinc-950/90 border-zinc-600/80 text-white placeholder:text-zinc-400 caret-white focus:border-indigo-400 focus-visible:ring-indigo-500/60"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">Your Experience</label>
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-xs text-zinc-400">Need help writing? Let AI draft it for you.</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleGenerateSuggestion}
                                        disabled={isGenerating}
                                        className="h-9 rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-3 text-indigo-200 hover:bg-indigo-500/20 hover:text-white"
                                    >
                                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        AI Suggest
                                    </Button>
                                </div>

                                {isGenerating && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-3 rounded-xl border border-indigo-400/30 bg-indigo-500/10 p-4"
                                    >
                                        <div className="flex items-center gap-2 text-indigo-200">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span className="text-sm font-medium">AI is writing your experience...</span>
                                        </div>
                                        <div className="mt-3 space-y-2">
                                            <motion.div
                                                className="h-2 w-full rounded-full bg-white/10"
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                            <motion.div
                                                className="h-2 w-5/6 rounded-full bg-white/10"
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ duration: 1.2, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                            <motion.div
                                                className="h-2 w-2/3 rounded-full bg-white/10"
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ duration: 1.2, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                <textarea
                                    required
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    onWheel={(e) => e.stopPropagation()}
                                    onTouchMove={(e) => e.stopPropagation()}
                                    disabled={isGenerating}
                                    placeholder={isGenerating ? "Generating AI suggestion..." : "How has Social Insight helped you?"}
                                    rows={4}
                                    className="w-full min-h-32 max-h-56 overflow-y-auto overscroll-contain bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y transition-all shadow-inner disabled:cursor-not-allowed disabled:opacity-70"
                                />
                            </div>

                            {submitError && (
                                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                                    {submitError}
                                </div>
                            )}

                            <div className="flex gap-4 pt-4 border-t border-white/10">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 bg-zinc-900/90 text-zinc-100 border-zinc-500/90 hover:bg-zinc-800 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="default"
                                    disabled={isSubmitting}
                                    className="flex-1 flex justify-center bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 border-0"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Testimonial"}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </motion.div>
    );
}