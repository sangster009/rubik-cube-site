import { NextResponse } from "next/server";
import { generateCoaching } from "@/lib/analyze/coach";
import { buildDemoAnalysis } from "@/lib/analyze/mock-data";

export async function GET() {
  const a = buildDemoAnalysis("demo");
  const coach = generateCoaching(a);
  return NextResponse.json({
    ...a,
    coachingNarrative: coach.paragraphs,
    coachingCitations: [...a.coachingCitations, ...coach.citations],
  });
}
