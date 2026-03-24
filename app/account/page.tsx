"use client";

import { useEffect, useState, FormEvent } from "react";
import { UserCircle2 } from "lucide-react";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import MyOrders from "@/components/modern/MyOrders";
import { supabase } from "@/lib/supabase";

type ProfileForm = {
  full_name: string;
  username: string;
  website: string;
  avatar_url: string;
};

const initialForm: ProfileForm = {
  full_name: "",
  username: "",
  website: "",
  avatar_url: "",
};

function ProfileSettings() {
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Not signed in");
        setIsLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, username, website, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (!isMounted) return;
      setForm({
        full_name: profile?.full_name ?? user.user_metadata?.full_name ?? "",
        username: profile?.username ?? user.user_metadata?.username ?? "",
        website: profile?.website ?? "",
        avatar_url: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? "",
      });
      setIsLoading(false);
    };
    loadProfile();
    return () => { isMounted = false; };
  }, []);

  const onChange = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not signed in");
      setIsSaving(false);
      return;
    }
    const cleanedUsername = form.username.replace(/^@/, "").trim();
    if (cleanedUsername.length > 0 && cleanedUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      setIsSaving(false);
      return;
    }
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name.trim() || null,
      username: cleanedUsername || null,
      website: form.website.trim() || null,
      avatar_url: form.avatar_url.trim() || null,
      updated_at: new Date().toISOString(),
    });
    if (profileError) {
      setError(profileError.message);
      setIsSaving(false);
      return;
    }
    setSuccess("Profile updated successfully.");
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="text-zinc-300 py-10 text-center">Loading profile...</div>;
  }
  return (
    <form onSubmit={handleSave} className="space-y-6 mt-8 max-w-lg mx-auto">
      {error && <div className="bg-red-500/20 text-red-200 rounded-lg px-4 py-2">{error}</div>}
      {success && <div className="bg-emerald-500/20 text-emerald-200 rounded-lg px-4 py-2">{success}</div>}
      <div className="flex flex-col items-center gap-4">
        {form.avatar_url ? (
          <img src={form.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-cyan-400 object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-300 border-2 border-cyan-400">
            <UserCircle2 className="h-10 w-10" />
          </div>
        )}
      </div>
      <div>
        <label className="block text-zinc-300 mb-1">Full Name</label>
        <input
          type="text"
          value={form.full_name}
          onChange={e => onChange("full_name", e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400/60 focus:bg-black/40"
          placeholder="Your full name"
        />
      </div>
      <div>
        <label className="block text-zinc-300 mb-1">Username</label>
        <input
          type="text"
          value={form.username}
          onChange={e => onChange("username", e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400/60 focus:bg-black/40"
          placeholder="Username"
        />
      </div>
      <div>
        <label className="block text-zinc-300 mb-1">Website</label>
        <input
          type="text"
          value={form.website}
          onChange={e => onChange("website", e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400/60 focus:bg-black/40"
          placeholder="Website URL"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-700 transition-all disabled:opacity-50"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}



export default function AccountPage() {
  const [tab, setTab] = useState<"profile" | "orders">("profile");
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-28">
        <div className="w-full max-w-3xl overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.15),transparent_45%)] px-8 py-10">
            <div className="flex items-start gap-3 mb-8">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-200">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/80">My Account</p>
                <h1 className="mt-2 font-display text-4xl font-black tracking-tight text-white">Account</h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-zinc-300">
                  Manage your profile and view your orders.
                </p>
              </div>
            </div>
            <div className="flex gap-4 mb-8">
              <button
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${tab === "profile" ? "bg-cyan-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-cyan-900/40"}`}
                onClick={() => setTab("profile")}
              >
                Profile
              </button>
              <button
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${tab === "orders" ? "bg-cyan-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-cyan-900/40"}`}
                onClick={() => setTab("orders")}
              >
                My Orders
              </button>
            </div>
            <div>
              {tab === "profile" && <ProfileSettings />}
              {tab === "orders" && <MyOrders />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Removed unused SettingField and SettingInput components

