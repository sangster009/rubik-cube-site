/**
 * Cloud worker contract (Phase 1–2): replace in-process `runPipeline` with a queued job
 * that runs FFmpeg normalize → frame sampling → optical-flow pause segmentation →
 * optional cube-state keyframes → metrics JSON → LLM coach.
 *
 * This repo runs the stub synchronously in `finalizeJob` for local/serverless demos.
 */
export interface WorkerAnalyzePayload {
  jobId: string;
  objectKey?: string;
  youtubeUrl?: string;
}

export interface WorkerAnalyzeResult {
  ok: boolean;
  metricsUri?: string;
  error?: string;
}
