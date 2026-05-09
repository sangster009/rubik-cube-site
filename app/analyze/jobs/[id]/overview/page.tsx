"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AnalysisOverviewSkeleton } from "@/components/analyze/analysis-skeleton";
import { ConfidenceBadge } from "@/components/analyze/confidence-badge";
import { InsightCard } from "@/components/analyze/insight-card";
import { TpsSparkline } from "@/components/analyze/tps-sparkline";
import { useJobPoll } from "@/components/analyze/use-job-poll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JobOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const { job, refetch } = useJobPoll(id ?? null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!job?.result) return;
    const t = requestAnimationFrame(() => {
      setNotes(job.result?.userNotes ?? "");
    });
    return () => cancelAnimationFrame(t);
    // Sync server notes when job id or stored notes change (not every poll field).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally narrow deps
  }, [id, job?.result?.userNotes]);

  if (!job) return <AnalysisOverviewSkeleton />;

  if (job.status !== "ready" || !job.result) {
    return (
      <div className="py-8 text-center text-sm text-zinc-400">
        Analysis not ready.{" "}
        <Link href={`/analyze/jobs/${id}`} className="text-cyan-400">
          Status
        </Link>
      </div>
    );
  }

  const a = job.result;

  async function saveNotes() {
    setSaving(true);
    await fetch(`/api/analyze/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userNotes: notes }),
    });
    await refetch();
    setSaving(false);
  }

  return (
    <div className="space-y-6 pb-4 pt-2">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Solve duration (est.)
            </p>
            <p className="text-3xl font-bold tabular-nums text-zinc-50">
              {a.durationSec.toFixed(2)}s
            </p>
          </div>
          <ConfidenceBadge value={a.reconstruction.overallConfidence} />
        </div>
        <div className="mt-4">
          <p className="mb-1 text-xs text-zinc-500">TPS curve (coarse bins)</p>
          <TpsSparkline series={a.tpsSeries} />
        </div>
      </div>

      <Tabs defaultValue="cross" className="w-full">
        <TabsList
          variant="line"
          className="mb-3 w-full flex-wrap justify-start gap-1 bg-transparent p-0"
        >
          {a.stages.map((s) => (
            <TabsTrigger
              key={s.stage}
              value={s.stage}
              className="min-h-10 rounded-lg px-3 data-[state=active]:bg-zinc-800 data-[state=active]:text-cyan-400"
            >
              {s.stage}
            </TabsTrigger>
          ))}
        </TabsList>
        {a.stages.map((s) => (
          <TabsContent key={s.stage} value={s.stage} className="mt-0">
            <InsightCard insight={s} />
          </TabsContent>
        ))}
      </Tabs>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h3 className="text-sm font-semibold text-zinc-200">Reconstruction</h3>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-zinc-500">STM (est.)</dt>
            <dd className="font-mono text-zinc-200">{a.reconstruction.estimatedSTM}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Rotations</dt>
            <dd className="font-mono text-zinc-200">
              {a.reconstruction.rotationCount}{" "}
              <span className="text-xs text-zinc-500">
                (
                <ConfidenceBadge
                  value={a.reconstruction.rotationConfidence}
                  className="align-middle"
                />
                )
              </span>
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-zinc-500">Assumption</dt>
            <dd className="text-zinc-300">{a.reconstruction.methodAssumption}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h3 className="text-sm font-semibold text-zinc-200">WCA benchmark overlays</h3>
        <ul className="mt-3 space-y-2">
          {a.benchmarks.map((b, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span className="text-zinc-400">{b.label}</span>
              <span className="font-mono text-zinc-200">
                {b.yourValue} vs {b.benchmarkValue} {b.unit}
              </span>
            </li>
          ))}
        </ul>
        <a
          href="https://www.worldcubeassociation.org/persons"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-400"
        >
          Cross-check on WCA <ExternalLink className="size-3" />
        </a>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h3 className="text-sm font-semibold text-zinc-200">Corrections & notes</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Log ground truth for rotations, AUF, or mislabels — improves trust.
        </p>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Actual PLL was Gc, not Gd — camera angle"
          className="mt-3 min-h-11 border-zinc-700 bg-zinc-950 text-zinc-100"
        />
        <Button
          type="button"
          className="mt-2 bg-zinc-800 text-zinc-100"
          disabled={saving}
          onClick={saveNotes}
        >
          {saving ? "Saving…" : "Save notes"}
        </Button>
      </div>

      <ul className="space-y-1 text-xs text-zinc-600">
        {a.assumptions.map((x, i) => (
          <li key={i}>• {x}</li>
        ))}
      </ul>
    </div>
  );
}
