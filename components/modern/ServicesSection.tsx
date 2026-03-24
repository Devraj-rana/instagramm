"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Globe } from "lucide-react";
import OrderFlow from "./OrderFlow";

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-32 overflow-hidden bg-[#0A0A0A]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none translate-y-[-50%]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-bold tracking-widest uppercase text-indigo-300">New Service Model</span>
          </motion.div>
          
          <h2 className="font-display text-5xl sm:text-6xl font-black tracking-tighter text-white mb-6">
            Everything you need to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">Accelerate Growth.</span>
          </h2>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto font-medium">
            Select your platform, pick a service, and watch your numbers climb. Real results, powered by our premium network.
          </p>
        </div>

        {/* Feature Highlights before the Order Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          {[
            { icon: Zap, title: "Instant Start", desc: "Processing begins in minutes", color: "text-amber-400" },
            { icon: Shield, title: "100% Secure", desc: "No password required ever", color: "text-blue-400" },
            { icon: Globe, title: "Global Reach", desc: "High quality global network", color: "text-emerald-400" },
            { icon: Sparkles, title: "Refill Guarantee", desc: "30-day drop protection", color: "text-purple-400" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center group hover:bg-white/10 transition-all"
            >
              <div className={`mx-auto h-12 w-12 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center mb-4 ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-white font-bold mb-1">{item.title}</h3>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* The Core Order Flow Integration */}
        <div id="order-start">
            <OrderFlow />
        </div>
      </div>
    </section>
  );
}
