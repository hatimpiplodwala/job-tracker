"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

  // Supabase puts the recovery token in the URL hash and exchanges it for
  // a session via onAuthStateChange (event: "PASSWORD_RECOVERY"). We wait
  // for either that event or an existing session before letting the user
  // submit, so updateUser() has something to act on.
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
          <div className="card p-6">
            <p className="text-sm text-text-primary">
              Password updated. Taking you to your dashboard…
            </p>
          </div>
        ) : invalidLink ? (
          <div className="card p-6 space-y-4">
            <p className="text-sm text-text-primary">
              This reset link is invalid or expired. Request a new one.
            </p>
            <Link href="/forgot-password" className="btn-secondary w-full">
              Send a new link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-text-secondary mb-1.5"
              >
                New password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base"
                disabled={!ready}
              />
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
              <input
                id="confirm"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-base"
                disabled={!ready}
              />
            </div>

            {error && (
              <p className="text-sm text-status-rejected-text" role="alert">
                {error}
              </p>
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
