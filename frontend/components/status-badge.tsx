import type { Status } from "@/lib/types";

const STYLES: Record<Status, string> = {
  Applied:
    "bg-status-applied-bg text-status-applied-text border-status-applied-border",
  "Phone Screen":
    "bg-status-screen-bg text-status-screen-text border-status-screen-border",
  Interview:
    "bg-status-interview-bg text-status-interview-text border-status-interview-border",
  Offer:
    "bg-status-offer-bg text-status-offer-text border-status-offer-border",
  Rejected:
    "bg-status-rejected-bg text-status-rejected-text border-status-rejected-border",
  Withdrawn:
    "bg-status-withdrawn-bg text-status-withdrawn-text border-status-withdrawn-border",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
