interface ChecklistIconProps {
  className?: string;
}

export function ChecklistIcon({ className }: ChecklistIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="m3 17 2 2 4-4" />
      <path d="m3 7 2 2 4-4" />
      <path d="M13 6h8" />
      <path d="M13 12h8" />
      <path d="M13 18h8" />
    </svg>
  );
}

interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
}

const BOX_SIZES = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-11 w-11",
};

const ICON_SIZES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function BrandMark({ size = "sm" }: BrandMarkProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-md bg-brand-600 text-white ${BOX_SIZES[size]}`}
    >
      <ChecklistIcon className={ICON_SIZES[size]} />
    </div>
  );
}
