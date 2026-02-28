'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium glassmorphism navbar — mobile-optimized:
 * - Hamburger menu on mobile
 * - Slide-down mobile nav panel
 * - Scroll-aware background
 * - Responsive sizing
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`
          fixed top-0 left-0 right-0 z-100
          transition-all duration-500 ease-out
          ${scrolled || mobileOpen
            ? 'bg-[rgba(0,0,0,0.88)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]'
            : 'bg-transparent border-b border-transparent'
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-modern rounded-lg blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-gradient-instagram flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-bold">IG</span>
              </div>
            </div>
            <span className="text-white font-semibold text-base sm:text-lg tracking-tight">
              Analyzer
            </span>
          </motion.div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Pricing'].map((link) => (
              <motion.a
                key={link}
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors duration-300 relative group"
                whileHover={{ y: -1 }}
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-modern group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden sm:block relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium text-white
                         bg-gradient-modern
                         hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]
                         transition-shadow duration-300 cursor-pointer"
            >
              Get Started
            </motion.button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 -mr-2 cursor-pointer"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-5 h-[1.5px] bg-white block origin-center transition-colors"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 h-[1.5px] bg-white block"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-5 h-[1.5px] bg-white block origin-center transition-colors"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-13 left-0 right-0 z-99 md:hidden
                       bg-[rgba(9,9,11,0.95)] backdrop-blur-2xl
                       border-b border-[rgba(255,255,255,0.04)]"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {['Features', 'How it Works', 'Pricing'].map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-sm text-gray-300 hover:text-white transition-colors border-b border-[rgba(255,255,255,0.03)] last:border-0"
                >
                  {link}
                </a>
              ))}
              <button
                className="mt-2 w-full py-3 rounded-lg text-sm font-medium text-white
                           bg-gradient-modern
                           cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
