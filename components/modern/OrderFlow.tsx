"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Users,
  Heart,
  Eye,
  MessageSquare,
  CreditCard,
  Zap,
  Wallet,
  Plus,
  ChevronRight,
  ChevronDown,
  Search,
  Loader2,
  Info,
  Instagram,
  Youtube,
  Music,
  Facebook,
  Twitter,
  Send,
  Linkedin,
  Disc,
  AtSign,
  Play,
  Twitch,
  Music2,
  Share2,
  ShieldCheck,
  Globe,
  RefreshCw
} from "lucide-react";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", logo: "instagram", color: "from-pink-500 to-orange-500" },
  { id: "youtube", name: "YouTube", logo: "youtube", color: "from-red-600 to-red-500" },
  { id: "tiktok", name: "TikTok", logo: "tiktok", color: "from-zinc-800 to-zinc-900" },
  { id: "facebook", name: "Facebook", logo: "facebook", color: "from-blue-600 to-blue-500" },
  { id: "twitter", name: "Twitter / X", logo: "x", color: "from-zinc-800 to-zinc-900" },
  { id: "telegram", name: "Telegram", logo: "telegram", color: "from-sky-400 to-sky-300" },
  { id: "linkedin", name: "LinkedIn", logo: "linkedin", color: "from-blue-700 to-blue-600" },
  { id: "spotify", name: "Spotify", logo: "spotify", color: "from-green-500 to-green-400" },
  { id: "twitch", name: "Twitch", logo: "twitch", color: "from-purple-600 to-purple-500" },
  { id: "discord", name: "Discord", logo: "discord", color: "from-indigo-600 to-indigo-500" },
  { id: "reddit", name: "Reddit", logo: "reddit", color: "from-orange-600 to-orange-500" },
  { id: "soundcloud", name: "SoundCloud", logo: "soundcloud", color: "from-orange-500 to-orange-400" },
  { id: "threads", name: "Threads", logo: "threads", color: "from-zinc-100 to-zinc-400" },
];

/** 
 * PROFESSIONAL SERVICE DEFINITIONS
 */
const SERVICES = [
  {
    id: "followers",
    id_num: "1024",
    name: "Followers | High Quality | 400K-500K/Day",
    category: "Followers",
    icon: Users,
    pricePerUnit: 0.15,
    platform: "instagram",
    description: `✨Service Grade - Ⓐ+ Grade\n✨No Overload Issue\n✨Working very smooth\n✨Discount Available For APis\n\n➕Addition Information\n\nStart - 0 -1 Minutes\n\nSpeed After Start - 400K - 500K/Day\n\nQuality - Very High\n\nDrop - No Drop Issue\n\nRefill - Lifetime\n\nCancel - Button Working\n\nLink - Profile Link\n\nCorrect Format - https://www.instagram.com/your_username/\n\nSpecial Note: Account should be public. Please do not change your username during the process.`
  },
  {
    id: "likes",
    id_num: "2055",
    name: "Likes | Real & Fast | Instant",
    category: "Likes",
    icon: Heart,
    pricePerUnit: 0.08,
    platform: "instagram",
    description: `✨Service Grade - Ⓐ\n✨Instant Start\n✨High Quality Accounts\n✨Non Drop\n\nLink - Post Link`
  },
  {
    id: "views",
    id_num: "1167",
    name: "Views | Instant Complete | 10Million/Day",
    category: "Views",
    icon: Eye,
    pricePerUnit: 0.001,
    platform: "instagram",
    description: `🔴Read Description before order\n\n📈Service Grade - Ⓐ+\n✨Use If You wants Instant Views\n✨Cancel button working in this service\n✨This Service Always Works\n\n➕Addition Information\n\nStart - in one Click\n\nSpeed After Start - Approx 10 Million/Day\n\nDrop Ratio - Non Drop\n\nRefill - Possible if less deliver\n\nCancel - Available\n\nLink - Reel Link`
  },
  {
    id: "views_premium",
    id_num: "1406",
    name: "Views | Premium | Best for Big Orders",
    category: "Views",
    icon: Eye,
    pricePerUnit: 0.002,
    platform: "instagram",
    description: `📈Service Grade - A+\n✨Best for Big Orders\n✨Mostly Instant Start\n✨Cancel Button Working\n✨ Instant Support Available\n\n➕Addition Information\n\nStart - Instantly Normally\n\nSpeed After Start - Approx 1Million/Day\n\nDrop Ratio - Non Drop\n\nRefill - Possible if less deliver\n\nCancel - Possible\n\nLink - Reel Link`
  },
  {
    id: "comments",
    id_num: "3012",
    name: "Comments | Custom Text | High Grade",
    category: "Comments",
    icon: MessageSquare,
    pricePerUnit: 4.0,
    platform: "instagram",
    description: `✨Custom Comments\n✨High Quality Profiles\n✨Instant Start`
  },
];

export default function OrderFlow() {
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [walletBalance, setWalletBalance] = useState(0);

  const [selection, setSelection] = useState({
    platform: "instagram",
    category: "",
    serviceId: "",
    quantity: 100,
    username: "",
  });

  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [platformSearch, setPlatformSearch] = useState("");
  const [catSearch, setCatSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  const filteredPlatforms = useMemo(() => 
    PLATFORMS.filter(p => p.name.toLowerCase().includes(platformSearch.toLowerCase())), 
    [platformSearch]
  );

  const selectedPlatformData = useMemo(() => 
    PLATFORMS.find(p => p.id === selection.platform), 
    [selection.platform]
  );

  const categories = useMemo(() => {
    return Array.from(new Set(
      SERVICES
        .filter(s => s.platform === selection.platform)
        .map(s => s.category)
    ));
  }, [selection.platform]);

  const filteredCategories = categories.filter(c => c.toLowerCase().includes(catSearch.toLowerCase()));

  const selectedService = useMemo(() => SERVICES.find(s => s.id === selection.serviceId), [selection.serviceId]);
  const availableServices = useMemo(() => {
    return SERVICES.filter(s => 
      s.category === selection.category && 
      s.platform === selection.platform
    );
  }, [selection.category, selection.platform]);
  const filteredServices = availableServices.filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase()));

  const totalPrice = useMemo(() => {
    return selectedService ? (selectedService.pricePerUnit * selection.quantity).toFixed(2) : "0.00";
  }, [selectedService, selection.quantity]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<string>("50");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const loadWalletBalance = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("wallet_balance")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError || !profile) return userData.user.id;

    setWalletBalance(Number(profile.wallet_balance ?? 0));
    return userData.user.id;
  };

  useEffect(() => {
    void loadWalletBalance();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        alert("You must be logged in to place an order.");
        setIsSubmitting(false);
        return;
      }
      const userId = userData.user.id;
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", userId)
        .maybeSingle();

      if (profileError || !profile) {
        alert("Could not fetch wallet balance.");
        setIsSubmitting(false);
        return;
      }

      const balance = parseFloat(profile.wallet_balance);
      const price = parseFloat(totalPrice);
      if (balance < price) {
        alert("Insufficient wallet balance.");
        setIsSubmitting(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ wallet_balance: balance - price })
        .eq("id", userId);

      if (updateError) throw updateError;

      setWalletBalance(Number((balance - price).toFixed(2)));

      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            platform: selection.platform,
            service: selection.serviceId,
            quantity: selection.quantity,
            target_username: selection.username,
            total_price: price,
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;
      setOrderId(data[0].id);

      // Financial Log
      await supabase
        .from("wallet_transactions")
        .insert({
          user_id: userId,
          amount: price,
          type: "debit",
          description: `${selection.serviceId} for ${selection.platform}`,
          metadata: { order_id: data[0].id, target: selection.username, quantity: selection.quantity }
        });

      setStep(2);
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to submit order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeAddFunds = async () => {
    let amountStr = topUpAmount.trim();
    if (!amountStr) return;
    const amount = Math.floor(Number(amountStr));
    if (isNaN(amount) || amount < 10) return alert("Min. ₹10");

    setIsProcessingPayment(true);
    try {
      const userId = await loadWalletBalance();
      if (!userId) {
        setIsProcessingPayment(false);
        return;
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "SMM Dashboard",
        description: "Wallet Top-up",
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              userId,
            }),
          });
          const result = await verifyRes.json();
          if (result.success) {
            await loadWalletBalance();
            setIsTopUpModalOpen(false);
            alert("Funds added!");
          }
          setIsProcessingPayment(false);
        },
        modal: { ondismiss: () => setIsProcessingPayment(false) },
        theme: { color: "#4f46e5" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-20 px-6 relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Top Up Modal */}
      <AnimatePresence>
        {isTopUpModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTopUpModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 overflow-hidden"
            >
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto">
                  <Wallet className="h-8 w-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase italic">Add Funds</h2>
                <input
                  type="text"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-2xl font-black text-white text-center outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="0"
                />
                <button
                  onClick={executeAddFunds}
                  disabled={isProcessingPayment || !topUpAmount || Number(topUpAmount) < 10}
                  className="w-full h-16 rounded-2xl bg-white text-black font-black uppercase hover:bg-zinc-200 transition-all disabled:opacity-20"
                >
                  {isProcessingPayment ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : "Proceed to Payment"}
                </button>
                <button onClick={() => setIsTopUpModalOpen(false)} className="text-zinc-500 text-xs font-black uppercase hover:text-white">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Dashboard UI */}
      <div className="bg-[#0F0F11] border border-white/10 rounded-[3rem] shadow-2xl relative">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white/[0.02] border-b border-white/5 px-8 sm:px-12 py-8 gap-6">
          <div className="flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic uppercase">New Order</h1>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Efficiency Dashboard v2.0</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-none mb-1">Balance</p>
              <p className="text-2xl font-black text-white">₹{walletBalance.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="h-12 w-12 rounded-xl bg-white text-black flex items-center justify-center hover:scale-105 transition-all"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3 space-y-10">
                  {/* Platform Selection Dropdown */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Growth Platform</label>
                    <div className="relative">
                      <button
                        onClick={() => {
                          setIsPlatformOpen(!isPlatformOpen);
                          setIsCategoryOpen(false);
                          setIsServiceOpen(false);
                        }}
                        className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between text-white hover:bg-white/[0.08] transition-all"
                      >
                        <div className="flex items-center gap-4">
                          {selectedPlatformData && (
                            <div className={`h-8 w-8 rounded-lg bg-linear-to-br ${selectedPlatformData.color} flex items-center justify-center p-1.5`}>
                              <img 
                                src={`https://cdn.simpleicons.org/${selectedPlatformData.logo}/white`} 
                                className="h-full w-full object-contain" 
                                alt={selectedPlatformData.name}
                              />
                            </div>
                          )}
                          <span className="font-black text-lg">{selectedPlatformData?.name || "Select Platform..."}</span>
                        </div>
                        <ChevronDown className={`h-6 w-6 text-zinc-600 transition-transform ${isPlatformOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isPlatformOpen && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-[#111114] border border-white/10 rounded-2xl z-[60] shadow-2xl overflow-hidden">
                          <div className="p-4 border-b border-white/5 bg-white/2">
                            <div className="relative">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                              <input 
                                autoFocus
                                value={platformSearch}
                                onChange={(e) => setPlatformSearch(e.target.value)}
                                placeholder="Search platform..."
                                className="w-full bg-black/40 border-none rounded-xl h-12 pl-12 pr-4 text-sm text-white outline-none"
                              />
                            </div>
                          </div>
                          <div className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                            {filteredPlatforms.map(p => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  setSelection({ ...selection, platform: p.id, category: "", serviceId: "" });
                                  setIsPlatformOpen(false);
                                  setPlatformSearch("");
                                }}
                                className="w-full text-left px-5 py-4 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all group flex items-center justify-between"
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`h-8 w-8 rounded-lg bg-linear-to-br ${p.color} flex items-center justify-center p-1.5 opacity-70 group-hover:opacity-100 transition-opacity`}>
                                    <img 
                                      src={`https://cdn.simpleicons.org/${p.logo}/white`} 
                                      className="h-full w-full object-contain" 
                                      alt={p.name}
                                    />
                                  </div>
                                  <span className="text-sm font-black uppercase tracking-tight">{p.name}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-3 group-hover:translate-x-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Category</label>
                    <div className="relative">
                      <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between text-white font-black text-lg">
                        {selection.category || "Select Category"}
                        <ChevronDown className={`h-5 w-5 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isCategoryOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111114] border border-white/10 rounded-2xl p-2 z-[55] shadow-2xl overflow-hidden">
                          {categories.map(cat => (
                            <button key={cat} onClick={() => { setSelection({ ...selection, category: cat, serviceId: "" }); setIsCategoryOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white font-black uppercase text-xs">
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`space-y-4 transition-all ${!selection.category ? "opacity-20" : "opacity-100"}`}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Service Package</label>
                    <div className="relative">
                      <button onClick={() => setIsServiceOpen(!isServiceOpen)} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between text-white font-black">
                        <span className="truncate">{selectedService ? `${selectedService.id_num} - ${selectedService.name}` : "Pick Package"}</span>
                        <ChevronDown className={`h-5 w-5 transition-transform ${isServiceOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isServiceOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111114] border border-white/10 rounded-2xl p-2 z-50 max-h-60 overflow-y-auto custom-scrollbar shadow-2xl">
                          {availableServices.map(s => (
                            <button key={s.id} onClick={() => { setSelection({ ...selection, serviceId: s.id }); setIsServiceOpen(false); }} className="w-full text-left px-4 py-4 rounded-xl hover:bg-white/5 group">
                              <div className="flex justify-between items-center">
                                <span className="text-white font-black uppercase text-xs">#{s.id_num} - {s.name}</span>
                                <span className="text-indigo-400 font-black text-[10px]">₹{(s.pricePerUnit * 1000).toFixed(2)} /k</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 transition-all ${!selectedService ? "opacity-20" : "opacity-100"}`}>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Quantity</label>
                      <input type="number" value={selection.quantity} onChange={(e) => setSelection({ ...selection, quantity: parseInt(e.target.value) || 0 })} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-black text-xl outline-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Target Username/Link</label>
                      <input type="text" value={selection.username} onChange={(e) => setSelection({ ...selection, username: e.target.value })} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-black outline-none" placeholder="Enter link..." />
                    </div>
                  </div>

                  {selectedService && (
                    <div className="bg-linear-to-r from-indigo-500/10 to-pink-500/10 rounded-3xl p-8 border border-white/10 flex justify-between items-center mt-10">
                      <div>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Payable</p>
                        <p className="text-4xl font-black text-white italic">₹{totalPrice}</p>
                      </div>
                      <button onClick={handleSubmit} disabled={isSubmitting || !selection.username} className="px-12 h-16 rounded-2xl bg-white text-black font-black uppercase hover:scale-105 transition-all disabled:opacity-20 shadow-xl shadow-white/10">
                        {isSubmitting ? "Processing..." : "Place Order"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 h-full min-h-[400px]">
                    <div className="flex items-center gap-3 mb-8">
                      <Info className="h-5 w-5 text-indigo-400" />
                      <h3 className="text-xs font-black text-white uppercase tracking-widest">Instance Details</h3>
                    </div>
                    <div className="text-[11px] leading-relaxed text-zinc-500 font-bold uppercase tracking-widest whitespace-pre-wrap">
                      {selectedService ? selectedService.description : "Initialize a package to view specs"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-20 space-y-10">
                <div className="mx-auto h-32 w-32 rounded-3xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                   <CheckCircle2 className="h-16 w-16 text-white" />
                </div>
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Order Established</h2>
                <div className="flex gap-6 justify-center">
                  <button onClick={() => { setStep(1); setSelection({ ...selection, serviceId: "", username: "" }); }} className="px-10 h-14 rounded-xl bg-white text-black font-black uppercase">Another Order</button>
                  <a href="/account" className="px-10 h-14 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center font-black uppercase">Dashboard</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features / Trust Section */}
        <div className="bg-white/[0.01] border-t border-white/5 p-8 sm:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10 group-hover:scale-110 transition-transform">
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Instant Start</h4>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider leading-relaxed">Processing begins in minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/10 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-5 w-5 text-pink-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">100% Secure</h4>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider leading-relaxed">No password required ever</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/10 group-hover:scale-110 transition-transform">
                <Globe className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Global Reach</h4>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider leading-relaxed">High quality global network</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/10 group-hover:scale-110 transition-transform">
                <RefreshCw className="h-5 w-5 text-green-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Refill Guarantee</h4>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider leading-relaxed">30-day drop protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
