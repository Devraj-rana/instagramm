"use client";

import { motion } from "framer-motion";
import { TrendingUp, Search } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F0F11] border border-white/10 shadow-lg overflow-hidden group/logo">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover/logo:opacity-100 transition-opacity" />

        {/* Magnifying Glass & Trend Line (Custom SVG) */}
        <svg viewBox="0 0 100 100" className="h-7 w-7 relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Magnifying Glass Ring */}
          <circle cx="45" cy="45" r="30" stroke="currentColor" strokeWidth="8" className="text-white" />
          {/* Magnifying Glass Handle */}
          <path d="M68 68L85 85" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-white" />
          {/* Trend Line Arrow */}
          <path d="M25 55L45 35L60 45L85 20" stroke="url(#logo-gradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M70 20H85V35" stroke="url(#logo-gradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

          <defs>
            <linearGradient id="logo-gradient" x1="25" y1="55" x2="85" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="0.5" stopColor="#a855f7" />
              <stop offset="1" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Name */}
      {showText && (
        <span className="font-display text-xl font-black tracking-tighter text-white">
          Social Insight<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">.Tech</span>
        </span>
      )}
    </div>
  );
}
