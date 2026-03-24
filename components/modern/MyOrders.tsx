"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Not signed in");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, platform, service, quantity, target_username, status, total_price")
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

  if (loading) return <div className="text-zinc-300 py-10 text-center">Loading orders...</div>;
  if (error) return <div className="bg-red-500/20 text-red-200 rounded-lg px-4 py-2">{error}</div>;
  if (orders.length === 0) return <div className="text-zinc-400 py-10 text-center">No orders found.</div>;

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full divide-y divide-zinc-700">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-bold text-zinc-400 uppercase">Order ID</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-zinc-400 uppercase">Date</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-zinc-400 uppercase">Platform</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-zinc-400 uppercase">Service</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-zinc-400 uppercase">Quantity</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-zinc-400 uppercase">Target</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-zinc-400 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-zinc-400 uppercase">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {orders.map(order => (
            <tr key={order.id}>
              <td className="px-4 py-2 font-mono text-zinc-300">{order.id.slice(0, 8)}</td>
              <td className="px-4 py-2 text-zinc-400">{new Date(order.created_at).toLocaleString()}</td>
              <td className="px-4 py-2 text-zinc-300 capitalize">{order.platform}</td>
              <td className="px-4 py-2 text-zinc-300 capitalize">{order.service}</td>
              <td className="px-4 py-2 text-zinc-300">{order.quantity}</td>
              <td className="px-4 py-2 text-zinc-300">@{order.target_username}</td>
              <td className="px-4 py-2 text-zinc-300">{order.status}</td>
              <td className="px-4 py-2 text-zinc-300 font-bold">₹{Number(order.total_price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
