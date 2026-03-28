"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  BadgeDollarSign,
  CreditCard,
  MessageSquareQuote,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  UserRound,
  Wallet,
  Zap,
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

type DashboardResponse = {
  stats: {
    totalUsers: number;
    totalOrders: number;
    pendingOrders: number;
    totalTestimonials: number;
    totalRevenue: number;
    totalWalletBalance: number;
  };
  profiles: Array<{
    id: string;
    full_name: string | null;
    username: string | null;
    website: string | null;
    wallet_balance: number | string | null;
    updated_at: string | null;
    status: string;
  }>;
  orders: Array<{
    id: string;
    created_at: string;
    user_id: string | null;
    platform: string;
    service: string;
    quantity: number;
    target_username: string;
    status: string;
    total_price: number | string;
  }>;
  testimonials: Array<{
    id: string;
    created_at: string;
    user_id: string | null;
    body: string;
    author_name: string;
    author_handle: string;
    author_image_url: string;
    rating: number;
  }>;
  supportInboxMode: string;
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

// Premium 3D Tilt Card Container
function TiltCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), { stiffness: 400, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), { stiffness: 400, damping: 30 });
  
  const glareX = useSpring(useTransform(x, [0, 1], [100, 0]), { stiffness: 300, damping: 30 });
  const glareY = useSpring(useTransform(y, [0, 1], [100, 0]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group ${className}`}
    >
      {/* Interactive Glare Overlay */}
      <motion.div 
        className="absolute inset-0 z-50 pointer-events-none rounded-inherit mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-500"
        style={{
          background: useTransform(
              [glareX, glareY], 
              ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
          )
        }}
      />
      <div 
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} 
        className="w-full h-full relative"
      >
        {children}
      </div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, rotateX: 10 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [savedKeyLoaded, setSavedKeyLoaded] = useState(false);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("admin-dashboard-key");
    if (stored) {
      setAdminKey(stored);
    }
    setSavedKeyLoaded(true);
  }, []);

  const fetchDashboard = async (keyOverride?: string) => {
    const key = keyOverride ?? adminKey;
    if (!key) {
      setError("Enter your admin key to load the dashboard.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/dashboard?t=${Date.now()}`, {
        headers: { "x-admin-key": key },
        cache: "no-store",
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to load admin dashboard.");
      }

      window.localStorage.setItem("admin-dashboard-key", key);
      setData(json.data);
    } catch (nextError) {
      setData(null);
      setError(nextError instanceof Error ? nextError.message : "Failed to load admin dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (savedKeyLoaded && adminKey) {
      void fetchDashboard(adminKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedKeyLoaded]);

  const stats = useMemo(() => {
    if (!data) return [];
    return [
      { label: "Users", value: String(data.stats.totalUsers), icon: UserRound, color: "text-blue-400" },
      { label: "Orders", value: String(data.stats.totalOrders), icon: CreditCard, color: "text-emerald-400" },
      { label: "Pending", value: String(data.stats.pendingOrders), icon: ShieldCheck, color: "text-rose-400" },
      { label: "Revenue", value: currency.format(data.stats.totalRevenue), icon: BadgeDollarSign, color: "text-amber-400" },
      { label: "Wallet Total", value: currency.format(data.stats.totalWalletBalance), icon: Wallet, color: "text-purple-400" },
      { label: "Testimonials", value: String(data.stats.totalTestimonials), icon: MessageSquareQuote, color: "text-cyan-400" },
    ];
  }, [data]);

  const runAction = async (actionId: string, fn: () => Promise<void>) => {
    setActiveAction(actionId);
    setError(null);
    try {
      await fn();
      await fetchDashboard();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Admin action failed.");
    } finally {
      setActiveAction(null);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await runAction(`order-${orderId}`, async () => {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ status }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to update order status.");
      }
    });
  };

  const updateWalletBalance = async (profileId: string, currentBalance: number | string | null) => {
    const next = window.prompt("Enter the new wallet balance in INR:", String(Number(currentBalance ?? 0)));
    if (next === null) return;

    await runAction(`profile-${profileId}`, async () => {
      const response = await fetch(`/api/admin/profiles/${profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ walletBalance: Number(next) }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to update wallet balance.");
      }
    });
  };

  const deleteTestimonial = async (testimonialId: string) => {
    if (!window.confirm("Delete this testimonial permanently?")) return;

    await runAction(`testimonial-${testimonialId}`, async () => {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": adminKey,
        },
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to delete testimonial.");
      }
    });
  };

  return (
    <div className="space-y-8 relative perspective-[2000px]">
      
      {/* HERO SECTION 3D HEADER */}
      <TiltCard className="rounded-[2rem]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl relative overflow-hidden">
          {/* Decorative ambient gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" style={{ transform: "translateZ(-50px)" }}></div>
          
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between relative z-10" style={{ transform: "translateZ(40px)" }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300 flex items-center gap-2">
                <Zap className="w-4 h-4" /> System Core
              </p>
              <h1 className="mt-4 font-display text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                Command Center
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
                Full 3D spatial dashboard for controlling critical platform metrics, handling service requests,
                and tuning algorithm performance nodes.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row shadow-2xl" style={{ transform: "translateZ(60px)" }}>
              <input
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                placeholder="Enter admin override"
                className="h-12 w-full sm:w-64 rounded-2xl border border-white/10 bg-black/40 px-5 text-sm text-white outline-none transition-all placeholder:text-zinc-500 focus:border-cyan-400 focus:bg-black backdrop-blur-xl"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => void fetchDashboard()}
                disabled={isLoading || !adminKey}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 text-sm font-bold text-black transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck className="h-4 w-4" />
                {isLoading ? "Authenticating..." : "Override"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => void fetchDashboard()}
                disabled={isLoading || !data}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-60 backdrop-blur-xl"
              >
                <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Sync
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200 font-medium flex items-center shadow-lg"
                style={{ transform: "translateZ(80px)" }}
              >
                ACCESS DENIED: {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TiltCard>

      {/* DASHBOARD CONTENT */}
      {data && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
          
          {/* 3D STATS GRID */}
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {stats.map((item) => (
              <motion.div key={item.label} variants={itemVariants}>
                <TiltCard className="rounded-[2rem] h-full">
                  <div className="h-full rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#121214] to-black p-6 shadow-[0_16px_60px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between" style={{ transform: "translateZ(20px)" }}>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">{item.label}</p>
                      <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5 ${item.color}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div style={{ transform: "translateZ(40px)" }}>
                      <p className="mt-6 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-tight">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
            
            {/* ORDERS COLUMN */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="mb-6 flex items-center justify-between relative z-10">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                      Active Telemetry
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">Review and process dynamic service requests.</p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <AnimatePresence>
                    {data.orders.map((order, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={order.id} 
                        className="group rounded-[1.5rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-5 transition-colors duration-300"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="font-bold text-white text-lg flex items-center gap-2">
                              {order.platform} {order.service} 
                              <span className="text-cyan-400">@{order.target_username}</span>
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400 font-medium">
                              <span className="bg-white/10 px-2 py-0.5 rounded-md">Qty: {order.quantity}</span>
                              <span className="text-white">{currency.format(Number(order.total_price ?? 0))}</span>
                              <span className="text-zinc-600">ID: {order.user_id?.slice(0, 8) ?? "guest"}</span>
                            </div>
                            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-600 font-bold">
                              {new Date(order.created_at).toLocaleString()}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 lg:justify-end">
                            {["pending", "processing", "completed", "cancelled"].map((status) => {
                              const isActive = order.status === status;
                              return (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  key={status}
                                  onClick={() => void updateOrderStatus(order.id, status)}
                                  disabled={activeAction === `order-${order.id}`}
                                  className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-50 ${
                                    isActive
                                      ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                                      : "border border-white/10 bg-black/50 text-zinc-400 hover:border-white/30 hover:text-white"
                                  }`}
                                >
                                  {status}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* USERS / SUPPORT COLUMN */}
            <motion.div variants={itemVariants} className="space-y-8">
              
              <div className="rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                
                <h2 className="text-2xl font-black text-white relative z-10">User Nodes</h2>
                <p className="mt-1 text-sm text-zinc-400 relative z-10">Manipulate balances and inspect connected identities.</p>
                
                <div className="mt-6 space-y-4 relative z-10">
                  {data.profiles.map((profile, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={profile.id} 
                      className="rounded-[1.5rem] border border-white/5 bg-white/[0.02] p-5 shadow-inner"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white text-lg">{profile.full_name || profile.username || "Anonymous Node"}</p>
                          <p className="text-sm text-cyan-400 font-medium">@{profile.username || "unknown"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Assets</p>
                          <p className="text-emerald-400 font-bold">{currency.format(Number(profile.wallet_balance ?? 0))}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs text-zinc-600 truncate max-w-[150px]">{profile.website || profile.id}</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => void updateWalletBalance(profile.id, profile.wallet_balance)}
                          disabled={activeAction === `profile-${profile.id}`}
                          className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-md px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/10 transition-all hover:bg-white hover:text-black disabled:opacity-50"
                        >
                          Modify Vault
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          </section>

          {/* TESTIMONIALS SECTION */}
          <motion.section variants={itemVariants} className="rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="mb-8 relative z-10">
              <h2 className="text-2xl font-black text-white">Social Proof Matrix</h2>
              <p className="text-sm text-zinc-400 mt-1">Moderate public testimonies running on the global grid.</p>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2 relative z-10">
              <AnimatePresence>
                {data.testimonials.map((testimonial, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={testimonial.id} 
                    className="group rounded-[1.5rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-6 transition-all duration-500 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-zinc-800">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={testimonial.author_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.author_name}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-white tracking-wide">{testimonial.author_name}</p>
                          <p className="text-sm text-cyan-400">@{testimonial.author_handle}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => void deleteTestimonial(testimonial.id)}
                        disabled={activeAction === `testimonial-${testimonial.id}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-400 transition-all hover:bg-rose-500 hover:text-black disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                    
                    <div className="mt-5">
                       <p className="text-sm leading-relaxed text-zinc-300 italic">"{testimonial.body}"</p>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                           <svg key={index} className={`w-4 h-4 ${index < testimonial.rating ? 'text-amber-400' : 'text-zinc-700'}`} fill="currentColor" viewBox="0 0 20 20">
                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                           </svg>
                        ))}
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">
                        {new Date(testimonial.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>

        </motion.div>
      )}
    </div>
  );
}