"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACTIVE_STATUSES, type Application } from "@/lib/types";

interface StatsSidebarProps {
  email: string;
  applications: Application[];
}

export function StatsSidebar({ email, applications }: StatsSidebarProps) {
  const router = useRouter();

  const total = applications.length;
  const active = applications.filter((a) =>
    ACTIVE_STATUSES.includes(a.status)
  ).length;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border-subtle bg-bg-surface px-5 py-6">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-sm font-semibold">
          J
        </div>
        <h1 className="text-sm font-semibold tracking-tight">Job Tracker</h1>
      </div>

      <div className="mt-8 space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Signed in
        </p>
        <p className="truncate text-sm text-text-primary" title={email}>
          {email}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <Stat label="Total" value={total} />
        <Stat label="Active" value={active} accent />
      </div>

      <div className="mt-auto">
        <button onClick={handleLogout} className="btn-secondary w-full">
          Log out
        </button>
      </div>
    </aside>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-elevated px-3 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-semibold tabular-nums ${
          accent ? "text-brand-400" : "text-text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
