"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AnalysisOverviewSkeleton } from "@/components/analyze/analysis-skeleton";
import { ConfidenceBadge } from "@/components/analyze/confidence-badge";
import { useJobPoll } from "@/components/analyze/use-job-poll";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function JobMovesPage() {
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

  const moves = job.result.moves;

  return (
    <div className="space-y-4 pb-4 pt-2">
      <h2 className="text-lg font-semibold text-zinc-50">Move-by-move</h2>
      <p className="text-sm text-zinc-500">
        Estimates from motion cues — expand for finger-trick notes and alt lines.
      </p>
      <ul className="space-y-2">
        {moves.map((m) => (
          <li
            key={m.index}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-sm text-cyan-400">
                {m.index + 1}. {m.move}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">{m.stage}</span>
                <ConfidenceBadge value={m.confidence} />
              </div>
            </div>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              @ {m.t.toFixed(2)}s
            </p>
            {(m.fingerTrickNote || m.alternative) && (
              <Accordion type="single" collapsible className="mt-2 border-t border-zinc-800 pt-2">
                <AccordionItem value="d" className="border-0">
                  <AccordionTrigger className="py-2 text-xs text-cyan-400">
                    Detail
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm text-zinc-400">
                    {m.fingerTrickNote && <p>{m.fingerTrickNote}</p>}
                    {m.alternative && (
                      <p>
                        <span className="text-zinc-500">Alt: </span>
                        {m.alternative}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
