"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Lock, Mail, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BrandMark } from "@/components/brand";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark size="lg" />
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Applyd</h1>
          <p className="mt-2 text-sm text-text-secondary">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4 shadow-card">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base pl-9"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-text-secondary mb-1.5">
              Password
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
              />
            </div>
            <p className="mt-1 text-xs text-text-muted">At least 6 characters.</p>
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

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <UserPlus className="h-4 w-4" />
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-400 hover:text-brand-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
