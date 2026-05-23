"use client";

import { useMemo } from "react";
import { BarChart3, LineChart, Target, TrendingUp } from "lucide-react";
import { StatusDot } from "@/components/status-badge";
import { STATUSES, type Application, type Status } from "@/lib/types";

interface AnalyticsViewProps {
  applications: Application[];
}

// Pipeline stages — Rejected/Withdrawn are terminal outcomes, not stages.
const PIPELINE: Status[] = ["Applied", "Phone Screen", "Interview", "Offer"];

// "Reaching" a later stage implies passing all earlier ones, so an app
// in Interview counts toward Applied + Phone Screen + Interview.
// Terminal statuses don't count toward any pipeline stage at all — they
// live in the Outcomes panel instead.
const STAGE_ORDER: Record<Status, number> = {
  Applied: 0,
  "Phone Screen": 1,
  Interview: 2,
  Offer: 3,
  Rejected: -1,
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

const MONTH_LONG = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});
const MONTH_SHORT = new Intl.DateTimeFormat(undefined, { month: "short" });

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

  const funnel = useMemo(() => {
    const totals: Record<string, number> = {
      Applied: 0,
      "Phone Screen": 0,
      Interview: 0,
      Offer: 0,
    };
    for (const app of applications) {
      const ord = STAGE_ORDER[app.status];
      if (ord < 0) continue;
      for (let i = 0; i <= ord; i++) {
        totals[PIPELINE[i]]++;
      }
    }
    return PIPELINE.map((stage, i) => {
      const count = totals[stage];
      const prevStage = i === 0 ? null : PIPELINE[i - 1];
      const prev = prevStage ? totals[prevStage] : count;
      const conversion = prev > 0 ? Math.round((count / prev) * 100) : 0;
      return { stage, count, conversion, prevStage };
    });
  }, [applications]);

  const outcomes = useMemo(() => {
    const total = applications.length;
    const stillOpen =
      counts.Applied + counts["Phone Screen"] + counts.Interview;
    const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
    return {
      offerRate: pct(counts.Offer),
      total,
      rows: [
        {
          key: "Offer" as const,
          label: "Offers",
          count: counts.Offer,
          pct: pct(counts.Offer),
          dot: "bg-status-offer-dot",
          accent: "text-status-offer-text",
        },
        {
          key: "Rejected" as const,
          label: "Rejected",
          count: counts.Rejected,
          pct: pct(counts.Rejected),
          dot: "bg-status-rejected-dot",
          accent: "text-status-rejected-text",
        },
        {
          key: "Withdrawn" as const,
          label: "Withdrawn",
          count: counts.Withdrawn,
          pct: pct(counts.Withdrawn),
          dot: "bg-status-withdrawn-dot",
          accent: "text-text-secondary",
        },
        {
          key: "Open" as const,
          label: "Still open",
          count: stillOpen,
          pct: pct(stillOpen),
          dot: "bg-brand-400",
          accent: "text-brand-400",
        },
      ],
    };
  }, [applications.length, counts]);

  const monthly = useMemo(() => {
    const now = new Date();
    const months: {
      key: string;
      label: string;
      fullLabel: string;
      year: number;
      count: number;
    }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push({
        key,
        label: MONTH_SHORT.format(d),
        fullLabel: MONTH_LONG.format(d),
        year: d.getFullYear(),
        count: 0,
      });
    }
    const idx = new Map(months.map((m, i) => [m.key, i]));
    for (const app of applications) {
      if (!app.date_applied || app.date_applied.length < 7) continue;
      const key = app.date_applied.slice(0, 7);
      const i = idx.get(key);
      if (i !== undefined) months[i].count++;
    }
    return months;
  }, [applications]);

  const monthlyMax = Math.max(1, ...monthly.map((m) => m.count));
  const funnelMax = Math.max(1, ...funnel.map((f) => f.count));

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
            className={`relative overflow-hidden rounded-md border p-3 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover ${STATUS_CARD[s]}`}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
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
          <header className="mb-4 flex items-baseline justify-between gap-3">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
              <TrendingUp className="h-4 w-4 text-brand-400" />
              Pipeline
            </h3>
            <p className="text-[11px] text-text-muted">
              Active apps by stage reached
            </p>
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
                      {row.prevStage && row.count > 0 && (
                        <span className="ml-2 text-text-secondary">
                          ({row.conversion}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <div
                    className="relative h-6 overflow-hidden rounded bg-bg-base shadow-inner-deep"
                    title={
                      row.prevStage
                        ? `${row.stage}: ${row.count} — ${row.conversion}% from ${row.prevStage}`
                        : `${row.stage}: ${row.count}`
                    }
                  >
                    {row.count > 0 && (
                      <div
                        className="relative h-full overflow-hidden rounded bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500"
                        style={{ width: `${Math.max(width, 3)}%` }}
                      >
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[11px] text-text-muted">
            Each stage counts apps currently at or beyond it. Rejected and
            withdrawn apps live in <span className="text-text-secondary">Outcomes</span>, not here.
          </p>
        </section>

        <section className="card p-5">
          <header className="mb-4 flex items-baseline justify-between gap-3">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Target className="h-4 w-4 text-status-offer-text" />
              Outcomes
            </h3>
            <span
              className="text-[11px] text-text-muted"
              title="Offers ÷ total applications"
            >
              Offer rate{" "}
              <span className="font-semibold tabular-nums text-status-offer-text">
                {outcomes.offerRate}%
              </span>
            </span>
          </header>
          <ul className="space-y-2">
            {outcomes.rows.map((row, i) => {
              const isLast = i === outcomes.rows.length - 1;
              const width = outcomes.total > 0 ? (row.count / outcomes.total) * 100 : 0;
              return (
                <li
                  key={row.key}
                  className={isLast ? "border-t border-border-subtle pt-3" : ""}
                >
                  <div className="mb-1 flex items-baseline justify-between text-xs">
                    <span className="inline-flex items-center gap-2 font-medium text-text-primary">
                      <span className={`h-2 w-2 rounded-full ${row.dot}`} />
                      {row.label}
                    </span>
                    <span className="tabular-nums text-text-muted">
                      <span className={`font-semibold ${row.accent}`}>
                        {row.count}
                      </span>
                      <span className="ml-2 text-text-secondary">
                        ({row.pct}%)
                      </span>
                    </span>
                  </div>
                  <div
                    className="relative h-1.5 overflow-hidden rounded-full bg-bg-base shadow-inner-deep"
                    title={`${row.label}: ${row.count} of ${outcomes.total} (${row.pct}%)`}
                  >
                    {row.count > 0 && (
                      <div
                        className={`h-full rounded-full ${row.dot} transition-all duration-500`}
                        style={{ width: `${Math.max(width, 2)}%` }}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[11px] text-text-muted">
            Percentages of total applications ({outcomes.total}).
          </p>
        </section>
      </div>

      <section className="card p-5">
        <header className="mb-4 flex items-baseline justify-between gap-3">
          <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
            <BarChart3 className="h-4 w-4 text-brand-400" />
            Applications per month
          </h3>
          <p className="text-[11px] text-text-muted">Last 6 months</p>
        </header>
        <div className="flex h-40 items-end gap-2">
          {monthly.map((m, i) => {
            const height = (m.count / monthlyMax) * 100;
            const prevYear = i > 0 ? monthly[i - 1].year : m.year;
            const showYear = i === 0 || m.year !== prevYear;
            return (
              <div
                key={m.key}
                className="group flex flex-1 flex-col items-center gap-1"
                title={`${m.fullLabel}: ${m.count} ${
                  m.count === 1 ? "application" : "applications"
                }`}
              >
                <div className="text-[10px] font-medium tabular-nums text-text-secondary">
                  {m.count}
                </div>
                <div className="flex w-full flex-1 items-end">
                  {m.count === 0 ? (
                    <div className="h-[3px] w-full rounded-sm bg-bg-elevated" />
                  ) : (
                    <div
                      className="relative w-full overflow-hidden rounded-t bg-gradient-to-t from-brand-700 to-brand-500 shadow-inner-highlight transition-all duration-300 group-hover:from-brand-600 group-hover:to-brand-400"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    >
                      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-text-muted">
                  {m.label}
                  {showYear && (
                    <span className="ml-0.5 text-text-muted/70">
                      ’{String(m.year).slice(-2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
