'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import ShowcaseSection from '@/components/sections/ShowcaseSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';

// Lazy load heavy client-side components
const CursorGlow = dynamic(() => import('@/components/CursorGlow'), { ssr: false });
const GrainOverlay = dynamic(() => import('@/components/ui/GrainOverlay'), { ssr: false });

/**
 * Main landing page — premium Instagram analytics experience.
 * Structure: Hero → Features → How It Works → Showcase → Testimonials → CTA → Footer
 */
export default function Home() {
  const handleCTAClick = () => {
    // Scroll to top or open analysis modal
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Global overlays */}
      <CursorGlow />
      <GrainOverlay />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="relative overflow-x-hidden">
        {/* Hero — Fullscreen 3D immersive experience */}
        <HeroSection onCTAClick={handleCTAClick} />

        {/* Section Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent max-w-4xl mx-auto" />

        {/* Features — Glassmorphism card grid */}
        <FeaturesSection />

        {/* Section Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent max-w-4xl mx-auto" />

        {/* How It Works — Step-by-step process */}
        <HowItWorksSection />

        {/* Section Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent max-w-4xl mx-auto" />

        {/* Showcase — 3D scroll-driven section with stats */}
        <ShowcaseSection />

        {/* Section Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent max-w-4xl mx-auto" />

        {/* Testimonials — Social proof and user reviews */}
        <TestimonialsSection />

        {/* Section Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent max-w-4xl mx-auto" />

        {/* Final CTA — Drive conversions */}
        <CTASection onCTAClick={handleCTAClick} />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
