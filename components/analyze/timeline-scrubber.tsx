"use client";

import { useMemo, useState } from "react";
import type { AnalysisResult, TimelineMarker } from "@/lib/analyze/types";
import { cn } from "@/lib/utils";

export function TimelineScrubber({
  analysis,
  className,
}: {
  analysis: AnalysisResult;
  className?: string;
}) {
  const total = analysis.durationSec;
  const [playhead, setPlayhead] = useState(0);

  const markersByT = useMemo(() => {
    const m = new Map<number, TimelineMarker[]>();
    for (const mk of analysis.timeline) {
      const list = m.get(mk.t) ?? [];
      list.push(mk);
      m.set(mk.t, list);
    }
    return m;
  }, [analysis.timeline]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>0.00s</span>
        <span className="font-mono text-zinc-200">{playhead.toFixed(2)}s</span>
        <span>{total.toFixed(2)}s</span>
      </div>

      <div
        className="relative h-14 touch-none rounded-xl bg-zinc-900/80 ring-1 ring-zinc-800"
        onPointerDown={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - r.left;
          const t = (x / r.width) * total;
          setPlayhead(Math.max(0, Math.min(total, t)));
        }}
        onPointerMove={(e) => {
          if (e.buttons !== 1) return;
          const r = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - r.left;
          const t = (x / r.width) * total;
          setPlayhead(Math.max(0, Math.min(total, t)));
        }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={playhead}
        aria-label="Solve timeline scrubber"
      >
        {/* Pause heatmap */}
        {analysis.pauseHeatmap.map((b, i) => (
          <div
            key={`p-${i}`}
            className="absolute bottom-0 top-0 bg-violet-500/35"
            style={{
              left: `${(b.t0 / total) * 100}%`,
              width: `${((b.t1 - b.t0) / total) * 100}%`,
            }}
          />
        ))}
        {/* Inefficiency heatmap */}
        {analysis.inefficiencyHeatmap.map((b, i) => (
          <div
            key={`i-${i}`}
            className="absolute bottom-0 top-0 bg-rose-500/25"
            style={{
              left: `${(b.t0 / total) * 100}%`,
              width: `${((b.t1 - b.t0) / total) * 100}%`,
            }}
          />
        ))}

        {/* Playhead */}
        <div
          className="absolute bottom-0 top-0 w-0.5 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
          style={{ left: `${(playhead / total) * 100}%` }}
        />

        {/* Ticks */}
        {analysis.timeline.map((mk, i) => (
          <button
            key={`${mk.t}-${i}`}
            type="button"
            className={cn(
              "absolute top-1 size-2 -translate-x-1/2 rounded-full ring-2 ring-zinc-950",
              mk.kind === "highlight" && "bg-cyan-400",
              mk.kind === "pause" && "bg-violet-400",
              mk.kind === "regrip" && "bg-amber-400",
              mk.kind === "rotation" && "bg-orange-400",
              mk.kind === "inefficiency" && "bg-rose-500",
              mk.kind === "stage" && "bg-zinc-500"
            )}
            style={{ left: `${(mk.t / total) * 100}%` }}
            title={markersByT.get(mk.t)?.map((x) => x.label).join(" · ")}
            onClick={() => setPlayhead(mk.t)}
          />
        ))}
      </div>

      <p className="text-xs text-zinc-500">
        Violet: pause load · Rose: inefficiency proxy · Cyan: playhead (thumb scrub)
      </p>
    </div>
  );
}
