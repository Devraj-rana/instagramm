"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";

type AuthPageProps = {
  mode: "sign-in" | "sign-up" | "reset-password" | "update-password";
};

type FormState = {
  name: string;
  username: string;
  email: string;
  password: string;
  otp: string;
};

const pageContent = {
  "sign-in": {
    eyebrow: "Welcome back",
    title: "Sign in to continue",
    description: "Access your account and jump back into your Instagram analytics workspace.",
    formTitle: "Sign in with your details",
    primaryLabel: "Continue with Google",
    switchPrompt: "Need an account?",
    switchHref: "/sign-up",
    switchLabel: "Sign up",
  },
  "sign-up": {
    eyebrow: "Create your account",
    title: "Sign up to get started",
    description: "Create your account, then verify your email with the OTP code we send you.",
    formTitle: "Create your profile",
    primaryLabel: "Continue with Google",
    switchPrompt: "Already have an account?",
    switchHref: "/sign-in",
    switchLabel: "Sign in",
  },
  "reset-password": {
    eyebrow: "Account Recovery",
    title: "Reset your password",
    description: "Enter your email address and we'll send you a link to reset your password.",
    formTitle: "Send reset link",
    primaryLabel: "Continue with Google",
    switchPrompt: "Remember your password?",
    switchHref: "/sign-in",
    switchLabel: "Sign in",
  },
  "update-password": {
    eyebrow: "Secure Account",
    title: "Set new password",
    description: "Please enter your new password below. Make sure it's at least 6 characters long.",
    formTitle: "Update password",
    primaryLabel: "Continue with Google",
    switchPrompt: "Back to sign in?",
    switchHref: "/sign-in",
    switchLabel: "Sign in",
  },
} as const;

const initialFormState: FormState = {
  name: "",
  username: "",
  email: "",
  password: "",
  otp: "",
};

export default function AuthPage({ mode }: AuthPageProps) {
  const content = pageContent[mode];
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState(true);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }

      if (data.session) {
        if (mode === "update-password") {
          setIsCheckingSupabase(false);
          return;
        }
        router.replace("/");
        return;
      }

      if (mode === "update-password") {
        // Should only be here if they just clicked the reset link which auto-signs them in
        setErrorMessage("Your reset link has expired or is invalid. Please request a new one.");
      }

      setIsCheckingSupabase(false);
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && mode !== "update-password") {
        router.replace("/");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const isBusy = useMemo(() => {
    return isSubmitting || isCheckingSupabase;
  }, [isCheckingSupabase, isSubmitting]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (mode === "sign-in") {
      await handleSignIn();
      return;
    }

    if (mode === "reset-password") {
      await handleResetPassword();
      return;
    }

    if (mode === "update-password") {
      await handleUpdatePassword();
      return;
    }

    if (pendingVerification) {
      await handleVerifyOtp();
      return;
    }

    await handleSignUp();
  };

  const handleResetPassword = async () => {
    if (!form.email.trim()) {
      setErrorMessage("Enter your email address.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(form.email.trim(), {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setInfoMessage("We've sent a password reset link to your email. Check your inbox.");
  };

  const handleUpdatePassword = async () => {
    if (!form.password.trim() || form.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: form.password });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setInfoMessage("Your password has been successfully updated!");
    setTimeout(() => {
      router.replace("/");
    }, 2000);
  };

  const handleSignUp = async () => {
    const cleanedUsername = form.username.replace(/^@/, "").trim();

    if (!form.name.trim() || !cleanedUsername || !form.email.trim() || !form.password.trim()) {
      setErrorMessage("Please complete all sign-up fields.");
      return;
    }

    if (cleanedUsername.length < 3) {
      setErrorMessage("Username must be at least 3 characters.");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password.trim(),
      options: {
        data: {
          full_name: form.name.trim(),
          username: cleanedUsername,
        },
      },
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // Supabase returns a user with empty identities if the email already exists
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setErrorMessage("An account with this email already exists. Please sign in instead.");
      return;
    }

    setForm((current) => ({ ...current, username: cleanedUsername }));
    setPendingVerification(true);
    setInfoMessage("We sent a verification code to your email. Enter the OTP below to finish creating your account.");
  };

  const handleVerifyOtp = async () => {
    if (!form.otp.trim()) {
      setErrorMessage("Enter the OTP code from your email.");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email: form.email.trim(),
      token: form.otp.trim(),
      type: "signup",
    });

    if (error) {
      setIsSubmitting(false);
      setErrorMessage(error.message);
      return;
    }

    const userId = data.user?.id;

    if (userId) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        username: form.username.replace(/^@/, "").trim(),
        full_name: form.name.trim(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        setIsSubmitting(false);
        setErrorMessage(profileError.message);
        return;
      }
    }

    setIsSubmitting(false);
    router.replace("/");
    router.refresh();
  };

  const handleResendOtp = async () => {
    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: form.email.trim(),
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setInfoMessage("A fresh OTP has been sent to your email.");
  };

  const handleSignIn = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      setErrorMessage("Enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.replace("/");
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setIsSubmitting(false);
      setErrorMessage(error.message);
      return;
    }
  };

  const submitLabel = mode === "sign-up"
    ? pendingVerification
      ? "Verify email"
      : "Create account"
    : mode === "reset-password"
      ? "Send reset link"
    : mode === "update-password"
      ? "Update password"
    : "Sign in";

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-28">
        <div className="w-full max-w-md overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.24),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.18),transparent_35%)] px-8 py-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/80">{content.eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-white">{content.title}</h1>
            <p className="mt-4 text-base leading-7 text-zinc-300">{content.description}</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <p className="text-sm font-semibold text-white/90">{pendingVerification ? "Verify your email" : content.formTitle}</p>

              {mode === "sign-up" && !pendingVerification ? (
                <>
                  <AuthInput label="Full name" name="name" type="text" placeholder="Enter your full name" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
                  <AuthInput label="Username" name="username" type="text" placeholder="@yourhandle" value={form.username} onChange={(event) => updateField("username", event.target.value)} />
                </>
              ) : null}

              {mode === "sign-up" && pendingVerification ? (
                <>
                  <ReadOnlyField label="Email" value={form.email} />
                  <AuthInput label="OTP code" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="Enter the 6-digit code" value={form.otp} onChange={(event) => updateField("otp", event.target.value)} />
                </>
              ) : mode === "reset-password" ? (
                <AuthInput label="Email" name="email" type="email" autoComplete="email" placeholder="Enter your email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
              ) : mode === "update-password" ? (
                <AuthInput label="New Password" name="password" type="password" autoComplete="new-password" placeholder="Create a new password" value={form.password} onChange={(event) => updateField("password", event.target.value)} />
              ) : (
                <>
                  <AuthInput label="Email" name="email" type="email" autoComplete="email" placeholder="Enter your email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
                  <div>
                    <AuthInput label="Password" name="password" type="password" autoComplete={mode === "sign-up" ? "new-password" : "current-password"} placeholder={mode === "sign-up" ? "Create a password" : "Enter your password"} value={form.password} onChange={(event) => updateField("password", event.target.value)} />
                    {mode === "sign-in" && (
                      <div className="mt-2 flex justify-end">
                        <Link href="/reset-password" className="text-xs font-medium text-zinc-400 transition-colors hover:text-cyan-300">
                          Forgot your password?
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}

              {errorMessage ? <StatusBanner tone="error" message={errorMessage} /> : null}
              {infoMessage ? <StatusBanner tone="info" message={infoMessage} /> : null}

              <button
                type="submit"
                disabled={isBusy}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 via-indigo-500 to-pink-500 px-5 text-base font-bold text-white transition-all hover:scale-[1.01] hover:shadow-[0_15px_50px_rgba(99,102,241,0.35)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {isBusy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : null}
                {submitLabel}
              </button>

              {mode === "sign-up" && pendingVerification ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isBusy}
                  className="w-full text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Resend OTP
                </button>
              ) : null}
            </form>

            {mode !== "update-password" && (
              <>
                <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                  <div className="h-px flex-1 bg-white/10" />
                  <span>or</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isBusy}
                  className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 text-base font-bold text-zinc-950 transition-all hover:scale-[1.01] hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                >
                  <GoogleIcon />
                  <span>{content.primaryLabel}</span>
                </button>
              </>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-400">
              <span>{content.switchPrompt}</span>
              <Link href={content.switchHref} className="inline-flex items-center gap-1 font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
                {content.switchLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function AuthInput({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      <input
        {...props}
        className="h-13 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-cyan-400/60 focus:bg-black/40 focus:ring-2 focus:ring-cyan-400/20"
      />
    </label>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      <div className="flex min-h-13 w-full items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-zinc-300">
        {value}
      </div>
    </div>
  );
}

function StatusBanner({ tone, message }: { tone: "error" | "info"; message: string }) {
  const styles = tone === "error"
    ? "border-red-400/25 bg-red-500/10 text-red-200"
    : "border-cyan-400/25 bg-cyan-500/10 text-cyan-100";

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}>{message}</div>;
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.6 14.5 2.7 12 2.7A9.3 9.3 0 0 0 2.7 12 9.3 9.3 0 0 0 12 21.3c5.4 0 9-3.8 9-9.1 0-.6-.1-1.1-.2-1.5H12Z" />
      <path fill="#34A853" d="M2.7 12c0 1.6.4 3.1 1.2 4.4l3.4-2.6c-.2-.5-.3-1.2-.3-1.8s.1-1.2.3-1.8L3.9 7.6A9.2 9.2 0 0 0 2.7 12Z" />
      <path fill="#FBBC05" d="M12 21.3c2.5 0 4.6-.8 6.2-2.3l-3-2.3c-.8.5-1.8.9-3.2.9-2.5 0-4.6-1.7-5.4-4l-3.5 2.7A9.3 9.3 0 0 0 12 21.3Z" />
      <path fill="#4285F4" d="M21 12.2c0-.6-.1-1.1-.2-1.5H12v3.9h5.4c-.3 1.1-.9 2-1.8 2.7l3 2.3c1.8-1.7 3.4-4.1 3.4-7.4Z" />
    </svg>
  );
}
