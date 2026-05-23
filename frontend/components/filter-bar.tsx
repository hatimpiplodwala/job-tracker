"use client";

import { Filter, Search } from "lucide-react";
import { STATUSES, type Status } from "@/lib/types";

export type StatusFilter = Status | "All";

interface FilterBarProps {
  status: StatusFilter;
  search: string;
  onStatusChange: (status: StatusFilter) => void;
  onSearchChange: (search: string) => void;
}

export function FilterBar({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative sm:w-48">
        <Filter
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden
        />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className="input-base pl-9 pr-8 appearance-none"
          aria-label="Filter by status"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search company or role…"
          className="input-base pl-9"
          aria-label="Search applications"
        />
      </div>
    </div>
  );
}
