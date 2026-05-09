import { NextResponse } from "next/server";
import { getJob, refreshJob, patchJobAnalysisNotes } from "@/lib/analyze/job-store";
import { maybeEnrichJobWithLlm } from "@/lib/analyze/enrich";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  let job = getJob(id);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  job = refreshJob(job);

  if (job.status === "ready") {
    await maybeEnrichJobWithLlm(job);
  }

  return NextResponse.json(job);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const job = getJob(id);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  let body: { userNotes?: string };
  try {
    body = (await request.json()) as { userNotes?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.userNotes === "string") {
    patchJobAnalysisNotes(id, body.userNotes);
  }

  return NextResponse.json({ ok: true });
}
