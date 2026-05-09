"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AnalysisOverviewSkeleton } from "@/components/analyze/analysis-skeleton";
import { TimelineScrubber } from "@/components/analyze/timeline-scrubber";
import { useJobPoll } from "@/components/analyze/use-job-poll";

export default function JobTimelinePage() {
  const { id } = useParams<{ id: string }>();
  const { job } = useJobPoll(id ?? null);

  if (!job) return <AnalysisOverviewSkeleton />;

  if (job.status !== "ready" || !job.result) {
    return (
      <p className="py-8 text-center text-sm text-zinc-400">
        <Link href={`/analyze/jobs/${id}`} className="text-cyan-400">
          Processing…
        </Link>
      </p>
    );
  }

  const a = job.result;

  return (
    <div className="space-y-6 pb-4 pt-2">
      <div>
        <h2 className="text-lg font-semibold text-zinc-50">Timeline & replay</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Scrub heatmaps; cyan ticks are highlights. Production ties this to a
          synced video player with slow-motion chapters.
        </p>
      </div>

      <div className="aspect-video w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 ring-1 ring-zinc-700/50">
        <div className="flex h-full items-center justify-center text-sm text-zinc-500">
          Video proxy placeholder
        </div>
      </div>

      <TimelineScrubber analysis={a} />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
        <p className="text-xs font-medium text-zinc-400">Markers</p>
        <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto text-sm text-zinc-300">
          {a.timeline
            .slice()
            .sort((x, y) => x.t - y.t)
            .map((m, i) => (
              <li key={i} className="flex justify-between gap-2">
                <span className="font-mono text-zinc-500">{m.t.toFixed(2)}s</span>
                <span className="text-right">{m.label}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
