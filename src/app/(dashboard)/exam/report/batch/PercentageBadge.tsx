interface PercentageBadgeProps {
  percentage: number;
}

export function PercentageBadge({ percentage }: PercentageBadgeProps) {
  const tone =
    percentage >= 75
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
      : percentage >= 40
        ? "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
        : "bg-rose-50 text-rose-700 ring-1 ring-rose-100";

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-black ${tone}`}>
      {percentage.toFixed(1)}%
    </span>
  );
}