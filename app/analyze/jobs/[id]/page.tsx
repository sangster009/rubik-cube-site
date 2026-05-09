"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { JobProcessingSkeleton } from "@/components/analyze/analysis-skeleton";
import { useJobPoll } from "@/components/analyze/use-job-poll";
import { Button } from "@/components/ui/button";

const labels: Record<string, string> = {
  queued: "Queued",
  downloading: "Fetching source",
  uploading: "Waiting for upload",
  processing: "CV + metrics pipeline",
  ready: "Ready",
  failed: "Failed",
};

export default function JobProcessingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { job, error } = useJobPoll(id ?? null, 700);

  useEffect(() => {
    if (job?.status === "ready") {
      router.replace(`/analyze/jobs/${id}/overview`);
    }
  }, [job?.status, id, router]);

  if (error) {
    return (
      <div className="py-8 text-center text-sm text-rose-400">
        {error}
        <div className="mt-4">
          <Button asChild variant="outline" className="border-zinc-700">
            <Link href="/analyze/upload">New import</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!job) {
    return <JobProcessingSkeleton />;
  }

  if (job.status === "failed") {
    return (
      <div className="space-y-4 py-6">
        <p className="text-rose-400">{job.error ?? "Job failed"}</p>
        <Button asChild variant="outline" className="border-zinc-700">
          <Link href="/analyze/upload">Try again</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div className="text-center">
        <Loader2 className="mx-auto size-10 animate-spin text-cyan-400" />
        <p className="mt-4 text-lg font-medium text-zinc-200">
          {labels[job.status] ?? job.status}
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          {job.source === "youtube"
            ? "Simulated download + processing for demo"
            : "Upload received — running stub pipeline"}
        </p>
      </div>
      <div className="space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full bg-cyan-500 transition-all duration-500"
            style={{ width: `${job.progress}%` }}
          />
        </div>
        <p className="text-center text-xs tabular-nums text-zinc-500">
          {Math.round(job.progress)}%
        </p>
      </div>
      <p className="text-center text-xs text-zinc-600">
        Production: FFmpeg normalize → optical flow → solver-assisted reconstruction
        → LLM coach.
      </p>
    </div>
  );
}
