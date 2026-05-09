import { buildDemoAnalysis } from "./mock-data";
import type { AnalysisResult, JobRecord } from "./types";
import { generateCoaching } from "./coach";

/**
 * Phase 1–2 pipeline stub: deterministic metrics + synthetic CV-derived series.
 * Replace with worker FFmpeg + OpenCV + solver when infra is ready.
 */
export function runPipeline(job: JobRecord): AnalysisResult {
  const base = buildDemoAnalysis(job.id);

  if (job.source === "youtube" && job.youtubeUrl) {
    base.assumptions = [
      ...base.assumptions,
      `Source URL ingested (compliance: user attestation). Preview quality may cap pose confidence.`,
    ];
  }

  if (job.fileMeta) {
    base.assumptions = [
      ...base.assumptions,
      `Upload: ${job.fileMeta.name} (${(job.fileMeta.size / 1024 / 1024).toFixed(2)} MB).`,
    ];
  }

  // Phase-1 style derived fields (v0 heuristics)
  const pauseBins = base.pauseHeatmap;
  const totalPauseMs = pauseBins.reduce(
    (s, b) => s + (b.t1 - b.t0) * 1000 * b.intensity,
    0
  );

  base.reconstruction = {
    ...base.reconstruction,
    overallConfidence: Math.min(
      0.92,
      base.reconstruction.overallConfidence + (job.fileMeta ? 0.03 : 0)
    ),
  };

  if (totalPauseMs > 400) {
    base.timeline.push({
      t: base.durationSec * 0.55,
      label: `Aggregate pause load ~${Math.round(totalPauseMs)}ms (est.)`,
      kind: "pause",
      severity: "med",
    });
  }

  const coaching = generateCoaching(base);
  base.coachingNarrative = coaching.paragraphs;
  base.coachingCitations = [...base.coachingCitations, ...coaching.citations];

  return base;
}
