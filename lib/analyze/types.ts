/** WCA-oriented solve analysis — metrics are estimates unless noted. */

export type SolveStage = "Cross" | "F2L" | "OLL" | "PLL" | "AUF";

export type JobStatus =
  | "queued"
  | "downloading"
  | "uploading"
  | "processing"
  | "ready"
  | "failed";

export interface TimelineMarker {
  t: number;
  label: string;
  kind: "stage" | "pause" | "regrip" | "rotation" | "highlight" | "inefficiency";
  severity?: "low" | "med" | "high";
}

export interface TpsSample {
  t: number;
  tps: number;
}

export interface PauseSegment {
  start: number;
  end: number;
  ms: number;
  note?: string;
}

export interface HeatmapBin {
  t0: number;
  t1: number;
  intensity: number;
}

export interface MoveEntry {
  index: number;
  t: number;
  move: string;
  stage: SolveStage;
  fingerTrickNote?: string;
  alternative?: string;
  confidence: number;
}

export interface StageInsight {
  stage: SolveStage;
  summary: string;
  workingWell: string[];
  inefficiencies: string[];
  missedOptimizations: string[];
  suggestions: string[];
  vsElite: string;
  confidence: number;
}

export interface Reconstruction {
  moveCount: number;
  estimatedSTM: number;
  rotationCount: number;
  rotationConfidence: number;
  overallConfidence: number;
  methodAssumption: string;
  stageDurationsMs: Record<SolveStage, number>;
}

export interface BenchmarkComparison {
  label: string;
  metric: string;
  yourValue: number;
  benchmarkValue: number;
  unit: string;
  deltaPct: number;
}

export interface TrainingDrill {
  id: string;
  title: string;
  rationale: string;
  repsSuggested: number;
}

export interface AnalysisResult {
  jobId: string;
  durationSec: number;
  videoUrl?: string;
  thumbnailFrames?: string[];
  /** User correction / context (compliance + methodology). */
  userNotes?: string;
  stages: StageInsight[];
  timeline: TimelineMarker[];
  tpsSeries: TpsSample[];
  pauseHeatmap: HeatmapBin[];
  inefficiencyHeatmap: HeatmapBin[];
  moves: MoveEntry[];
  reconstruction: Reconstruction;
  consistencyScore: number;
  inspectionNotes: string;
  coachingNarrative: string[];
  coachingCitations: { text: string; field: string }[];
  drills: TrainingDrill[];
  benchmarks: BenchmarkComparison[];
  assumptions: string[];
  generatedAt: string;
}

export interface JobRecord {
  id: string;
  createdAt: number;
  source: "upload" | "youtube";
  youtubeUrl?: string;
  fileMeta?: { name: string; size: number; type: string };
  fileReceivedAt?: number;
  status: JobStatus;
  progress: number;
  error?: string;
  result?: AnalysisResult;
  /** Set after optional OpenAI enrichment on GET. */
  llmEnriched?: boolean;
}

export interface CreateJobBody {
  source: "upload" | "youtube";
  youtubeUrl?: string;
}

export interface PresignedUploadInfo {
  method: "POST";
  url: string;
  headers?: Record<string, string>;
}
