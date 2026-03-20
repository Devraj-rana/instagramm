"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import TestimonialCard from "./TestimonialCard";

type Testimonial = {
    id?: string;
    userId?: string | null;
    body: string;
    rating: number;
    author: {
        name: string;
        handle: string;
        imageUrl: string;
    };
};

export default function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
    const [items, setItems] = useState(testimonials);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        setItems(testimonials);
    }, [testimonials]);

    useEffect(() => {
        const loadUser = async () => {
            const { data } = await supabase.auth.getUser();
            setCurrentUserId(data.user?.id ?? null);
        };

        loadUser();
    }, []);

    const testimonialsWithOwner = useMemo(
        () =>
            items.map((t) => ({
                ...t,
                isOwner: Boolean(t.id && currentUserId && t.userId === currentUserId),
            })),
        [items, currentUserId]
    );

    const handleSaveEdit = async (id: string, nextBody: string) => {
        const { error } = await supabase.from("testimonials").update({ body: nextBody }).eq("id", id);
        if (error) {
            throw new Error(error.message || "Failed to update testimonial");
        }

        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, body: nextBody } : item)));
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from("testimonials").delete().eq("id", id);
        if (error) {
            throw new Error(error.message || "Failed to delete testimonial");
        }

        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
            {testimonialsWithOwner.map((testimonial, index) => (
                <TestimonialCard
                    key={testimonial.id || `${testimonial.author.handle}-${index}`}
                    testimonial={testimonial}
                    index={index}
                    isOwner={testimonial.isOwner}
                    onSaveEdit={testimonial.id ? handleSaveEdit : undefined}
                    onDelete={testimonial.id ? handleDelete : undefined}
                />
            ))}
        </div>
    );
}
