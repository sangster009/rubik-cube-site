import Link from "next/link";
import { notFound } from "next/navigation";
import { getWeeklyVideoBySlug, getWeeklyVideos } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  const videos = getWeeklyVideos();
  return videos.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = getWeeklyVideoBySlug(slug);
  if (!video) return { title: "Video | Cubing with Micah" };
  return {
    title: `${video.title} | Cubing with Micah`,
    description: video.description ?? undefined,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function WeeklySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = getWeeklyVideoBySlug(slug);
  if (!video) notFound();

  return (
    <div className="container px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link href="/weekly">← Videos</Link>
        </Button>

        <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>

        <header className="mt-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {video.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{video.cubeType}</Badge>
            {video.stepLabel && (
              <Badge variant="outline">{video.stepLabel}</Badge>
            )}
            <span className="text-sm text-muted-foreground">
              {formatDate(video.publishedAt)}
            </span>
          </div>
        </header>

        {video.description && (
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {video.description}
          </p>
        )}

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/weekly">More videos</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
