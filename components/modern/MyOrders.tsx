"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Package,
  LoaderCircle,
  AlertCircle,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  platform: string;
  service: string;
  quantity: number;
  target_username: string;
  status: string;
  total_price: number;
}

const statusConfig: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  completed: {
    icon: CheckCircle2,
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-400/20",
  },
  pending: {
    icon: Hourglass,
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-400/20",
  },
  processing: {
    icon: Clock,
    color: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-400/20",
  },
  cancelled: {
    icon: XCircle,
    color: "text-red-300",
    bg: "bg-red-500/10",
    border: "border-red-400/20",
  },
  failed: {
    icon: XCircle,
    color: "text-red-300",
    bg: "bg-red-500/10",
    border: "border-red-400/20",
  },
};

const defaultStatusConfig: { icon: React.ElementType; color: string; bg: string; border: string } = {
  icon: Clock,
  color: "text-zinc-300",
  bg: "bg-zinc-500/10",
  border: "border-zinc-400/20",
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not signed in");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, created_at, platform, service, quantity, target_username, status, total_price"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoaderCircle className="h-6 w-6 animate-spin text-cyan-400" />
        <span className="ml-3 text-zinc-400">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] text-zinc-600">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-300">No orders yet</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Your order history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Order History
        </p>
        <span className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-zinc-400">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const config =
            statusConfig[order.status.toLowerCase()] || defaultStatusConfig;
          const StatusIcon = config.icon;
          return (
            <div
              key={order.id}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.1] hover:bg-white/[0.03] sm:p-5"
            >
              {/* Top row: service + status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-cyan-500/15 text-indigo-300">
                    <Package className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold capitalize text-white">
                      {order.service}
                    </p>
                    <p className="text-xs text-zinc-500 capitalize">
                      {order.platform} · @{order.target_username}
                    </p>
                  </div>
                </div>
                <span
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize ${config.color} ${config.bg} ${config.border}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {order.status}
                </span>
              </div>

              {/* Bottom row: details */}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.04] pt-3">
                <span className="text-xs text-zinc-500">
                  <span className="text-zinc-600">ID:</span>{" "}
                  <span className="font-mono text-zinc-400">
                    {order.id.slice(0, 8)}
                  </span>
                </span>
                <span className="text-xs text-zinc-500">
                  <span className="text-zinc-600">Qty:</span>{" "}
                  <span className="text-zinc-400">
                    {order.quantity.toLocaleString()}
                  </span>
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="ml-auto text-base font-bold text-white">
                  ₹{Number(order.total_price).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
