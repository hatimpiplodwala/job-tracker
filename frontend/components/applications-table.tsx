"use client";

import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { FilterBar, type StatusFilter } from "@/components/filter-bar";
import type { Application } from "@/lib/types";

interface ApplicationsTableProps {
  applications: Application[];
  loading: boolean;
  onEdit: (app: Application) => void;
}

type SortKey = "date_applied" | "company" | "role" | "status";
type SortDir = "asc" | "desc";

export function ApplicationsTable({
  applications,
  loading,
  onEdit,
}: ApplicationsTableProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date_applied");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = applications.filter((a) => {
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      if (
        q &&
        !a.company.toLowerCase().includes(q) &&
        !a.role.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    rows = [...rows].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [applications, statusFilter, search, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date_applied" ? "desc" : "asc");
    }
  }

  return (
    <div className="space-y-4">
      <FilterBar
        status={statusFilter}
        search={search}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearch}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-elevated text-left text-xs uppercase tracking-wider text-text-muted">
                <SortableHeader
                  label="Company"
                  active={sortKey === "company"}
                  dir={sortDir}
                  onClick={() => toggleSort("company")}
                />
                <SortableHeader
                  label="Role"
                  active={sortKey === "role"}
                  dir={sortDir}
                  onClick={() => toggleSort("role")}
                />
                <SortableHeader
                  label="Status"
                  active={sortKey === "status"}
                  dir={sortDir}
                  onClick={() => toggleSort("status")}
                />
                <SortableHeader
                  label="Date applied"
                  active={sortKey === "date_applied"}
                  dir={sortDir}
                  onClick={() => toggleSort("date_applied")}
                />
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Salary</th>
                <th className="px-4 py-3 font-medium">Link</th>
                <th className="px-4 py-3" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-text-muted"
                  >
                    {applications.length === 0
                      ? "No applications yet. Add your first one."
                      : "No applications match your filters."}
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <Row key={a.id} app={a} onEdit={() => onEdit(a)} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-text-muted">
          Showing {filtered.length} of {applications.length}
        </p>
      )}
    </div>
  );
}

function SortableHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <th className="px-4 py-3 font-medium">
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 transition-colors ${
          active ? "text-text-primary" : "hover:text-text-secondary"
        }`}
      >
        {label}
        <span aria-hidden className="text-text-muted">
          {active ? (dir === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </button>
    </th>
  );
}

function Row({ app, onEdit }: { app: Application; onEdit: () => void }) {
  return (
    <tr className="group border-b border-border-subtle last:border-0 hover:bg-bg-hover">
      <td className="px-4 py-3 font-medium text-text-primary">{app.company}</td>
      <td className="px-4 py-3 text-text-secondary">{app.role}</td>
      <td className="px-4 py-3">
        <StatusBadge status={app.status} />
      </td>
      <td className="px-4 py-3 tabular-nums text-text-secondary">
        {formatDate(app.date_applied)}
      </td>
      <td className="px-4 py-3 text-text-secondary">{app.location ?? "—"}</td>
      <td className="px-4 py-3 text-text-secondary">
        {app.salary_range ?? "—"}
      </td>
      <td className="px-4 py-3">
        {app.job_url ? (
          <a
            href={app.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-500"
          >
            View ↗
          </a>
        ) : (
          <span className="text-text-muted">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={onEdit}
          className="btn-ghost opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-border-subtle last:border-0">
          {Array.from({ length: 8 }).map((__, j) => (
            <td key={j} className="px-4 py-4">
              <div className="h-3 w-full max-w-[120px] animate-pulse rounded bg-bg-hover" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-CA");
  } catch {
    return iso;
  }
}
