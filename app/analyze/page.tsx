import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listJobs } from "@/lib/analyze/job-store";

export default function AnalyzeDashboardPage() {
  const recent = listJobs(5).map((j) => ({
    id: j.id,
    status: j.status,
    createdAt: j.createdAt,
  }));

  return (
    <div className="space-y-8 pt-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Solve lab
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
          Performance analytics
        </h1>
        <p className="text-sm leading-relaxed text-zinc-400">
          Upload POV or paste YouTube. Pipeline returns pause/TPS estimates, stage
          splits, and coach copy — tuned for WCA-level solvers (not beginners).
        </p>
      </header>

      <div className="grid gap-3">
        <Link href="/analyze/upload" className="block">
          <div className="flex min-h-[52px] items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 ring-1 ring-cyan-500/20 transition-colors hover:border-cyan-500/40">
            <span className="font-medium">New analysis</span>
            <ArrowRight className="size-5 text-cyan-400" />
          </div>
        </Link>
        <Link href="/api/analyze/demo" target="_blank" rel="noopener noreferrer">
          <div className="flex min-h-[52px] items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-4 hover:bg-zinc-900/70">
            <span className="flex items-center gap-2 font-medium">
              <Sparkles className="size-4 text-amber-400" />
              Raw demo JSON
            </span>
            <span className="text-xs text-zinc-500">API</span>
          </div>
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-300">Recent jobs</h2>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-500">
            No jobs in this server instance yet. Start an import — results stay in
            memory until you deploy persistent storage.
          </p>
        ) : (
          <ul className="space-y-2">
            {recent.map((j) => (
              <li key={j.id}>
                <Link
                  href={
                    j.status === "ready"
                      ? `/analyze/jobs/${j.id}/overview`
                      : `/analyze/jobs/${j.id}`
                  }
                  className="flex min-h-12 items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm hover:border-zinc-700"
                >
                  <span className="font-mono text-xs text-zinc-400">
                    {j.id.slice(0, 8)}…
                  </span>
                  <span className="text-cyan-400/90">{j.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="border-zinc-700 bg-transparent" asChild>
          <Link href="/analyze/terms">Retention & methodology</Link>
        </Button>
        <Button variant="outline" className="border-zinc-700 bg-transparent" asChild>
          <Link href="/analyze/compare">Compare solves</Link>
        </Button>
      </div>
    </div>
  );
}
