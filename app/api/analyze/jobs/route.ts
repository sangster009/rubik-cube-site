import { NextResponse } from "next/server";
import { createJob, listJobs } from "@/lib/analyze/job-store";
import type { CreateJobBody } from "@/lib/analyze/types";

export async function POST(request: Request) {
  let body: CreateJobBody;
  try {
    body = (await request.json()) as CreateJobBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.source !== "upload" && body.source !== "youtube") {
    return NextResponse.json({ error: "source must be upload or youtube" }, { status: 400 });
  }

  if (body.source === "youtube") {
    const url = body.youtubeUrl?.trim();
    if (!url) {
      return NextResponse.json({ error: "youtubeUrl required" }, { status: 400 });
    }
    try {
      const u = new URL(url);
      if (!["http:", "https:"].includes(u.protocol)) {
        throw new Error("bad protocol");
      }
    } catch {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }
  }

  const job = createJob(body.source, body.youtubeUrl?.trim());
  const origin = new URL(request.url).origin;

  return NextResponse.json({
    jobId: job.id,
    presignedUpload:
      body.source === "upload"
        ? {
            method: "POST" as const,
            url: `${origin}/api/analyze/jobs/${job.id}/upload`,
            headers: {},
          }
        : null,
  });
}

export async function GET() {
  const jobs = listJobs(100).map((j) => ({
    id: j.id,
    status: j.status,
    progress: j.progress,
    createdAt: j.createdAt,
    source: j.source,
    youtubeUrl: j.youtubeUrl,
    durationSec: j.result?.durationSec,
    error: j.error,
    consistencyScore: j.result?.consistencyScore,
  }));
  return NextResponse.json({ jobs });
}
