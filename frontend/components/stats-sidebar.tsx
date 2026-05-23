"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACTIVE_STATUSES, type Application } from "@/lib/types";
import { BrandMark } from "@/components/brand";

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
    <>
      {/* Mobile: compact top bar */}
      <header className="flex w-full items-center justify-between gap-3 border-b border-border-subtle bg-bg-surface px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <BrandMark size="sm" />
          <h1 className="text-sm font-semibold tracking-tight">Applyd</h1>
        </div>
        <div className="flex items-center gap-2">
          <InlineStat label="Total" value={total} />
          <InlineStat label="Active" value={active} accent />
          <button
            onClick={handleLogout}
            className="rounded-md border border-border-subtle px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Desktop: vertical sidebar */}
      <aside className="hidden h-screen w-60 flex-col border-r border-border-subtle bg-bg-surface px-5 py-6 md:flex md:sticky md:top-0">
        <div className="flex items-center gap-2">
          <BrandMark size="sm" />
          <h1 className="text-sm font-semibold tracking-tight">Applyd</h1>
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
    </>
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

function InlineStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-border-subtle bg-bg-elevated px-2 py-1">
      <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
        {label}
      </span>
      <span
        className={`text-sm font-semibold tabular-nums ${
          accent ? "text-brand-400" : "text-text-primary"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
