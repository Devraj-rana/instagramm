"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Check, Loader2, Pencil, Star, Trash2, X } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

type CardTestimonial = {
    id?: string;
    body: string;
    rating: number;
    author: {
        name: string;
        handle: string;
        imageUrl: string;
    };
};

export default function TestimonialCard({ 
    testimonial, 
    index,
    isOwner = false,
    onSaveEdit,
    onDelete,
}: { 
    testimonial: CardTestimonial;
    index: number;
    isOwner?: boolean;
    onSaveEdit?: (id: string, nextBody: string) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [draftBody, setDraftBody] = useState(testimonial.body);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState("");

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Smooth, snappy spring for tilt
    const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });
    
    const rotateX = useMotionTemplate`${mouseYSpring}deg`;
    const rotateY = useMotionTemplate`${mouseXSpring}deg`;
    const spotlightBackground = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.15), transparent 80%)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mX = e.clientX - rect.left;
        const mY = e.clientY - rect.top;
        
        // Tilt calculations
        const rX = ((mY / height) - 0.5) * -20; // 20 deg max tilt
        const rY = ((mX / width) - 0.5) * 20;
        
        x.set(rY);
        y.set(rX);
        mouseX.set(mX);
        mouseY.set(mY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const isSvgAvatar = testimonial.author.imageUrl.includes(".svg") || testimonial.author.imageUrl.includes("dicebear.com");

    const handleSave = async () => {
        if (!testimonial.id || !onSaveEdit) {
            return;
        }

        const trimmed = draftBody.trim();
        if (!trimmed) {
            setActionError("Message cannot be empty.");
            return;
        }

        setActionError("");
        setIsSaving(true);

        try {
            await onSaveEdit(testimonial.id, trimmed);
            setIsEditing(false);
        } catch (error) {
            setActionError(error instanceof Error ? error.message : "Failed to update testimonial.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemove = async () => {
        if (!testimonial.id || !onDelete) {
            return;
        }

        setActionError("");
        setIsDeleting(true);

        try {
            await onDelete(testimonial.id);
        } catch (error) {
            setActionError(error instanceof Error ? error.message : "Failed to delete testimonial.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="pt-8 sm:inline-block sm:w-full sm:px-4" style={{ perspective: 1500 }}>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: (index % 3) * 0.15, type: "spring", stiffness: 100 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 text-sm leading-6 ring-1 ring-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-indigo-500/20 group cursor-pointer overflow-hidden"
            >
                {/* 3D dynamic glowing spotlight */}
                <motion.div 
                    className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                    style={{ background: spotlightBackground }}
                />

                {/* Content wrapper translated slightly off the card for a 3D pop effect */}
                <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
                    <div className="flex gap-1 mb-6">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + i * 0.1 + 0.3 }}
                            >
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
                            </motion.div>
                        ))}
                    </div>

                    {isOwner && (
                        <div className="mb-4 flex items-center justify-end gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-60"
                                    >
                                        {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setDraftBody(testimonial.body);
                                            setActionError("");
                                        }}
                                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-500/50 bg-zinc-900/70 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800"
                                    >
                                        <X className="h-3 w-3" />
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-2 py-1 text-xs text-indigo-200 hover:bg-indigo-500/20"
                                    >
                                        <Pencil className="h-3 w-3" />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        disabled={isDeleting}
                                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/20 disabled:opacity-60"
                                    >
                                        {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    
                    <blockquote className="text-zinc-200 text-base leading-relaxed min-h-20">
                        {isEditing ? (
                            <textarea
                                value={draftBody}
                                onChange={(e) => setDraftBody(e.target.value)}
                                onWheel={(e) => e.stopPropagation()}
                                onTouchMove={(e) => e.stopPropagation()}
                                rows={4}
                                className="w-full min-h-24 max-h-56 overflow-y-auto overscroll-contain resize-y rounded-xl border border-indigo-400/30 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        ) : (
                            <p>{`"${testimonial.body}"`}</p>
                        )}
                    </blockquote>

                    {actionError && <p className="mt-3 text-xs text-rose-300">{actionError}</p>}
                    
                    <figcaption className="mt-8 flex items-center gap-x-4 border-t border-white/5 pt-6">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-linear-to-r from-cyan-400 to-indigo-500 rounded-full blur-[6px] opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
                            <div className="relative h-12 w-12 rounded-full border-2 border-indigo-500/30 bg-zinc-800 overflow-hidden">
                                <Image src={testimonial.author.imageUrl} alt={testimonial.author.name} fill className="object-cover" unoptimized={isSvgAvatar} />
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold text-white text-base drop-shadow-md">{testimonial.author.name}</div>
                            <div className="text-indigo-400 font-medium text-sm drop-shadow-sm">{testimonial.author.handle}</div>
                        </div>
                    </figcaption>
                </div>
            </motion.div>
        </div>
    );
}
