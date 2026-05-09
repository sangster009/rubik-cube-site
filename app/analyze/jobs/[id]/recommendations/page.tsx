"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AnalysisOverviewSkeleton } from "@/components/analyze/analysis-skeleton";
import { useJobPoll } from "@/components/analyze/use-job-poll";

export default function JobRecommendationsPage() {
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
        <h2 className="text-lg font-semibold text-zinc-50">Coach output</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {job.llmEnriched ? "LLM-enriched" : "Template + metrics"} — citations
          tie claims to fields.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        {a.coachingNarrative.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-zinc-300">
            {p}
          </p>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h3 className="text-sm font-semibold text-zinc-200">Citations</h3>
        <ul className="mt-2 space-y-2 text-sm text-zinc-400">
          {a.coachingCitations.map((c, i) => (
            <li key={i}>
              <span className="font-mono text-xs text-cyan-500/90">{c.field}</span>
              {": "}
              {c.text}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-200">Smart drills</h3>
        <ul className="space-y-3">
          {a.drills.map((d) => (
            <li
              key={d.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <p className="font-medium text-zinc-100">{d.title}</p>
              <p className="mt-1 text-sm text-zinc-400">{d.rationale}</p>
              <p className="mt-2 text-xs text-cyan-400/90">
                Suggested reps: {d.repsSuggested}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="text-sm text-amber-200/90">
          Inspection: {a.inspectionNotes}
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Consistency score (heuristic):{" "}
          <span className="font-mono text-zinc-300">
            {(a.consistencyScore * 100).toFixed(0)}
          </span>
        </p>
      </div>
    </div>
  );
}
