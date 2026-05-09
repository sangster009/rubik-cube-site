import type {
  AnalysisResult,
  BenchmarkComparison,
  HeatmapBin,
  MoveEntry,
  PauseSegment,
  StageInsight,
  TimelineMarker,
  TpsSample,
  TrainingDrill,
} from "./types";

const stages: StageInsight[] = [
  {
    stage: "Cross",
    summary:
      "Cross execution is ahead of pace vs. your last five uploads; x-cross residue still costs a flick on green.",
    workingWell: [
      "Color-neutral first pair is already framed before first F2L slot.",
      "Low regrip count through D-layer setup.",
    ],
    inefficiencies: [
      "0.18s micro-pause before final D insertion — likely inspection-to-execution handoff.",
      "Single redundant F' to re-seat left thumb for U2.",
    ],
    missedOptimizations: [
      "Could have preserved left-thumb on F for immediate U' without regrip (RU gen).",
    ],
    suggestions: [
      "Drill CN cross + first pair with forced blindfold transition at 8s inspection cap.",
    ],
    vsElite:
      "Top-10 WR singles cluster ~0.05s faster in cross-to-F2L bridge; gap is in lookahead, not raw TPS.",
    confidence: 0.72,
  },
  {
    stage: "F2L",
    summary:
      "Pair 2–3 show strong 2-gen bias; pair 4 opens wide with y' that could be avoided with left-slot choice.",
    workingWell: [
      "Pairs 1–2: consistent keyhole avoidance; no obvious keyhole detours.",
      "Maintained 11.2 median TPS through active F2L.",
    ],
    inefficiencies: [
      "Slot 3: paused recognition ~0.22s — classic OLS shape hesitation.",
      "Wide rotation before slot 4; costs ~0.14s vs. mirror solve average.",
    ],
    missedOptimizations: [
      "Multislotting window after pair 2: back-left pair was visible but not taken.",
    ],
    suggestions: [
      "Run 3×3 slow-turn F2L-only with forced no-rotation policy for 20 solves.",
    ],
    vsElite:
      "Elite Ao5 F2L splits at this move depth are ~0.35s tighter; rotation tax explains most delta.",
    confidence: 0.68,
  },
  {
    stage: "OLL",
    summary:
      "Recognition is sub-0.2s — strong. Execution uses standard alg with minor lockup on second trigger.",
    workingWell: ["Fast shape ID; no second-guess regrip."],
    inefficiencies: [
      "Trailing U' slightly overshot — AUF correction bleeds into PLL recognition.",
    ],
    missedOptimizations: [
      "ZBLL-adjacent case not applicable; no forced winter variation.",
    ],
    suggestions: [
      "Practice OLL + AUF chaining with metronome at 168 BPM for trigger discipline.",
    ],
    vsElite:
      "Compared to podium-tier singles, you're within noise on OLL-only; PLL is the separation stage.",
    confidence: 0.74,
  },
  {
    stage: "PLL",
    summary:
      "G-perm recognition solid; execution shows one dead-air frame before second H trigger.",
    workingWell: ["Correct AUF prediction; no double-look."],
    inefficiencies: [
      "Brief hesitation on second bar — possible thumb placement on F face.",
    ],
    missedOptimizations: [
      "Alternative alg set could shave one regrip if you standardize on left-thumb neutral.",
    ],
    suggestions: [
      "Film PLL-only session at 240fps; compare trigger timing vs. reference G-perm.",
    ],
    vsElite:
      "WR-level PLL execution here is ~0.12s faster at same recognition; finger trick finish is the lever.",
    confidence: 0.71,
  },
  {
    stage: "AUF",
    summary: "Single U' correction; clean lock.",
    workingWell: ["No post-solve adjustment."],
    inefficiencies: [],
    missedOptimizations: [],
    suggestions: [],
    vsElite: "Neutral vs. elite distribution.",
    confidence: 0.8,
  },
];

function buildTimeline(total: number): TimelineMarker[] {
  return [
    { t: 0, label: "Cross start", kind: "stage" },
    { t: 1.1, label: "Pause 180ms", kind: "pause", severity: "low" },
    { t: 2.4, label: "F2L", kind: "stage" },
    { t: 3.05, label: "y'", kind: "rotation", severity: "med" },
    { t: 4.2, label: "Regrip", kind: "regrip", severity: "low" },
    { t: 6.1, label: "OLL", kind: "stage" },
    { t: 7.35, label: "PLL", kind: "stage" },
    { t: 7.9, label: "AUF", kind: "stage" },
    { t: 5.5, label: "Lookahead gap", kind: "inefficiency", severity: "high" },
    { t: total * 0.4, label: "Highlight: 2-gen stretch", kind: "highlight" },
  ];
}

function buildTps(total: number): TpsSample[] {
  const out: TpsSample[] = [];
  for (let t = 0; t < total; t += 0.08) {
    const base = 10 + Math.sin(t * 3) * 2.5 + (t > 3 && t < 5 ? -1.2 : 0);
    out.push({ t: Math.round(t * 100) / 100, tps: Math.max(4, base + Math.random() * 0.8) });
  }
  return out;
}

function buildPausesHeatmap(): HeatmapBin[] {
  const bins: PauseSegment[] = [
    { start: 1.0, end: 1.18, ms: 180, note: "Cross bridge" },
    { start: 4.05, end: 4.28, ms: 230, note: "F2L recog" },
    { start: 6.55, end: 6.62, ms: 70, note: "OLL→PLL" },
  ];
  return bins.map((p) => ({
    t0: p.start,
    t1: p.end,
    intensity: Math.min(1, p.ms / 250),
  }));
}

function buildInefficiencyHeatmap(): HeatmapBin[] {
  return [
    { t0: 2.9, t1: 3.4, intensity: 0.85 },
    { t0: 5.4, t1: 5.9, intensity: 0.55 },
  ];
}

function buildMoves(): MoveEntry[] {
  const raw: { t: number; move: string; stage: MoveEntry["stage"] }[] = [
    { t: 0.1, move: "x2", stage: "Cross" },
    { t: 0.35, move: "D'", stage: "Cross" },
    { t: 0.52, move: "R", stage: "Cross" },
    { t: 0.71, move: "F'", stage: "Cross" },
    { t: 2.5, move: "U", stage: "F2L" },
    { t: 2.68, move: "R", stage: "F2L" },
    { t: 2.9, move: "U'", stage: "F2L" },
    { t: 3.15, move: "R'", stage: "F2L" },
    { t: 4.0, move: "y'", stage: "F2L" },
    { t: 6.2, move: "F", stage: "OLL" },
    { t: 6.35, move: "U", stage: "OLL" },
    { t: 6.5, move: "R'", stage: "OLL" },
    { t: 7.4, move: "R", stage: "PLL" },
    { t: 7.55, move: "U'", stage: "PLL" },
    { t: 7.7, move: "R'", stage: "PLL" },
    { t: 7.85, move: "F", stage: "PLL" },
    { t: 7.95, move: "R'", stage: "PLL" },
    { t: 8.05, move: "U'", stage: "AUF" },
  ];
  return raw.map((m, i) => ({
    index: i,
    t: m.t,
    move: m.move,
    stage: m.stage,
    fingerTrickNote:
      m.move === "U'"
        ? "Consider left-index double-flick if prior move leaves right hand free."
        : undefined,
    alternative: m.stage === "F2L" && m.move === "y'" ? "Mirror slot / avoid y' — back-left" : undefined,
    confidence: 0.62 + (i % 5) * 0.05,
  }));
}

const drills: TrainingDrill[] = [
  {
    id: "f2l-no-y",
    title: "F2L last slot — zero y-rotation policy",
    rationale: "Rotation tax at 3.05s matches habitual wide-view pattern.",
    repsSuggested: 30,
  },
  {
    id: "oll-pll-chain",
    title: "OLL → AUF metronome chaining",
    rationale: "Bleed-through from OLL finish into PLL recog.",
    repsSuggested: 40,
  },
];

const benchmarks: BenchmarkComparison[] = [
  {
    label: "Median F2L TPS (elite Ao5)",
    metric: "tps",
    yourValue: 10.8,
    benchmarkValue: 11.6,
    unit: "TPS",
    deltaPct: -6.9,
  },
  {
    label: "Rotation time tax",
    metric: "ms",
    yourValue: 240,
    benchmarkValue: 160,
    unit: "ms",
    deltaPct: 50,
  },
];

export function buildDemoAnalysis(jobId: string): AnalysisResult {
  const durationSec = 8.12;
  return {
    jobId,
    durationSec,
    timeline: buildTimeline(durationSec),
    tpsSeries: buildTps(durationSec),
    pauseHeatmap: buildPausesHeatmap(),
    inefficiencyHeatmap: buildInefficiencyHeatmap(),
    moves: buildMoves(),
    stages,
    reconstruction: {
      moveCount: 48,
      estimatedSTM: 52,
      rotationCount: 3,
      rotationConfidence: 0.66,
      overallConfidence: 0.69,
      methodAssumption: "CFOP — color-neutral cross, standard OLL/PLL",
      stageDurationsMs: {
        Cross: 980,
        F2L: 3420,
        OLL: 820,
        PLL: 680,
        AUF: 120,
      },
    },
    consistencyScore: 0.78,
    inspectionNotes:
      "15.0s inspection used; first move committed at ~14.2s mental lock — good discipline. Consider earlier x2 commitment to shave AUF variance.",
    coachingNarrative: [],
    coachingCitations: [
      { text: "Rotation tax explains most delta vs. elite F2L.", field: "reconstruction.rotationCount" },
      { text: "Median F2L TPS trailing benchmark by ~7%.", field: "benchmarks[0]" },
    ],
    drills,
    benchmarks,
    assumptions: [
      "Single POV 60fps — finger trick classification is proxy-based.",
      "No magnet/sticker calibration; cube state inferred from motion cues only.",
    ],
    generatedAt: new Date().toISOString(),
  };
}
