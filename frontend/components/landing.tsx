import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Briefcase,
  Columns3,
  LogIn,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { BrandMark } from "@/components/brand";

export function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base text-text-primary">
      <AmbientGlow />
      <TopNav />
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Hero />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-brand-700/15 blur-3xl" />
      <div className="absolute -right-40 top-60 h-[400px] w-[400px] rounded-full bg-brand-500/10 blur-3xl" />
    </div>
  );
}

function TopNav() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark size="md" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">Applyd</span>
            <span className="text-[10px] uppercase tracking-wider text-text-muted">
              Job tracker
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Log in</span>
          </Link>
          <Link href="/signup" className="btn-primary">
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-700/40 bg-brand-700/10 px-3 py-1 text-xs font-medium text-brand-400 shadow-glow-brand-soft">
          <Sparkles className="h-3 w-3" />
          Built for the modern job hunt
        </span>
        <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Track every application.{" "}
          <span className="bg-gradient-to-b from-brand-400 to-brand-600 bg-clip-text text-transparent">
            Never lose a thread.
          </span>
        </h1>
        <p className="mt-6 text-balance text-base text-text-secondary sm:text-lg">
          A polished, focused workspace for the chaos of job searching.
          Pipeline, kanban, analytics, and follow-up reminders &mdash; in one
          place that actually feels good to open.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/signup" className="btn-primary px-5 py-2.5 text-base">
            Start tracking free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login" className="btn-secondary px-5 py-2.5 text-base">
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
        </div>
      </div>

      <div className="relative mt-16 sm:mt-20">
        <div
          aria-hidden
          className="absolute -inset-x-12 -top-12 bottom-0 -z-10 bg-gradient-to-b from-brand-500/10 to-transparent blur-2xl"
        />
        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto max-w-5xl rounded-xl border border-border-subtle bg-gloss-surface p-2 shadow-card-elevated">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      <div className="grid grid-cols-12 gap-2">
        {/* Mock sidebar */}
        <div className="col-span-3 hidden flex-col rounded-lg bg-gloss-sidebar p-3 shadow-sidebar sm:flex">
          <div className="flex items-center gap-2">
            <BrandMark size="sm" />
            <span className="text-xs font-semibold">Applyd</span>
          </div>
          <div className="divider-gradient mt-3" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <MiniStat label="Total" value="24" />
            <MiniStat label="Active" value="11" accent />
          </div>
          <div className="mt-3 rounded-md border border-border-subtle bg-gloss-elevated p-2 shadow-card">
            <p className="text-[9px] font-medium uppercase tracking-wider text-text-muted">
              Last 14 days
            </p>
            <p className="mt-0.5 text-base font-semibold">7</p>
            <div className="mt-1.5 flex h-6 items-end gap-[2px]">
              {[2, 1, 3, 0, 4, 2, 5, 1, 3, 2, 4, 6, 3, 5].map((n, i) => {
                const isToday = i === 13;
                const h = Math.max(15, (n / 6) * 100);
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-[1px] ${
                      isToday
                        ? "bg-gradient-to-t from-brand-500 to-brand-400 shadow-glow-brand-soft"
                        : i >= 7
                        ? "bg-gradient-to-t from-brand-600 to-brand-500/80"
                        : "bg-bg-hover"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Mock main content */}
        <div className="col-span-12 flex flex-col gap-2 sm:col-span-9">
          <div className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-deep p-1 shadow-inner-deep">
            <div className="flex gap-1">
              <div className="rounded bg-gloss-tab-active px-2 py-1 text-[10px] font-medium text-white shadow-tab-active">
                Table
              </div>
              <div className="rounded px-2 py-1 text-[10px] text-text-muted">
                Kanban
              </div>
              <div className="rounded px-2 py-1 text-[10px] text-text-muted">
                Analytics
              </div>
            </div>
            <div className="hidden gap-1 sm:flex">
              <div className="rounded border border-border-subtle bg-gloss-surface px-2 py-1 text-[10px]">
                Export
              </div>
              <div className="rounded bg-gloss-brand px-2 py-1 text-[10px] text-white shadow-btn-primary">
                + Add
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-border-subtle bg-gloss-surface shadow-card">
            <div className="grid grid-cols-12 gap-2 border-b border-border-subtle px-3 py-1.5 text-[9px] font-medium uppercase tracking-wider text-text-muted">
              <span className="col-span-3">Company</span>
              <span className="col-span-4">Role</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-3">Applied</span>
            </div>
            {SAMPLE_ROWS.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-2 border-b border-border-subtle/50 px-3 py-2 text-[11px] last:border-0"
              >
                <span className="col-span-3 truncate font-medium text-text-primary">
                  {row.company}
                </span>
                <span className="col-span-4 truncate text-text-secondary">
                  {row.role}
                </span>
                <span className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] ${row.statusCls}`}
                  >
                    <span className={`h-1 w-1 rounded-full ${row.dotCls}`} />
                    {row.status}
                  </span>
                </span>
                <span className="col-span-3 tabular-nums text-text-muted">
                  {row.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-md border px-2 py-1.5 ${
        accent
          ? "border-brand-700/60 bg-gloss-hero shadow-card-elevated"
          : "border-border-subtle bg-gloss-elevated shadow-card"
      }`}
    >
      <p
        className={`text-[8px] font-medium uppercase tracking-wider ${
          accent ? "text-brand-400" : "text-text-muted"
        }`}
      >
        {label}
      </p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

const SAMPLE_ROWS = [
  {
    company: "Vercel",
    role: "Senior Frontend Engineer",
    status: "Interview",
    statusCls:
      "border-status-interview-border bg-status-interview-bg text-status-interview-text",
    dotCls: "bg-status-interview-dot",
    date: "May 18",
  },
  {
    company: "Linear",
    role: "Product Engineer",
    status: "Phone Screen",
    statusCls:
      "border-status-screen-border bg-status-screen-bg text-status-screen-text",
    dotCls: "bg-status-screen-dot",
    date: "May 14",
  },
  {
    company: "Anthropic",
    role: "Software Engineer, ML",
    status: "Applied",
    statusCls:
      "border-status-applied-border bg-status-applied-bg text-status-applied-text",
    dotCls: "bg-status-applied-dot",
    date: "May 11",
  },
  {
    company: "Stripe",
    role: "Full-Stack Engineer",
    status: "Offer",
    statusCls:
      "border-status-offer-border bg-status-offer-bg text-status-offer-text",
    dotCls: "bg-status-offer-dot",
    date: "May 4",
  },
];

function Features() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Why Applyd</p>
        <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need. Nothing in the way.
        </h2>
        <p className="mt-4 text-text-secondary">
          Designed by someone who got tired of spreadsheets and over-engineered
          ATS clones.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        <FeatureCard
          icon={<Columns3 className="h-5 w-5" />}
          title="Drag-and-drop kanban"
          body="Move applications across stages with a flick. Optimistic updates keep things instant — no waiting on the network."
          preview={<KanbanPreview />}
        />
        <FeatureCard
          icon={<BarChart3 className="h-5 w-5" />}
          title="Pipeline analytics"
          body="See conversion from Applied through Offer, monthly velocity, and outcomes — separated so terminal states don't muddy your pipeline."
          preview={<FunnelPreview />}
        />
        <FeatureCard
          icon={<Bell className="h-5 w-5" />}
          title="Follow-up reminders"
          body="Set a follow-up date when you apply. Email nudges keep stale applications from disappearing into the void."
          preview={<ReminderPreview />}
        />
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  body,
  preview,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  preview: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-brand-700/50 bg-gloss-hero text-brand-400 shadow-inner-highlight">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent"
          />
          {icon}
        </div>
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{body}</p>
      <div className="mt-5 flex-1">{preview}</div>
    </div>
  );
}

function KanbanPreview() {
  const cols = [
    { name: "Applied", count: 8, dot: "bg-status-applied-dot" },
    { name: "Screen", count: 3, dot: "bg-status-screen-dot" },
    { name: "Offer", count: 1, dot: "bg-status-offer-dot" },
  ];
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {cols.map((c) => (
        <div
          key={c.name}
          className="rounded-md border border-border-subtle bg-bg-elevated/60 p-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[9px] font-medium text-text-secondary">
              <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
              {c.name}
            </span>
            <span className="text-[9px] tabular-nums text-text-muted">
              {c.count}
            </span>
          </div>
          <div className="mt-1.5 space-y-1">
            <div className="rounded border border-border-subtle bg-gloss-surface px-1.5 py-1 shadow-card">
              <div className="h-1 w-3/4 rounded bg-bg-hover" />
              <div className="mt-1 h-1 w-1/2 rounded bg-bg-hover/60" />
            </div>
            <div className="rounded border border-border-subtle bg-gloss-surface px-1.5 py-1 shadow-card">
              <div className="h-1 w-2/3 rounded bg-bg-hover" />
              <div className="mt-1 h-1 w-2/5 rounded bg-bg-hover/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FunnelPreview() {
  const stages = [
    { label: "Applied", pct: 100, n: 24 },
    { label: "Screen", pct: 50, n: 12 },
    { label: "Interview", pct: 29, n: 7 },
    { label: "Offer", pct: 8, n: 2 },
  ];
  return (
    <div className="space-y-1.5">
      {stages.map((s) => (
        <div key={s.label} className="flex items-center gap-2">
          <span className="w-14 text-[9px] text-text-muted">{s.label}</span>
          <div className="relative h-3 flex-1 overflow-hidden rounded bg-bg-deep shadow-inner-deep">
            <div
              className="relative h-full rounded bg-gradient-to-r from-brand-700 via-brand-500 to-brand-400 shadow-inner-highlight"
              style={{ width: `${s.pct}%` }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"
              />
            </div>
          </div>
          <span className="w-4 text-right text-[9px] tabular-nums text-text-secondary">
            {s.n}
          </span>
        </div>
      ))}
    </div>
  );
}

function ReminderPreview() {
  return (
    <div className="space-y-2">
      <div className="rounded-md border border-status-screen-border bg-status-screen-bg/60 p-2.5 shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-status-screen-text">
            Follow up today
          </span>
          <Bell className="h-3 w-3 text-status-screen-text" />
        </div>
        <p className="mt-1 text-[11px] font-medium text-text-primary">
          Vercel &middot; Senior Frontend Engineer
        </p>
        <p className="text-[10px] text-text-muted">Applied 5 days ago</p>
      </div>
      <div className="rounded-md border border-border-subtle bg-gloss-elevated p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-muted">In 3 days</span>
          <span className="text-[10px] tabular-nums text-text-muted">
            May 26
          </span>
        </div>
        <p className="mt-1 text-[11px] text-text-secondary">
          Linear &middot; Product Engineer
        </p>
      </div>
    </div>
  );
}

function CallToAction() {
  return (
    <section className="relative pb-24 sm:pb-32">
      <div className="relative overflow-hidden rounded-2xl border border-brand-700/40 bg-gloss-hero p-8 text-center shadow-card-elevated sm:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-3xl"
        />
        <div className="relative">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-gloss-brand shadow-brand-mark">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Bring order to your job search.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">
            Free while in beta. No card, no nonsense.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary px-5 py-2.5 text-base">
              Create your tracker
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="btn-ghost text-sm">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border-subtle">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-text-muted sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Briefcase className="h-3.5 w-3.5" />
          <span>Applyd &middot; Built for job seekers who like clean tools.</span>
        </div>
        <span>&copy; {new Date().getFullYear()} Applyd</span>
      </div>
    </footer>
  );
}
