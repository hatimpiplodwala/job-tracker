"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, LogOut, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ACTIVE_STATUSES, type Application, type Status } from "@/lib/types";
import { BrandMark } from "@/components/brand";
import { StatusDot } from "@/components/status-badge";

interface StatsSidebarProps {
  email: string;
  applications: Application[];
}

const ACTIVE_GROUP: Status[] = ["Applied", "Phone Screen", "Interview"];
const CLOSED_GROUP: Status[] = ["Offer", "Rejected", "Withdrawn"];

const DAYS = 14;

export function StatsSidebar({ email, applications }: StatsSidebarProps) {
  const router = useRouter();

  const total = applications.length;
  const active = applications.filter((a) =>
    ACTIVE_STATUSES.includes(a.status)
  ).length;

  const breakdown = useMemo(() => {
    const counts: Record<Status, number> = {
      Applied: 0,
      "Phone Screen": 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      Withdrawn: 0,
    };
    for (const a of applications) counts[a.status]++;
    return counts;
  }, [applications]);

  // 14-day activity sparkline + week-over-week delta.
  // Bucket by local date so the bars match "today" in the user's TZ.
  const activity = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const buckets: { key: string; count: number }[] = [];
    const idx = new Map<string, number>();
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = isoLocal(d);
      idx.set(key, buckets.length);
      buckets.push({ key, count: 0 });
    }

    for (const a of applications) {
      const key = a.date_applied.slice(0, 10);
      const i = idx.get(key);
      if (i !== undefined) buckets[i].count++;
    }

    const thisWeek = buckets.slice(7).reduce((s, b) => s + b.count, 0);
    const lastWeek = buckets.slice(0, 7).reduce((s, b) => s + b.count, 0);
    const max = Math.max(1, ...buckets.map((b) => b.count));

    return { buckets, thisWeek, lastWeek, max };
  }, [applications]);

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
            aria-label="Log out"
            className="inline-flex items-center justify-center rounded-md border border-border-subtle p-1.5 text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Desktop: vertical sidebar */}
      <aside className="hidden h-screen w-64 flex-col overflow-y-auto border-r border-border-subtle bg-gloss-sidebar px-5 py-6 shadow-sidebar md:flex md:sticky md:top-0">
        <div className="flex items-center gap-2.5">
          <BrandMark size="md" />
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold tracking-tight text-text-primary">
              Applyd
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">
              Job tracker
            </p>
          </div>
        </div>

        <div className="divider-gradient mt-6" />

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Stat
            label="Total"
            value={total}
            icon={<Briefcase className="h-3.5 w-3.5" />}
          />
          <Stat
            label="Active"
            value={active}
            accent
            icon={<Zap className="h-3.5 w-3.5" />}
          />
        </div>

        {total > 0 && (
          <ActivityCard
            buckets={activity.buckets}
            thisWeek={activity.thisWeek}
            lastWeek={activity.lastWeek}
            max={activity.max}
          />
        )}

        {total > 0 && (
          <>
            <div className="divider-gradient mt-6" />
            <div className="mt-6 space-y-4">
              <StatusGroup
                label="Active"
                statuses={ACTIVE_GROUP}
                counts={breakdown}
              />
              <StatusGroup
                label="Closed"
                statuses={CLOSED_GROUP}
                counts={breakdown}
              />
            </div>
          </>
        )}

        <div className="mt-auto">
          <div className="divider-gradient mb-4" />
          <div className="mb-3 space-y-0.5">
            <p className="eyebrow">Signed in</p>
            <p className="truncate text-xs text-text-secondary" title={email}>
              {email}
            </p>
          </div>
          <button onClick={handleLogout} className="btn-secondary w-full">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

function ActivityCard({
  buckets,
  thisWeek,
  lastWeek,
  max,
}: {
  buckets: { key: string; count: number }[];
  thisWeek: number;
  lastWeek: number;
  max: number;
}) {
  const delta = thisWeek - lastWeek;
  const noTrend = thisWeek === 0 && lastWeek === 0;
  const TrendIcon = delta >= 0 ? TrendingUp : TrendingDown;
  const trendColor =
    noTrend
      ? "text-text-muted"
      : delta > 0
      ? "text-status-offer-text"
      : delta < 0
      ? "text-status-rejected-text"
      : "text-text-muted";

  return (
    <div className="relative mt-6 overflow-hidden rounded-lg border border-border-subtle bg-gloss-elevated px-3 py-3 shadow-card">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <div className="flex items-center justify-between">
        <p className="eyebrow">Last 14 days</p>
        {!noTrend && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium ${trendColor}`}
            title={`Last week: ${lastWeek}`}
          >
            <TrendIcon className="h-3 w-3" />
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
        )}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-xl font-semibold tabular-nums text-text-primary">
          {thisWeek}
        </p>
        <p className="text-[11px] text-text-muted">this week</p>
      </div>
      <div
        className="mt-3 flex h-10 items-end gap-[3px]"
        role="img"
        aria-label={`Daily applications over the last ${DAYS} days`}
      >
        {buckets.map((b, i) => {
          const isThisWeek = i >= 7;
          const isToday = i === buckets.length - 1;
          const height = b.count === 0 ? 6 : Math.max(10, (b.count / max) * 100);
          const cls = isToday
            ? "bg-gradient-to-t from-brand-500 to-brand-400 shadow-glow-brand-soft ring-1 ring-brand-400/40"
            : isThisWeek
            ? "bg-gradient-to-t from-brand-600 to-brand-500/90 shadow-inner-highlight"
            : "bg-bg-hover";
          return (
            <div
              key={b.key}
              className={`flex-1 rounded-sm transition-all ${cls}`}
              style={{ height: `${height}%` }}
              title={`${b.key}: ${b.count}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function StatusGroup({
  label,
  statuses,
  counts,
}: {
  label: string;
  statuses: Status[];
  counts: Record<Status, number>;
}) {
  const subtotal = statuses.reduce((s, st) => s + counts[st], 0);
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <p className="eyebrow">{label}</p>
        <span className="text-[11px] tabular-nums text-text-muted">
          {subtotal}
        </span>
      </div>
      <ul className="space-y-0.5">
        {statuses.map((s) => (
          <li
            key={s}
            className="flex items-center justify-between rounded px-2 py-1 text-xs transition-colors hover:bg-bg-hover"
          >
            <span className="flex items-center gap-2 text-text-secondary">
              <StatusDot status={s} />
              {s}
            </span>
            <span className="tabular-nums text-text-muted">{counts[s]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: number;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border px-3 py-3 transition-all ${
        accent
          ? "border-brand-700/60 bg-gloss-hero shadow-card-elevated hover:shadow-glow-brand-soft"
          : "border-border-subtle bg-gloss-elevated shadow-card hover:border-border hover:shadow-card-hover"
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
          accent ? "via-brand-400/40" : "via-white/10"
        }`}
      />
      <div
        className={`flex items-center gap-1.5 ${
          accent ? "text-brand-400" : "text-text-muted"
        }`}
      >
        {icon}
        <p className="eyebrow">{label}</p>
      </div>
      <p
        className={`mt-1 text-2xl font-semibold tabular-nums ${
          accent ? "text-text-primary" : "text-text-primary"
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
    <div className="flex items-center gap-1 rounded-md border border-border-subtle bg-gloss-elevated px-2 py-1 shadow-inner-highlight">
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

function isoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
