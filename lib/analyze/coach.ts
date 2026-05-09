import type { AnalysisResult } from "./types";

interface CoachOutput {
  paragraphs: string[];
  citations: { text: string; field: string }[];
}

/** Template coaching when no API key; LLM when OPENAI_API_KEY is set. */
export async function generateCoachingAsync(
  analysis: AnalysisResult
): Promise<CoachOutput> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return Promise.resolve(templateCoach(analysis));
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.35,
        messages: [
          {
            role: "system",
            content: `You are an elite WCA-level 3x3 coach. Audience: sub-7 to WR-class solvers. 
Use CFOP terminology, no beginner explanations. Output 4–6 short paragraphs of actionable feedback.
Only reference numeric facts present in the JSON. If uncertain, say "estimate" explicitly.`,
          },
          {
            role: "user",
            content: `Analyze this structured solve telemetry (all metrics are model estimates):\n${JSON.stringify(
              {
                durationSec: analysis.durationSec,
                reconstruction: analysis.reconstruction,
                consistencyScore: analysis.consistencyScore,
                benchmarks: analysis.benchmarks,
                stageSummaries: analysis.stages.map((s) => ({
                  stage: s.stage,
                  summary: s.summary,
                  confidence: s.confidence,
                })),
              },
              null,
              2
            )}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return templateCoach(analysis);
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return templateCoach(analysis);

    const paragraphs = text
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    return {
      paragraphs,
      citations: [
        {
          text: "LLM narrative grounded on reconstruction + benchmarks JSON.",
          field: "coach.llm",
        },
      ],
    };
  } catch {
    return templateCoach(analysis);
  }
}

/** Sync wrapper for pipeline (uses template); async path for API route. */
export function generateCoaching(analysis: AnalysisResult): CoachOutput {
  return templateCoach(analysis);
}

function templateCoach(analysis: AnalysisResult): CoachOutput {
  const { reconstruction, consistencyScore, benchmarks } = analysis;
  const rot = reconstruction.rotationCount;
  const stm = reconstruction.estimatedSTM;

  return {
    paragraphs: [
      `Reconstruction confidence ~${(reconstruction.overallConfidence * 100).toFixed(0)}% at ${stm} STM (est.) — treat stage splits as provisional until multi-angle or state logging confirms.`,
      rot >= 3
        ? `${rot} rotations detected (conf. ${(reconstruction.rotationConfidence * 100).toFixed(0)}%): prioritize F2L pair choice and left-thumb neutrality to collapse y/y' tax.`
        : `Rotation count is moderate; biggest lever is likely lookahead micro-stalls rather than wide moves.`,
      `Consistency score ${(consistencyScore * 100).toFixed(0)} / 100 (session-normalized heuristic): chain OLL→PLL triggers to protect against recognition bleed.`,
      benchmarks[0]
        ? `Benchmark: ${benchmarks[0].label} — you're at ${benchmarks[0].yourValue} vs ${benchmarks[0].benchmarkValue} ${benchmarks[0].unit} (~${benchmarks[0].deltaPct.toFixed(1)}% delta).`
        : `Benchmark data sparse for this clip — upload 60fps POV for tighter TPS bins.`,
      `Drill focus: run assigned F2L policy reps, then film PLL-only at high fps to verify trigger dead-air called in stage insights.`,
    ],
    citations: [
      { text: "Template coach (set OPENAI_API_KEY for LLM).", field: "coach.template" },
      { text: `STM / rotations`, field: "reconstruction" },
    ],
  };
}
