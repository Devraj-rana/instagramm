"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LoaderCircle, Save, ShieldCheck, UserCircle2 } from "lucide-react";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import { supabase } from "@/lib/supabase";

type ProfileForm = {
  full_name: string;
  username: string;
  website: string;
  avatar_url: string;
};

type Toast = {
  id: number;
  tone: "error" | "success";
  message: string;
};

const initialForm: ProfileForm = {
  full_name: "",
  username: "",
  website: "",
  avatar_url: "",
};

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (tone: Toast["tone"], message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, tone, message }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  useEffect(() => {
    let isMounted = true;

    const loadAccount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (!user) {
        router.replace("/sign-in");
        return;
      }

      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, username, website, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      setForm({
        full_name: profile?.full_name ?? user.user_metadata?.full_name ?? "",
        username: profile?.username ?? user.user_metadata?.username ?? "",
        website: profile?.website ?? "",
        avatar_url: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? "",
      });
      setNewEmail(user.email ?? "");
      setIsLoading(false);
    };

    loadAccount();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const onChange = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      pushToast("error", "Please sign in again.");
      router.replace("/sign-in");
      return;
    }

    const cleanedUsername = form.username.replace(/^@/, "").trim();

    if (cleanedUsername.length > 0 && cleanedUsername.length < 3) {
      pushToast("error", "Username must be at least 3 characters.");
      return;
    }

    setIsSaving(true);

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name.trim() || null,
      username: cleanedUsername || null,
      website: form.website.trim() || null,
      avatar_url: form.avatar_url.trim() || null,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      setIsSaving(false);
      pushToast("error", profileError.message);
      return;
    }

    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        full_name: form.full_name.trim(),
        username: cleanedUsername,
        avatar_url: form.avatar_url.trim(),
      },
    });

    setIsSaving(false);

    if (metadataError) {
      pushToast("error", metadataError.message);
      return;
    }

    pushToast("success", "Account settings updated successfully.");
    router.refresh();
  };

  const handleEmailUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanedEmail = newEmail.trim();
    if (!cleanedEmail) {
      pushToast("error", "Enter a valid email address.");
      return;
    }

    setEmailLoading(true);
    const { error: emailError } = await supabase.auth.updateUser({
      email: cleanedEmail,
    });
    setEmailLoading(false);

    if (emailError) {
      pushToast("error", emailError.message);
      return;
    }

    pushToast("success", "Verification email sent. Confirm your new email to complete the change.");
  };

  const handlePasswordUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      pushToast("error", "Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      pushToast("error", "Passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    const { error: passwordError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setPasswordLoading(false);

    if (passwordError) {
      pushToast("error", passwordError.message);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    pushToast("success", "Password updated successfully.");
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      pushToast("error", "Please upload an image file.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      pushToast("error", "Please sign in again.");
      router.replace("/sign-in");
      return;
    }

    setIsUploadingAvatar(true);
    const extension = file.name.split(".").pop() || "png";
    const filePath = `${user.id}/avatar.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setIsUploadingAvatar(false);
      pushToast("error", "Avatar upload failed. Ensure avatars bucket exists and is public.");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    onChange("avatar_url", data.publicUrl);
    setIsUploadingAvatar(false);
    pushToast("success", "Avatar uploaded. Save settings to persist it.");

    event.target.value = "";
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="pointer-events-none fixed right-4 top-24 z-70 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 text-sm shadow-xl backdrop-blur ${
              toast.tone === "error"
                ? "border-red-400/40 bg-red-500/20 text-red-100"
                : "border-emerald-400/40 bg-emerald-500/20 text-emerald-100"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-28">
        <div className="w-full max-w-2xl overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.15),transparent_45%)] px-8 py-10">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-200">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/80">My Account</p>
                <h1 className="mt-2 font-display text-4xl font-black tracking-tight text-white">Profile Settings</h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-zinc-300">
                  Manage your profile details. Changes here are used across your account experience.
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="mt-10 flex h-48 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-zinc-300">
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                Loading your account...
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-8 space-y-5">
                <SettingField label="Email" value={email || "-"} readOnly />
                <SettingInput
                  label="Full Name"
                  value={form.full_name}
                  onChange={(value) => onChange("full_name", value)}
                  placeholder="Your full name"
                />
                <SettingInput
                  label="Username"
                  value={form.username}
                  onChange={(value) => onChange("username", value)}
                  placeholder="yourhandle"
                />
                <SettingInput
                  label="Social Media Profile Link"
                  value={form.website}
                  onChange={(value) => onChange("website", value)}
                  placeholder="https://instagram.com/yourhandle"
                />
                <SettingInput
                  label="Avatar URL"
                  value={form.avatar_url}
                  onChange={(value) => onChange("avatar_url", value)}
                  placeholder="https://example.com/avatar.png"
                />
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">Upload Avatar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                    className="block w-full cursor-pointer rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500/20 file:px-3 file:py-2 file:text-cyan-200 hover:file:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  {isUploadingAvatar ? (
                    <p className="mt-2 flex items-center text-xs text-zinc-400">
                      <LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Uploading avatar...
                    </p>
                  ) : null}
                </div>

                {form.avatar_url.trim() ? (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Avatar Preview</p>
                    <Image
                      src={form.avatar_url}
                      alt="Avatar preview"
                      width={80}
                      height={80}
                      unoptimized
                      className="h-20 w-20 rounded-full border border-white/10 object-cover"
                    />
                  </div>
                ) : null}

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    Security Note
                  </div>
                  <p className="mt-2 text-emerald-100/90">
                    Email verification and authentication are managed securely by Supabase.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 via-indigo-500 to-pink-500 px-5 text-sm font-bold text-white transition-all hover:scale-[1.01] hover:shadow-[0_15px_50px_rgba(99,102,241,0.35)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSaving ? "Saving..." : "Save Settings"}
                </button>
              </form>
            )}

            {!isLoading ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <form onSubmit={handleEmailUpdate} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <h2 className="text-lg font-bold text-white">Change Email</h2>
                  <p className="mt-1 text-sm text-zinc-400">We will send a verification email to confirm the change.</p>
                  <div className="mt-4">
                    <SettingInput
                      label="New Email"
                      value={newEmail}
                      onChange={setNewEmail}
                      placeholder="name@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={emailLoading}
                    className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {emailLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                    {emailLoading ? "Sending..." : "Update Email"}
                  </button>
                </form>

                <form onSubmit={handlePasswordUpdate} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <h2 className="text-lg font-bold text-white">Change Password</h2>
                  <p className="mt-1 text-sm text-zinc-400">Use at least 8 characters for stronger security.</p>
                  <div className="mt-4 space-y-4">
                    <SettingInput
                      label="New Password"
                      value={newPassword}
                      onChange={setNewPassword}
                      placeholder="Enter new password"
                      type="password"
                    />
                    <SettingInput
                      label="Confirm Password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      placeholder="Re-enter new password"
                      type="password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-indigo-400/40 bg-indigo-500/10 px-4 text-sm font-semibold text-indigo-100 transition-colors hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {passwordLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SettingField({ label, value, readOnly = false }: { label: string; value: string; readOnly?: boolean }) {
  if (readOnly) {
    return (
      <div>
        <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
        <div className="flex min-h-12 w-full items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-zinc-300">
          {value}
        </div>
      </div>
    );
  }

  return null;
}

function SettingInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-cyan-400/60 focus:bg-black/40 focus:ring-2 focus:ring-cyan-400/20"
      />
    </label>
  );
}

