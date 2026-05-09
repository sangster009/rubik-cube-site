import type { TpsSample } from "@/lib/analyze/types";

export function TpsSparkline({ series }: { series: TpsSample[] }) {
  if (series.length < 2) return null;
  const maxTps = Math.max(...series.map((s) => s.tps), 1);
  const maxT = series[series.length - 1].t;
  const w = 280;
  const h = 64;
  const pts = series.map((s, i) => {
    const x = (s.t / maxT) * w;
    const y = h - (s.tps / maxTps) * (h - 4) - 2;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full max-w-full text-cyan-400"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={pts.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
