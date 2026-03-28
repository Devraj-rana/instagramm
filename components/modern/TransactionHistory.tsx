"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  AlertCircle,
  History,
  Info,
} from "lucide-react";

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  metadata: any;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Please sign in to view your history.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setTransactions(data || []);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        <p className="text-sm font-medium text-zinc-500">Retrieving transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
        <AlertCircle className="h-5 w-5" />
        {error}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-900 border border-white/5 text-zinc-700">
          <History className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-white">No transactions found</h3>
        <p className="mt-2 max-w-[240px] text-sm text-zinc-500">
          Your credit and debit history will appear here once you add funds or place an order.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Financial Activity</h3>
        <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-bold text-zinc-500 uppercase tracking-widest">
          {transactions.length} Records
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-zinc-600">
              <th className="px-6 py-4">Transaction</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => {
              const isCredit = tx.type === "credit";
              return (
                <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                        isCredit 
                        ? "bg-green-500/10 border-green-500/20 text-green-400 group-hover:bg-green-500/20" 
                        : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20"
                      }`}>
                        {isCredit ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{tx.description}</p>
                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-tighter">
                          ID: {tx.id.split("-")[0]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-medium text-zinc-400">
                      {new Date(tx.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                    <p className="text-[10px] text-zinc-600 font-bold">
                       {new Date(tx.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`text-base font-black ${isCredit ? "text-green-400" : "text-white"}`}>
                      {isCredit ? "+" : "-"}₹{Number(tx.amount).toLocaleString("en-IN")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/5 p-4">
        <Info className="h-4 w-4 text-zinc-500 mt-0.5" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          Transaction history includes all wallet top-ups through our payment partners and deductions for orders placed on our platform. All amounts are shown in Indian Rupees (INR).
        </p>
      </div>
    </div>
  );
}
