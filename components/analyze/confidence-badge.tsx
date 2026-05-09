import { cn } from "@/lib/utils";

export function ConfidenceBadge({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const tone =
    pct >= 75 ? "text-emerald-400 bg-emerald-400/15" : pct >= 55 ? "text-amber-400 bg-amber-400/15" : "text-rose-400 bg-rose-400/15";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tabular-nums",
        tone,
        className
      )}
    >
      conf. {pct}%
    </span>
  );
}
