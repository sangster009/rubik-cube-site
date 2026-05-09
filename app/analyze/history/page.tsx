import Link from "next/link";
import { listJobs } from "@/lib/analyze/job-store";

export default function AnalyzeHistoryPage() {
  const jobs = listJobs(100);

  return (
    <div className="space-y-4 pt-4">
      <h1 className="text-xl font-bold text-zinc-50">History</h1>
      <p className="text-sm text-zinc-400">
        Session-local on this build. Deploy Postgres / KV for durable progression
        tracking.
      </p>
      <ul className="space-y-2">
        {jobs.length === 0 ? (
          <li className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-sm text-zinc-500">
            No solves yet.
          </li>
        ) : (
          jobs.map((j) => (
            <li key={j.id}>
              <Link
                href={
                  j.status === "ready"
                    ? `/analyze/jobs/${j.id}/overview`
                    : `/analyze/jobs/${j.id}`
                }
                className="flex min-h-14 flex-col gap-1 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 hover:border-zinc-700"
              >
                <span className="font-mono text-xs text-zinc-500">{j.id}</span>
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize text-zinc-300">{j.status}</span>
                  {j.result?.durationSec != null && (
                    <span className="text-zinc-500">
                      {j.result.durationSec.toFixed(2)}s
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
