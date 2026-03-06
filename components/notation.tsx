import { cn } from "@/lib/utils";

/**
 * Renders Rubik's cube algorithm notation (e.g. R U R' U') with readable formatting.
 * Splits on spaces and styles prime (') and double (2) moves.
 */
export function Notation({
  alg,
  className,
}: {
  alg: string;
  className?: string;
}) {
  const parts = alg.trim().split(/\s+/).filter(Boolean);
  return (
    <code
      className={cn(
        "inline-flex flex-wrap gap-1 rounded bg-muted px-2 py-1 font-mono text-sm",
        className
      )}
      aria-label={`Algorithm: ${alg}`}
    >
      {parts.map((move, i) => (
        <span key={i} className="tabular-nums">
          {move}
        </span>
      ))}
    </code>
  );
}
