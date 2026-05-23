"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Lock, Send, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BrandMark } from "@/components/brand";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });

    const timer = setTimeout(() => {
      if (!cancelled) {
        setReady((r) => {
          if (!r) setInvalidLink(true);
          return r;
        });
      }
    }, 2000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1200);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark size="lg" />
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Applyd</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Choose a new password
          </p>
        </div>

        {done ? (
          <div className="card p-6 shadow-card animate-fade-in">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-status-offer-border bg-status-offer-bg text-status-offer-text">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm text-text-primary">
                Password updated. Taking you to your dashboard…
              </p>
            </div>
          </div>
        ) : invalidLink ? (
          <div className="card p-6 space-y-4 shadow-card">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-status-rejected-border bg-status-rejected-bg text-status-rejected-text">
                <XCircle className="h-6 w-6" />
              </div>
              <p className="text-sm text-text-primary">
                This reset link is invalid or expired. Request a new one.
              </p>
            </div>
            <Link href="/forgot-password" className="btn-secondary w-full">
              <Send className="h-4 w-4" />
              Send a new link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 space-y-4 shadow-card">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-text-secondary mb-1.5"
              >
                New password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-base pl-9"
                  disabled={!ready}
                />
              </div>
              <p className="mt-1 text-xs text-text-muted">
                At least 6 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-xs font-medium text-text-secondary mb-1.5"
              >
                Confirm new password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
                <input
                  id="confirm"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input-base pl-9"
                  disabled={!ready}
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md border border-status-rejected-border bg-status-rejected-bg px-3 py-2 text-sm text-status-rejected-text"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !ready}
              className="btn-primary w-full"
            >
              {!ready
                ? "Verifying link…"
                : loading
                ? "Updating…"
                : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
