"use client";

import { useMemo } from "react";
import { BarChart3, LineChart, TrendingUp } from "lucide-react";
import { StatusDot } from "@/components/status-badge";
import { STATUSES, type Application, type Status } from "@/lib/types";

interface AnalyticsViewProps {
  applications: Application[];
}

// Funnel order: not all statuses are stages (Rejected/Withdrawn are terminal).
const FUNNEL: Status[] = ["Applied", "Phone Screen", "Interview", "Offer"];

// Inclusion logic: a "later" stage implies you passed all "earlier" stages.
// e.g. "Offer" counts in Applied + Phone Screen + Interview + Offer.
// This makes the funnel monotonically non-increasing.
const STAGE_ORDER: Record<Status, number> = {
  Applied: 0,
  "Phone Screen": 1,
  Interview: 2,
  Offer: 3,
  Rejected: -1, // doesn't advance the funnel; counted at last reached stage via notes/inference
  Withdrawn: -1,
};

const STATUS_CARD: Record<Status, string> = {
  Applied: "bg-status-applied-bg border-status-applied-border",
  "Phone Screen": "bg-status-screen-bg border-status-screen-border",
  Interview: "bg-status-interview-bg border-status-interview-border",
  Offer: "bg-status-offer-bg border-status-offer-border",
  Rejected: "bg-status-rejected-bg border-status-rejected-border",
  Withdrawn: "bg-bg-elevated border-border-subtle",
};

export function AnalyticsView({ applications }: AnalyticsViewProps) {
  const counts = useMemo(() => {
    const c: Record<Status, number> = {
      Applied: 0,
      "Phone Screen": 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      Withdrawn: 0,
    };
    for (const app of applications) c[app.status]++;
    return c;
  }, [applications]);

  // Funnel counts: each stage = (apps currently at >= that stage in the pipeline).
  // Rejected/Withdrawn don't add to the funnel beyond Applied (we can't know
  // how far they got without per-stage history).
  const funnel = useMemo(() => {
    const totals: Record<string, number> = {
      Applied: applications.length,
      "Phone Screen": 0,
      Interview: 0,
      Offer: 0,
    };
    for (const app of applications) {
      const ord = STAGE_ORDER[app.status];
      if (ord < 0) continue;
      for (let i = 1; i <= ord; i++) {
        totals[FUNNEL[i]]++;
      }
    }
    return FUNNEL.map((stage, i) => {
      const count = totals[stage];
      const prev = i === 0 ? count : totals[FUNNEL[i - 1]];
      const conversion = prev > 0 ? Math.round((count / prev) * 100) : 0;
      return { stage, count, conversion, isFirst: i === 0 };
    });
  }, [applications]);

  const monthly = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString(undefined, { month: "short" });
      months.push({ key, label, count: 0 });
    }
    const idx = new Map(months.map((m, i) => [m.key, i]));
    for (const app of applications) {
      const key = app.date_applied.slice(0, 7);
      const i = idx.get(key);
      if (i !== undefined) months[i].count++;
    }
    return months;
  }, [applications]);

  const monthlyMax = Math.max(1, ...monthly.map((m) => m.count));
  const funnelMax = Math.max(1, ...funnel.map((f) => f.count));

  const responseRate = useMemo(() => {
    if (applications.length === 0) return 0;
    const responded = applications.filter(
      (a) => a.status !== "Applied"
    ).length;
    return Math.round((responded / applications.length) * 100);
  }, [applications]);

  if (applications.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center gap-3 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-text-muted">
          <LineChart className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">No data yet</p>
          <p className="mt-1 text-xs text-text-muted">
            Add some applications to see your analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STATUSES.map((s) => (
          <div
            key={s}
            className={`rounded-md border p-3 transition-transform hover:-translate-y-0.5 ${STATUS_CARD[s]}`}
          >
            <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <StatusDot status={s} />
              {s}
            </div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">
              {counts[s]}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <header className="mb-4 flex items-baseline justify-between">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
              <TrendingUp className="h-4 w-4 text-brand-400" />
              Funnel
            </h3>
            <span className="text-xs text-text-muted">
              Response rate:{" "}
              <span className="font-medium tabular-nums text-text-secondary">
                {responseRate}%
              </span>
            </span>
          </header>
          <div className="space-y-3">
            {funnel.map((row) => {
              const width = (row.count / funnelMax) * 100;
              return (
                <div key={row.stage}>
                  <div className="mb-1 flex items-baseline justify-between text-xs">
                    <span className="font-medium text-text-primary">
                      {row.stage}
                    </span>
                    <span className="tabular-nums text-text-muted">
                      {row.count}
                      {!row.isFirst && (
                        <span className="ml-2 text-text-secondary">
                          ({row.conversion}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-6 overflow-hidden rounded bg-bg-elevated">
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-brand-500 transition-all duration-500"
                      style={{ width: `${Math.max(width, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[11px] text-text-muted">
            Each stage shows applications currently at or beyond it. Conversion
            is from the previous stage.
          </p>
        </section>

        <section className="card p-5">
          <header className="mb-4">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
              <BarChart3 className="h-4 w-4 text-brand-400" />
              Applications per month
            </h3>
            <p className="mt-1 text-xs text-text-muted">Last 6 months</p>
          </header>
          <div className="flex h-40 items-end gap-2">
            {monthly.map((m) => {
              const height = (m.count / monthlyMax) * 100;
              return (
                <div
                  key={m.key}
                  className="group flex flex-1 flex-col items-center gap-1"
                >
                  <div className="text-[10px] font-medium text-text-secondary">
                    {m.count}
                  </div>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-brand-600/70 to-brand-500/90 transition-all duration-300 group-hover:from-brand-600 group-hover:to-brand-400"
                      style={{ height: `${m.count === 0 ? 2 : height}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-text-muted">{m.label}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
