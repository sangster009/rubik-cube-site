import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  ariaHidden?: boolean;
}

/**
 * Fun logo: a 3×3 Rubik's cube face (nine colored squares).
 * Classic cube colors in a varied pattern.
 */
const GRID_3X3 = [
  ["fill-orange-500", "fill-slate-200", "fill-blue-500"],
  ["fill-red-500", "fill-emerald-500", "fill-yellow-400"],
  ["fill-blue-500", "fill-orange-500", "fill-red-500"],
];

export function Logo({ className, size = 24, ariaHidden = true }: LogoProps) {
  const pad = size * 0.06;
  const gap = size * 0.05;
  const cell = (size - pad * 2 - gap * 2) / 3;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden={ariaHidden}
    >
      {GRID_3X3.map((row, rowIndex) =>
        row.map((fillClass, colIndex) => (
          <rect
            key={`${rowIndex}-${colIndex}`}
            x={pad + colIndex * (cell + gap)}
            y={pad + rowIndex * (cell + gap)}
            width={cell}
            height={cell}
            rx={size * 0.05}
            className={fillClass}
          />
        ))
      )}
    </svg>
  );
}
