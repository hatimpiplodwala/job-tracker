"use client";

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
      <div className="sm:w-48">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className="input-base"
          aria-label="Filter by status"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search company or role…"
          className="input-base"
          aria-label="Search applications"
        />
      </div>
    </div>
  );
}
