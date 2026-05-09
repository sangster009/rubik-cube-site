"use client";

import { useCallback, useEffect, useState } from "react";
import type { JobRecord } from "@/lib/analyze/types";

export function useJobPoll(jobId: string | null, intervalMs = 900) {
  const [job, setJob] = useState<JobRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    const res = await fetch(`/api/analyze/jobs/${jobId}`);
    if (!res.ok) {
      setError(res.status === 404 ? "Job not found" : "Failed to load job");
      return;
    }
    const data = (await res.json()) as JobRecord;
    setError(null);
    setJob(data);
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    const t = requestAnimationFrame(() => {
      void fetchJob();
    });
    return () => cancelAnimationFrame(t);
  }, [jobId, fetchJob]);

  useEffect(() => {
    if (!jobId || !job) return;
    if (job.status === "ready" || job.status === "failed") return;
    const id = setInterval(() => {
      void fetchJob();
    }, intervalMs);
    return () => clearInterval(id);
  }, [jobId, job, fetchJob, intervalMs]);

  return { job, error, refetch: fetchJob };
}
