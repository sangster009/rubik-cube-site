import { readFileSync } from "fs";
import { join } from "path";

export type CubeType = "3x3" | "3x3-oh" | "4x4";

export interface WeeklyVideo {
  id: string;
  slug: string;
  title: string;
  youtubeId: string;
  publishedAt: string;
  cubeType: CubeType;
  description?: string;
  stepLabel?: string;
}

export interface SolveStep {
  order: number;
  title: string;
  body: string;
  youtubeId: string | null;
}

function resolveContentDir(): string {
  const fromCwd = join(process.cwd(), "content");
  const fromParent = join(process.cwd(), "rubik-cube-site", "content");
  try {
    readFileSync(join(fromCwd, "weekly", "videos.json"), "utf-8");
    return fromCwd;
  } catch {
    try {
      readFileSync(join(fromParent, "weekly", "videos.json"), "utf-8");
      return fromParent;
    } catch {
      return fromCwd;
    }
  }
}
const CONTENT_DIR = resolveContentDir();

function getContentPath(...segments: string[]) {
  return join(CONTENT_DIR, ...segments);
}

export function getWeeklyVideos(cubeType?: CubeType): WeeklyVideo[] {
  const path = getContentPath("weekly", "videos.json");
  const raw = readFileSync(path, "utf-8");
  const videos: WeeklyVideo[] = JSON.parse(raw);
  const sorted = [...videos].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  if (cubeType) {
    return sorted.filter((v) => v.cubeType === cubeType);
  }
  return sorted;
}

export function getWeeklyVideoBySlug(slug: string): WeeklyVideo | undefined {
  return getWeeklyVideos().find((v) => v.slug === slug);
}

export function getSolveSteps(cubeSlug: string): SolveStep[] {
  const path = getContentPath("solve", cubeSlug, "steps.json");
  const raw = readFileSync(path, "utf-8");
  const steps: SolveStep[] = JSON.parse(raw);
  return steps.sort((a, b) => a.order - b.order);
}
