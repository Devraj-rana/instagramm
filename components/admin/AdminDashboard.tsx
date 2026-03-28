"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeDollarSign,
  CreditCard,
  MessageSquareQuote,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  UserRound,
  Wallet,
} from "lucide-react";

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
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          "x-admin-key": key,
        },
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
  }, [savedKeyLoaded]);

  const stats = useMemo(() => {
    if (!data) return [];
    return [
      { label: "Users", value: String(data.stats.totalUsers), icon: UserRound },
      { label: "Orders", value: String(data.stats.totalOrders), icon: CreditCard },
      { label: "Pending", value: String(data.stats.pendingOrders), icon: ShieldCheck },
      { label: "Revenue", value: currency.format(data.stats.totalRevenue), icon: BadgeDollarSign },
      { label: "Wallet Total", value: currency.format(data.stats.totalWalletBalance), icon: Wallet },
      { label: "Testimonials", value: String(data.stats.totalTestimonials), icon: MessageSquareQuote },
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

  const updateUserStatus = async (profileId: string, status: string) => {
    await runAction(`profile-status-${profileId}`, async () => {
      const response = await fetch(`/api/admin/profiles/${profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ status }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to update user status.");
      }
    });
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
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300/75">Admin Control</p>
            <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-white">Mission Control</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
              Control orders, balances, testimonials, and core business metrics from one place.
              Support requests are still email-only in the current build, so they are noted here but not queryable yet.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Enter admin key"
              className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition-all placeholder:text-zinc-500 focus:border-cyan-400/50"
            />
            <button
              onClick={() => void fetchDashboard()}
              disabled={isLoading || !adminKey}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 text-sm font-bold text-black transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheck className="h-4 w-4" />
              {isLoading ? "Loading..." : "Unlock"}
            </button>
            <button
              onClick={() => void fetchDashboard()}
              disabled={isLoading || !data}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
        {error ? (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </section>

      {data ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-[1.75rem] border border-white/10 bg-[#0d0d10] p-5 shadow-[0_16px_60px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">{item.label}</p>
                  <item.icon className="h-5 w-5 text-cyan-300" />
                </div>
                <p className="mt-4 text-3xl font-black text-white">{item.value}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Orders</h2>
                  <p className="text-sm text-zinc-400">Update status for incoming service requests.</p>
                </div>
              </div>
              <div className="space-y-3">
                {data.orders.map((order) => (
                  <div key={order.id} className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-bold text-white">
                          {order.platform} {order.service} for @{order.target_username}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">
                          Qty {order.quantity} • {currency.format(Number(order.total_price ?? 0))} • {order.user_id?.slice(0, 8) ?? "guest"}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["pending", "processing", "completed", "cancelled"].map((status) => (
                          <button
                            key={status}
                            onClick={() => void updateOrderStatus(order.id, status)}
                            disabled={activeAction === `order-${order.id}`}
                            className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-all ${
                              order.status === status
                                ? "bg-cyan-400 text-black"
                                : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                            } disabled:opacity-50`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-black text-white">Users</h2>
                <p className="mt-1 text-sm text-zinc-400">Adjust balances and inspect profile metadata.</p>
                <div className="mt-5 space-y-3">
                  {data.profiles.map((profile) => (
                    <div key={profile.id} className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
                      <p className="font-bold text-white">{profile.full_name || profile.username || "Unnamed user"}</p>
                      <p className="mt-1 text-sm text-zinc-400">@{profile.username || "no-username"}</p>
                      <p className="mt-2 text-sm text-zinc-300">{currency.format(Number(profile.wallet_balance ?? 0))}</p>
                      <p className="mt-1 text-xs text-zinc-500">{profile.website || profile.id}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${profile.status === "completed" ? "bg-green-500 text-black" : "bg-yellow-400 text-black"}`}>
                          {profile.status}
                        </span>
                        {profile.status === "pending" ? (
                          <button
                            onClick={() => void updateUserStatus(profile.id, "completed")}
                            disabled={activeAction === `profile-status-${profile.id}`}
                            className="inline-flex items-center rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-black transition-all hover:bg-cyan-300 disabled:opacity-50"
                          >
                            Mark Completed
                          </button>
                        ) : (
                          <button
                            onClick={() => void updateUserStatus(profile.id, "pending")}
                            disabled={activeAction === `profile-status-${profile.id}`}
                            className="inline-flex items-center rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-black transition-all hover:bg-yellow-300 disabled:opacity-50"
                          >
                            Mark Pending
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => void updateWalletBalance(profile.id, profile.wallet_balance)}
                        disabled={activeAction === `profile-${profile.id}`}
                        className="mt-3 inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-black transition-all hover:bg-zinc-200 disabled:opacity-50"
                      >
                        Edit Balance
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-black text-white">Support</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-300">
                  Support requests currently go straight to email via `/api/support`. If you want,
                  we can make the next step a real ticket system with a `support_tickets` table and full admin actions.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-white">Testimonials</h2>
              <p className="text-sm text-zinc-400">Moderate public social proof content.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {data.testimonials.map((testimonial) => (
                <div key={testimonial.id} className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">{testimonial.author_name}</p>
                      <p className="mt-1 text-sm text-zinc-400">{testimonial.author_handle}</p>
                    </div>
                    <button
                      onClick={() => void deleteTestimonial(testimonial.id)}
                      disabled={activeAction === `testimonial-${testimonial.id}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-300 transition-all hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-zinc-300">{testimonial.body}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-zinc-500">
                    Rating {testimonial.rating}/5 • {new Date(testimonial.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
