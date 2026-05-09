import { NextResponse } from "next/server";
import { getJob, markFileReceived, refreshJob } from "@/lib/analyze/job-store";

export const runtime = "nodejs";

const MAX_BYTES = 80 * 1024 * 1024;

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const job = getJob(id);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  if (job.source !== "upload") {
    return NextResponse.json({ error: "Not an upload job" }, { status: 400 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Expected multipart field 'file'" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File exceeds ${MAX_BYTES / 1024 / 1024}MB cap` },
      { status: 400 }
    );
  }

  markFileReceived(id, {
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
  });

  const updated = getJob(id);
  if (!updated) {
    return NextResponse.json({ error: "Job lost" }, { status: 500 });
  }

  refreshJob(updated);

  return NextResponse.json({
    ok: true,
    status: updated.status,
    progress: updated.progress,
  });
}

/** Presigned-style metadata for clients that want a two-step flow. */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const job = getJob(id);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  const origin = new URL(request.url).origin;
  return NextResponse.json({
    method: "POST",
    url: `${origin}/api/analyze/jobs/${id}/upload`,
    fields: { file: "multipart file field name" },
  });
}
