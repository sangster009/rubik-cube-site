import { randomUUID } from "crypto";
import type { AnalysisResult, JobRecord, JobStatus } from "./types";
import { runPipeline } from "./pipeline";

const jobs = new Map<string, JobRecord>();

const YOUTUBE_QUEUED_MS = 400;
const YOUTUBE_DOWNLOAD_MS = 2800;
const PROCESSING_MS = 5200;
const UPLOAD_PROCESSING_MS = 4800;

export function createJob(
  source: "upload" | "youtube",
  youtubeUrl?: string
): JobRecord {
  const id = randomUUID();
  const job: JobRecord = {
    id,
    createdAt: Date.now(),
    source,
    youtubeUrl,
    status: "queued",
    progress: 0,
  };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string): JobRecord | undefined {
  return jobs.get(id);
}

export function listJobs(limit = 50): JobRecord[] {
  return Array.from(jobs.values())
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

export function markFileReceived(
  id: string,
  meta: { name: string; size: number; type: string }
): JobRecord | undefined {
  const job = jobs.get(id);
  if (!job) return undefined;
  job.fileMeta = meta;
  job.fileReceivedAt = Date.now();
  job.status = "processing";
  job.progress = 12;
  jobs.set(id, job);
  return job;
}

function setStatus(job: JobRecord, status: JobStatus, progress: number) {
  job.status = status;
  job.progress = progress;
  jobs.set(job.id, job);
}

/** Advance job state machine (serverless-friendly: derived on read). */
export function refreshJob(job: JobRecord): JobRecord {
  const now = Date.now();

  if (job.status === "failed" || job.status === "ready") {
    return job;
  }

  if (job.source === "youtube") {
    const elapsed = now - job.createdAt;
    if (elapsed < YOUTUBE_QUEUED_MS) {
      setStatus(job, "queued", 5);
    } else if (elapsed < YOUTUBE_DOWNLOAD_MS) {
      setStatus(job, "downloading", 25 + Math.min(30, (elapsed / YOUTUBE_DOWNLOAD_MS) * 30));
    } else if (elapsed < YOUTUBE_DOWNLOAD_MS + PROCESSING_MS) {
      const p =
        55 +
        Math.min(
          40,
          ((elapsed - YOUTUBE_DOWNLOAD_MS) / PROCESSING_MS) * 40
        );
      setStatus(job, "processing", p);
    } else {
      finalizeJob(job);
    }
    return job;
  }

  // upload
  if (!job.fileReceivedAt) {
    const elapsed = now - job.createdAt;
    if (elapsed > 120_000) {
      setStatus(job, "failed", 0);
      job.error = "Upload timeout — submit again.";
      jobs.set(job.id, job);
    } else {
      setStatus(job, "uploading", 8);
    }
    return job;
  }

  const procElapsed = now - job.fileReceivedAt;
  if (procElapsed < UPLOAD_PROCESSING_MS) {
    setStatus(
      job,
      "processing",
      20 + Math.min(75, (procElapsed / UPLOAD_PROCESSING_MS) * 75)
    );
  } else {
    finalizeJob(job);
  }
  return job;
}

function finalizeJob(job: JobRecord) {
  if (job.result) {
    setStatus(job, "ready", 100);
    return;
  }
  try {
    const result: AnalysisResult = runPipeline(job);
    job.result = result;
    setStatus(job, "ready", 100);
  } catch (e) {
    job.error = e instanceof Error ? e.message : "Pipeline failed";
    setStatus(job, "failed", 0);
  }
}

export function updateJobResult(jobId: string, patch: Partial<AnalysisResult>) {
  const job = jobs.get(jobId);
  if (!job?.result) return;
  job.result = { ...job.result, ...patch };
  jobs.set(jobId, job);
}

export function patchJobAnalysisNotes(jobId: string, userNotes: string) {
  const job = jobs.get(jobId);
  if (!job?.result) return false;
  job.result = { ...job.result, userNotes };
  jobs.set(jobId, job);
  return true;
}
