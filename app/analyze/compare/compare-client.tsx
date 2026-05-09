"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AnalysisResult, JobRecord } from "@/lib/analyze/types";
import { TpsSparkline } from "@/components/analyze/tps-sparkline";
import { ConfidenceBadge } from "@/components/analyze/confidence-badge";

export function AnalyzeCompareClient() {
  const sp = useSearchParams();
  const [idA, setIdA] = useState(() => sp.get("a") ?? "");
  const [idB, setIdB] = useState(() => sp.get("b") ?? "");
  const [left, setLeft] = useState<AnalysisResult | null>(null);
  const [right, setRight] = useState<AnalysisResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    setLeft(null);
    setRight(null);
    if (!idA.trim() || !idB.trim()) {
      setErr("Enter two job IDs from History.");
      return;
    }
    try {
      const [ra, rb] = await Promise.all([
        fetch(`/api/analyze/jobs/${idA.trim()}`),
        fetch(`/api/analyze/jobs/${idB.trim()}`),
      ]);
      if (!ra.ok || !rb.ok) throw new Error("Job not found or not ready");
      const ja = (await ra.json()) as JobRecord;
      const jb = (await rb.json()) as JobRecord;
      if (ja.status !== "ready" || !ja.result) throw new Error("Job A not ready");
      if (jb.status !== "ready" || !jb.result) throw new Error("Job B not ready");
      setLeft(ja.result);
      setRight(jb.result);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Compare failed");
    }
  }, [idA, idB]);

  return (
    <div className="space-y-6 pt-4">
      <h1 className="text-xl font-bold text-zinc-50">Side-by-side</h1>
      <p className="text-sm text-zinc-400">
        Align two completed solves. Share URL with{" "}
        <span className="font-mono text-xs">?a=&amp;b=</span> query params.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={idA}
          onChange={(e) => setIdA(e.target.value)}
          placeholder="Job ID A"
          className="min-h-12 border-zinc-700 bg-zinc-900 font-mono text-sm text-zinc-100"
        />
        <Input
          value={idB}
          onChange={(e) => setIdB(e.target.value)}
          placeholder="Job ID B"
          className="min-h-12 border-zinc-700 bg-zinc-900 font-mono text-sm text-zinc-100"
        />
      </div>
      <Button
        type="button"
        className="min-h-12 w-full bg-cyan-600 text-white hover:bg-cyan-500"
        onClick={load}
      >
        Load comparison
      </Button>

      {err && <p className="text-sm text-rose-400">{err}</p>}

      {left && right && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[left, right].map((a, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <p className="text-xs font-medium text-zinc-500">Solve {i + 1}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-50">
                {a.durationSec.toFixed(2)}s
              </p>
              <ConfidenceBadge value={a.reconstruction.overallConfidence} className="mt-2" />
              <div className="mt-3">
                <TpsSparkline series={a.tpsSeries} />
              </div>
              <dl className="mt-3 space-y-1 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <dt>STM</dt>
                  <dd className="font-mono text-zinc-200">{a.reconstruction.estimatedSTM}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Rotations</dt>
                  <dd className="font-mono text-zinc-200">{a.reconstruction.rotationCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Consistency</dt>
                  <dd className="font-mono text-zinc-200">
                    {(a.consistencyScore * 100).toFixed(0)}
                  </dd>
                </div>
              </dl>
              <Link
                href={`/analyze/jobs/${a.jobId}/overview`}
                className="mt-3 inline-block text-sm text-cyan-400"
              >
                Open analysis →
              </Link>
            </div>
          ))}
        </div>
      )}

      <Link href="/analyze/history" className="text-sm text-zinc-500 underline">
        Pick IDs from history
      </Link>
    </div>
  );
}
