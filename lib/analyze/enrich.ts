import { generateCoachingAsync } from "./coach";
import type { JobRecord } from "./types";

/** Replace template coaching with LLM output when OPENAI_API_KEY is set (once per job). */
export async function maybeEnrichJobWithLlm(job: JobRecord): Promise<JobRecord> {
  if (job.llmEnriched || !job.result || !process.env.OPENAI_API_KEY) {
    return job;
  }

  const out = await generateCoachingAsync(job.result);
  if (out.paragraphs.length === 0) return job;

  job.result = {
    ...job.result,
    coachingNarrative: out.paragraphs,
    coachingCitations: [...job.result.coachingCitations, ...out.citations],
  };
  job.llmEnriched = true;

  return job;
}
