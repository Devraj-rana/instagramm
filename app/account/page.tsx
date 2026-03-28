"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  UserCircle2,
  Settings,
  ShoppingBag,
  Shield,
  LogOut,
  Save,
  LoaderCircle,
  Globe,
  AtSign,
  User,
  Camera,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Mail,
  Calendar,
  Eye,
  EyeOff,
  History,
} from "lucide-react";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import MyOrders from "@/components/modern/MyOrders";
import TransactionHistory from "@/components/modern/TransactionHistory";
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

/* ───────────────────────── Profile Settings ───────────────────────── */

function ProfileSettings() {
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [email, setEmail] = useState("");
  const [joinedAt, setJoinedAt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not signed in");
        setIsLoading(false);
        return;
      }
      setEmail(user.email ?? "");
      setJoinedAt(
        user.created_at
          ? new Date(user.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : ""
      );
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
        avatar_url:
          profile?.avatar_url ?? user.user_metadata?.avatar_url ?? "",
      });
      setIsLoading(false);
    };
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const onChange = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSuccess(null);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
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

    if (cleanedUsername) {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", cleanedUsername)
        .neq("id", user.id)
        .maybeSingle();

      if (existingUser) {
        setError("This username is already taken. Please choose another one.");
        setIsSaving(false);
        return;
      }
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
      if (profileError.code === "23505" || profileError.message.includes("duplicate key")) {
        setError("This username is already taken. Please choose another one.");
      } else {
        setError(profileError.message);
      }
      setIsSaving(false);
      return;
    }
    setSuccess("Profile updated successfully!");
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoaderCircle className="h-6 w-6 animate-spin text-cyan-400" />
        <span className="ml-3 text-zinc-400">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Avatar & Account Info Card ── */}
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="group relative flex-shrink-0">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
              {form.avatar_url ? (
                <img
                  src={form.avatar_url}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-900/40 to-indigo-900/40">
                  <UserCircle2 className="h-12 w-12 text-cyan-300/60" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 rounded-lg border border-white/10 bg-zinc-900 p-1.5 shadow-lg">
              <Camera className="h-3.5 w-3.5 text-cyan-300" />
            </div>
          </div>

          {/* Account info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">
              {form.full_name || "Your Name"}
            </h2>
            <p className="mt-1 text-sm text-cyan-300/70">
              @{form.username || "username"}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-start">
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Mail className="h-3 w-3" />
                {email}
              </span>
              {joinedAt && (
                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Calendar className="h-3 w-3" />
                  Joined {joinedAt}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Form ── */}
      <form onSubmit={handleSave} className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Profile Details
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <SettingInput
            icon={<User className="h-4 w-4" />}
            label="Full Name"
            value={form.full_name}
            onChange={(v) => onChange("full_name", v)}
            placeholder="Your full name"
          />
          <SettingInput
            icon={<AtSign className="h-4 w-4" />}
            label="Username"
            value={form.username}
            onChange={(v) => onChange("username", v)}
            placeholder="yourhandle"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <SettingInput
            icon={<Globe className="h-4 w-4" />}
            label="Primary Social Link"
            value={form.website}
            onChange={(v) => onChange("website", v)}
            placeholder="https://instagram.com/yourhandle"
          />
          <SettingInput
            icon={<Camera className="h-4 w-4" />}
            label="Profile Picture URL"
            value={form.avatar_url}
            onChange={(v) => onChange("avatar_url", v)}
            placeholder="Paste an image URL"
          />
        </div>

        {/* Status messages */}
        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 text-base font-bold text-white transition-all hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(99,102,241,0.3)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-auto sm:px-10"
        >
          {isSaving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

/* ───────────────────────── Reusable Field ───────────────────────── */

function SettingInput({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5 text-sm font-medium text-zinc-300">
        <span className="text-zinc-500">{icon}</span>
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-cyan-400/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-cyan-400/15"
      />
    </label>
  );
}

/* ───────────────────────── Tab Button ───────────────────────── */

const tabs = [
  { id: "profile" as const, label: "Profile", icon: Settings, description: "Manage your details" },
  { id: "orders" as const, label: "My Orders", icon: ShoppingBag, description: "View order growth" },
  { id: "transactions" as const, label: "Transactions", icon: History, description: "Wallet & billing history" },
  { id: "security" as const, label: "Security", icon: Shield, description: "Password & sessions" },
];

type TabId = (typeof tabs)[number]["id"];

/* ───────────────────────── Security Tab ───────────────────────── */

function SecuritySettings() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  // Email
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  // Username
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentEmail(user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();
      setCurrentUsername(profile?.username ?? user.user_metadata?.username ?? "");
    };
    load();
  }, []);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/sign-in");
  };

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!newPassword.trim()) {
      setPasswordMsg({ type: "error", text: "Enter a new password." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    setPasswordSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordSaving(false);
    if (error) {
      setPasswordMsg({ type: "error", text: error.message });
      return;
    }

    // Send notification email
    if (user?.email) {
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          subject: "Your password was changed — Social - Insight",
          html: `
<div style="background-color: #030303; padding: 40px 16px; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 480px; margin: 0 auto;">
    <div style="background: linear-gradient(160deg, #0c0c14 0%, #0a0a0f 50%, #0d0b14 100%); border-radius: 28px; border: 1px solid rgba(255,255,255,0.07); overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 120px rgba(6,182,212,0.06);">
      <div style="height: 3px; background: linear-gradient(90deg, #06b6d4, #6366f1, #a855f7, #ec4899);"></div>
      <div style="padding: 44px 40px 0; text-align: center; background: radial-gradient(ellipse at top center, rgba(6,182,212,0.12) 0%, transparent 60%);">
        <div style="font-size: 32px; font-weight: 900; letter-spacing: -1px; margin-bottom: 24px; display: inline-block;">
          <span style="color: #ffffff;">Social - </span><span style="color: #22d3ee;">Insight</span>
        </div>
        <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #22d3ee;">Security Alert</p>
        <h1 style="margin: 12px 0 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Password Changed</h1>
        <p style="margin: 16px 0 0; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
          Your account password was successfully changed on <strong style="color: #e4e4e7;">${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong> at <strong style="color: #e4e4e7;">${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</strong>.
        </p>
      </div>
      <div style="padding: 36px 40px 32px;">
        <div style="background: rgba(250, 204, 21, 0.04); border: 1px solid rgba(250, 204, 21, 0.10); border-radius: 16px; padding: 16px 20px; text-align: left;">
          <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #71717a;">
            <strong style="color: #fbbf24;">Didn't make this change?</strong> Please <a href="${process.env.NEXT_PUBLIC_SITE_URL}/reset-password" style="color: #fbbf24; font-weight: bold; text-decoration: underline;">reset your password immediately</a> or contact support.
          </p>
        </div>
      </div>
      <div style="border-top: 1px solid rgba(255,255,255,0.06); padding: 24px 40px; text-align: center; background: rgba(0,0,0,0.2);">
        <p style="margin: 0; font-size: 12px; color: #52525b; font-weight: 500;">
          © 2026 <strong style="color: #71717a;">Social - Insight</strong>
        </p>
      </div>
    </div>
  </div>
</div>`,
        }),
      }).catch(() => {}); // fire-and-forget
    }

    setPasswordMsg({ type: "success", text: "Password updated successfully!" });
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangeEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailMsg(null);
    if (!newEmail.trim()) {
      setEmailMsg({ type: "error", text: "Enter a new email address." });
      return;
    }
    if (newEmail.trim() === currentEmail) {
      setEmailMsg({ type: "error", text: "New email is the same as current." });
      return;
    }
    setEmailSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setEmailSaving(false);
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        setEmailMsg({ type: "error", text: "An account with this email already exists. Please use a different email." });
      } else {
        setEmailMsg({ type: "error", text: error.message });
      }
      return;
    }

    // Send notification email to the current email
    if (user?.email) {
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          subject: "Email change requested — Social - Insight",
          html: `
<div style="background-color: #030303; padding: 40px 16px; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 480px; margin: 0 auto;">
    <div style="background: linear-gradient(160deg, #0c0c14 0%, #0a0a0f 50%, #0d0b14 100%); border-radius: 28px; border: 1px solid rgba(255,255,255,0.07); overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 120px rgba(6,182,212,0.06);">
      <div style="height: 3px; background: linear-gradient(90deg, #06b6d4, #6366f1, #a855f7, #ec4899);"></div>
      <div style="padding: 44px 40px 0; text-align: center; background: radial-gradient(ellipse at top center, rgba(6,182,212,0.12) 0%, transparent 60%);">
        <div style="font-size: 32px; font-weight: 900; letter-spacing: -1px; margin-bottom: 24px; display: inline-block;">
          <span style="color: #ffffff;">Social - </span><span style="color: #22d3ee;">Insight</span>
        </div>
        <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #22d3ee;">Security Alert</p>
        <h1 style="margin: 12px 0 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Email Change requested</h1>
        <p style="margin: 16px 0 0; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
          A request to change your account email to <strong style="color: #e4e4e7;">${newEmail.trim()}</strong> was initiated on <strong style="color: #e4e4e7;">${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong> at <strong style="color: #e4e4e7;">${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</strong>.
        </p>
      </div>
      <div style="padding: 36px 40px 32px;">
        <div style="background: rgba(250, 204, 21, 0.04); border: 1px solid rgba(250, 204, 21, 0.10); border-radius: 16px; padding: 16px 20px; text-align: left;">
          <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #71717a;">
            <strong style="color: #fbbf24;">Didn't request this?</strong> Please <a href="${process.env.NEXT_PUBLIC_SITE_URL}/reset-password" style="color: #fbbf24; font-weight: bold; text-decoration: underline;">reset your password immediately</a> or contact support.
          </p>
        </div>
      </div>
      <div style="border-top: 1px solid rgba(255,255,255,0.06); padding: 24px 40px; text-align: center; background: rgba(0,0,0,0.2);">
        <p style="margin: 0; font-size: 12px; color: #52525b; font-weight: 500;">
          © 2026 <strong style="color: #71717a;">Social - Insight</strong>
        </p>
      </div>
    </div>
  </div>
</div>`,
        }),
      }).catch(() => {});
    }

    setEmailMsg({ type: "success", text: "Confirmation sent to your new email. Please verify to complete the change." });
    setNewEmail("");
  };

  const handleChangeUsername = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsernameMsg(null);
    const cleaned = newUsername.replace(/^@/, "").trim();
    if (!cleaned) {
      setUsernameMsg({ type: "error", text: "Enter a new username." });
      return;
    }
    if (cleaned.length < 3) {
      setUsernameMsg({ type: "error", text: "Username must be at least 3 characters." });
      return;
    }
    if (cleaned === currentUsername) {
      setUsernameMsg({ type: "error", text: "New username is the same as current." });
      return;
    }
    setUsernameSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setUsernameMsg({ type: "error", text: "Not signed in." });
      setUsernameSaving(false);
      return;
    }

    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", cleaned)
      .neq("id", user.id)
      .maybeSingle();

    if (existingUser) {
      setUsernameMsg({ type: "error", text: "This username is already taken. Please choose another one." });
      setUsernameSaving(false);
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username: cleaned,
      updated_at: new Date().toISOString(),
    });
    setUsernameSaving(false);
    if (error) {
      if (error.code === "23505" || error.message.includes("duplicate key")) {
        setUsernameMsg({ type: "error", text: "This username is already taken. Please choose another one." });
      } else {
        setUsernameMsg({ type: "error", text: error.message });
      }
      return;
    }

    // Send notification email
    if (user?.email) {
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          subject: "Your username was changed — Social - Insight",
          html: `
<div style="background-color: #030303; padding: 40px 16px; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 480px; margin: 0 auto;">
    <div style="background: linear-gradient(160deg, #0c0c14 0%, #0a0a0f 50%, #0d0b14 100%); border-radius: 28px; border: 1px solid rgba(255,255,255,0.07); overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 120px rgba(6,182,212,0.06);">
      <div style="height: 3px; background: linear-gradient(90deg, #06b6d4, #6366f1, #a855f7, #ec4899);"></div>
      <div style="padding: 44px 40px 0; text-align: center; background: radial-gradient(ellipse at top center, rgba(6,182,212,0.12) 0%, transparent 60%);">
        <div style="font-size: 32px; font-weight: 900; letter-spacing: -1px; margin-bottom: 24px; display: inline-block;">
          <span style="color: #ffffff;">Social - </span><span style="color: #22d3ee;">Insight</span>
        </div>
        <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #22d3ee;">Account Update</p>
        <h1 style="margin: 12px 0 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Username Changed</h1>
        <p style="margin: 16px 0 0; font-size: 15px; line-height: 1.6; color: #a1a1aa;">
          Your account username was successfully changed to <strong style="color: #e4e4e7;">@${cleaned}</strong> on <strong style="color: #e4e4e7;">${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong> at <strong style="color: #e4e4e7;">${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</strong>.
        </p>
      </div>
      <div style="padding: 36px 40px 32px;">
        <div style="background: rgba(250, 204, 21, 0.04); border: 1px solid rgba(250, 204, 21, 0.10); border-radius: 16px; padding: 16px 20px; text-align: left;">
          <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #71717a;">
            <strong style="color: #fbbf24;">Didn't make this change?</strong> Please <a href="${process.env.NEXT_PUBLIC_SITE_URL}/reset-password" style="color: #fbbf24; font-weight: bold; text-decoration: underline;">reset your password immediately</a> or contact support.
          </p>
        </div>
      </div>
      <div style="border-top: 1px solid rgba(255,255,255,0.06); padding: 24px 40px; text-align: center; background: rgba(0,0,0,0.2);">
        <p style="margin: 0; font-size: 12px; color: #52525b; font-weight: 500;">
          © 2026 <strong style="color: #71717a;">Social - Insight</strong>
        </p>
      </div>
    </div>
  </div>
</div>`,
        }),
      }).catch(() => {});
    }

    setCurrentUsername(cleaned);
    setUsernameMsg({ type: "success", text: "Username updated successfully!" });
    setNewUsername("");
  };

  return (
    <div className="space-y-6">
      {/* ── Change Password ── */}
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Change Password</h3>
            <p className="text-xs text-zinc-500">Update your account password</p>
          </div>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <SecurityInput
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <SecurityInput
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          {passwordMsg && <StatusPill type={passwordMsg.type} text={passwordMsg.text} />}
          <SecurityButton saving={passwordSaving} label="Update Password" />
        </form>
      </div>

      {/* ── Change Email ── */}
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Change Email</h3>
            <p className="text-xs text-zinc-500">
              Current: <span className="text-zinc-400">{currentEmail}</span>
            </p>
          </div>
        </div>
        <form onSubmit={handleChangeEmail} className="space-y-3">
          <SecurityInput
            type="email"
            placeholder="New email address"
            value={newEmail}
            onChange={setNewEmail}
          />
          {emailMsg && <StatusPill type={emailMsg.type} text={emailMsg.text} />}
          <SecurityButton saving={emailSaving} label="Update Email" />
        </form>
      </div>

      {/* ── Change Username ── */}
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/15 text-pink-300">
            <AtSign className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Change Username</h3>
            <p className="text-xs text-zinc-500">
              Current: <span className="text-zinc-400">@{currentUsername}</span>
            </p>
          </div>
        </div>
        <form onSubmit={handleChangeUsername} className="space-y-3">
          <SecurityInput
            type="text"
            placeholder="New username"
            value={newUsername}
            onChange={setNewUsername}
          />
          {usernameMsg && <StatusPill type={usernameMsg.type} text={usernameMsg.text} />}
          <SecurityButton saving={usernameSaving} label="Update Username" />
        </form>
      </div>

      {/* ── Sign Out ── */}
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-300">
            <LogOut className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Sign Out</h3>
            <p className="text-xs text-zinc-500">End your current session</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="flex h-11 items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-6 text-sm font-semibold text-red-300 transition-all hover:bg-red-500/20 hover:text-red-200 disabled:opacity-50"
        >
          {isLoggingOut ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}

/* ───────────────── Security Helpers ───────────────── */

function SecurityInput({
  type,
  placeholder,
  value,
  onChange,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordForm = type === "password";
  const inputType = isPasswordForm ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative">
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-cyan-400/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-cyan-400/15 pr-12"
      />
      {isPasswordForm && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}

function StatusPill({ type, text }: { type: "error" | "success"; text: string }) {
  const styles =
    type === "error"
      ? "border-red-400/20 bg-red-500/10 text-red-200"
      : "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
  const Icon = type === "error" ? AlertCircle : CheckCircle2;
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${styles}`}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      {text}
    </div>
  );
}

function SecurityButton({ saving, label }: { saving: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="flex h-11 items-center gap-2 rounded-xl bg-white/[0.06] border border-white/[0.08] px-6 text-sm font-semibold text-zinc-200 transition-all hover:bg-white/[0.1] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {saving ? "Saving..." : label}
    </button>
  );
}

/* ───────────────────────── Main Page ───────────────────────── */

export default function AccountPage() {
  const [tab, setTab] = useState<TabId>("profile");

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />
      <main className="flex-1 px-4 py-28 sm:px-6">
        <div className="mx-auto w-full max-w-5xl">
          {/* ── Page Header ── */}
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
              My Account
            </p>
            <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
              Account Settings
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-zinc-400">
              Manage your profile, view orders, and control your account
              security.
            </p>
          </div>

          {/* ── Layout: Sidebar + Content ── */}
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Sidebar / Tab Nav */}
            <nav className="flex flex-row gap-2 overflow-x-auto lg:w-64 lg:flex-shrink-0 lg:flex-col lg:gap-1.5 lg:overflow-visible">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all lg:w-full ${
                      isActive
                        ? "border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 shadow-[0_0_24px_rgba(34,211,238,0.06)]"
                        : "border border-transparent hover:border-white/[0.06] hover:bg-white/[0.02]"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
                        isActive
                          ? "bg-cyan-400/15 text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.12)]"
                          : "bg-white/[0.04] text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="hidden lg:block">
                      <span
                        className={`block text-sm font-semibold ${
                          isActive ? "text-white" : "text-zinc-300"
                        }`}
                      >
                        {t.label}
                      </span>
                      <span className="block text-xs text-zinc-600">
                        {t.description}
                      </span>
                    </div>
                    <span className="hidden lg:block ml-auto">
                      <ChevronRight
                        className={`h-4 w-4 transition-all ${
                          isActive
                            ? "text-cyan-400/60"
                            : "text-zinc-700 group-hover:text-zinc-500"
                        }`}
                      />
                    </span>
                    {/* Mobile label */}
                    <span
                      className={`block text-xs font-semibold lg:hidden ${
                        isActive ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Content Area */}
            <div className="min-w-0 flex-1 rounded-3xl border border-white/[0.06] bg-white/[0.025] p-6 shadow-[0_16px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-8 lg:p-10">
              <div className="bg-[radial-gradient(ellipse_at_top_left,rgba(34,211,238,0.06),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.05),transparent_50%)]">
                {tab === "profile" && <ProfileSettings />}
                {tab === "orders" && <MyOrders />}
                {tab === "transactions" && <TransactionHistory />}
                {tab === "security" && <SecuritySettings />}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
