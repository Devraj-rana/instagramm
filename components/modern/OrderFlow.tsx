"use client";

import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Users,
  Heart,
  Eye,
  MessageSquare,
  CreditCard,
  Zap,
  Wallet,
  Plus
} from "lucide-react";
import {
  FaInstagram,
  FaWhatsapp,
  FaThreads,
  FaFacebookF,
  FaYoutube,
  FaTelegram,
  FaTiktok,
  FaXTwitter,
  FaSpotify
} from "react-icons/fa6";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: FaInstagram, color: "from-pink-500 via-purple-500 to-indigo-500" },
  { id: "whatsapp", name: "WhatsApp", icon: FaWhatsapp, color: "from-green-400 to-green-600" },
  { id: "threads", name: "Threads", icon: FaThreads, color: "from-zinc-900 to-zinc-700" },
  { id: "facebook", name: "Facebook", icon: FaFacebookF, color: "from-blue-600 to-blue-800" },
  { id: "youtube", name: "YouTube", icon: FaYoutube, color: "from-red-600 to-red-400" },
  { id: "telegram", name: "Telegram", icon: FaTelegram, color: "from-blue-400 to-cyan-500" },
  { id: "tiktok", name: "TikTok", icon: FaTiktok, color: "from-zinc-800 to-black" },
  { id: "twitter", name: "Twitter/X", icon: FaXTwitter, color: "from-blue-400 to-blue-600" },
  { id: "spotify", name: "Spotify", icon: FaSpotify, color: "from-green-500 to-emerald-600" },
];

const SERVICES = [
  { id: "followers", name: "Followers", icon: Users, pricePerUnit: 1.5 },
  { id: "likes", name: "Likes", icon: Heart, pricePerUnit: 0.8 },
  { id: "views", name: "Views", icon: Eye, pricePerUnit: 0.4 },
  { id: "comments", name: "Comments", icon: MessageSquare, pricePerUnit: 4.0 },
];

export default function OrderFlow() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    platform: "",
    service: "",
    quantity: 100,
    username: "",
  });

  const totalPrice = useMemo(() => {
    const service = SERVICES.find(s => s.id === selection.service);
    return service ? (service.pricePerUnit * selection.quantity).toFixed(2) : "0.00";
  }, [selection.service, selection.quantity]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            platform: selection.platform,
            service: selection.service,
            quantity: selection.quantity,
            target_username: selection.username,
            total_price: parseFloat(totalPrice),
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;
      
      setOrderId(data[0].id);
      setStep(6);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-20 px-6">
      <div className="relative bg-[#0F0F11] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-pink-500/5 pointer-events-none" />
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-pink-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
        {/* Wallet & Add Funds Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white/[0.02] border-b border-white/5 px-6 sm:px-10 py-5">
          <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Available Balance</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">₹0.00</span>
                <span className="text-sm text-zinc-500 font-medium">INR</span>
              </div>
            </div>
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 hover:scale-105 transition-all duration-300">
            <Plus className="h-4 w-4" />
            Add Funds
          </button>
        </div>
        <div className="p-8 sm:p-12 relative z-10">
          <AnimatePresence mode="wait">
            {/* ... (previous steps remain the same) */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-black text-white mb-2">Select Platform</h2>
                  <p className="text-zinc-400">Where do you want to grow your presence?</p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setSelection({ ...selection, platform: p.id }); handleNext(); }}
                      className={`group relative flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all duration-300 ${
                        selection.platform === p.id 
                        ? "bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105" 
                        : "bg-white/5 border-white/5 hover:border-white/15 hover:bg-white/[0.07]"
                      }`}
                    >
                      <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white shadow-lg shadow-black/40 group-hover:scale-110 transition-transform duration-300`}>
                        <p.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <span className="font-semibold text-xs sm:text-sm text-zinc-300 group-hover:text-white transition-colors">{p.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <button onClick={handleBack} className="text-zinc-500 hover:text-white flex items-center gap-2 mx-auto mb-4 text-sm font-bold">
                    <ArrowLeft className="h-4 w-4" /> Back to Platforms
                  </button>
                  <h2 className="text-3xl font-black text-white mb-2">Choose Service</h2>
                  <p className="text-zinc-400">What specific boost do you need?</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSelection({ ...selection, service: s.id }); handleNext(); }}
                      className={`group flex items-center gap-6 p-6 rounded-3xl border transition-all ${
                        selection.service === s.id 
                        ? "bg-white/10 border-white/20" 
                        : "bg-white/5 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:bg-indigo-500 transition-all">
                        <s.icon className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-white text-lg">{s.name}</h3>
                          <p className="text-zinc-500 text-sm">Starts at ₹{s.pricePerUnit}/unit</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <button onClick={handleBack} className="text-zinc-500 hover:text-white flex items-center gap-2 mx-auto mb-4 text-sm font-bold">
                    <ArrowLeft className="h-4 w-4" /> Back to Services
                  </button>
                  <h2 className="text-3xl font-black text-white mb-2">Select Quantity</h2>
                  <p className="text-zinc-400">How many {selection.service} would you like?</p>
                </div>
                
                <div className="max-w-md mx-auto space-y-8">
                  <div className="relative">
                    <input 
                      type="range" 
                      min="100" 
                      max="10000" 
                      step="100"
                      value={selection.quantity}
                      onChange={(e) => setSelection({...selection, quantity: parseInt(e.target.value)})}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-zinc-500 text-xs mt-4 font-bold">
                      <span>100</span>
                      <span>5,000</span>
                      <span>10,000</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-3xl p-8 text-center border border-white/5">
                    <span className="text-6xl font-black text-white block mb-2">{selection.quantity}</span>
                    <span className="text-zinc-500 uppercase tracking-widest font-black text-xs">{selection.service}</span>
                  </div>

                  <button 
                    onClick={handleNext}
                    className="w-full h-16 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-xl"
                  >
                    Continue <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <button onClick={handleBack} className="text-zinc-500 hover:text-white flex items-center gap-2 mx-auto mb-4 text-sm font-bold">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <h2 className="text-3xl font-black text-white mb-2">Target Account</h2>
                  <p className="text-zinc-400">Enter your {selection.platform} username</p>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                      <span className="text-zinc-500 text-2xl font-black group-focus-within:text-pink-500 transition-colors">@</span>
                    </div>
                    <input
                      type="text"
                      placeholder="username"
                      value={selection.username}
                      onChange={(e) => setSelection({...selection, username: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl h-16 pl-12 pr-6 text-xl text-white outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    />
                  </div>

                  <button 
                    disabled={!selection.username.trim()}
                    onClick={handleNext}
                    className="w-full h-16 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-xl disabled:opacity-50"
                  >
                    Review Order <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-black text-white mb-2">Order Summary</h2>
                  <p className="text-zinc-400">Review your dynamic growth package</p>
                </div>

                <div className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl max-w-md mx-auto">
                  <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center text-sm font-bold text-zinc-500 uppercase tracking-widest">
                      <span>Package Details</span>
                      <Zap className="h-4 w-4 text-amber-400" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Platform</span>
                        <span className="text-white font-bold capitalize">{selection.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Service</span>
                        <span className="text-white font-bold capitalize">{selection.service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Quantity</span>
                        <span className="text-white font-bold">{selection.quantity} Units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Target</span>
                        <span className="text-pink-400 font-bold">@{selection.username}</span>
                      </div>
                    </div>

                    <div className="h-[1px] bg-white/10" />

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-white">Total Amount</span>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
                          ₹{totalPrice}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-6 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-black text-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="h-6 w-6" /> Complete Order
                      </>
                    )}
                  </button>
                </div>

                <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white mx-auto block font-bold text-sm">
                  Cancel and restart
                </button>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-8"
              >
                <div className="relative mx-auto h-32 w-32 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full border-2 border-green-500"
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-white">Order Confirmed!</h2>
                  <p className="text-zinc-400 text-lg max-w-sm mx-auto">
                    Your growth package is being provisioned. Your order ID is <span className="text-indigo-400 font-mono">#{orderId?.slice(0, 8)}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-8 py-4 rounded-2xl bg-white text-black font-black hover:bg-zinc-200 transition-all"
                  >
                    Place Another Order
                  </button>
                  <button 
                    className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all"
                  >
                    Track Progress
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
