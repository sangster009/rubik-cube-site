import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeeklyVideo } from "@/lib/content";
import type { ChannelVideo } from "@/lib/youtube";

const YOUTUBE_THUMB = (id: string) =>
  `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type VideoCardVideo = (WeeklyVideo | ChannelVideo) & {
  cubeType?: string;
  stepLabel?: string;
};

export function VideoCard({
  video,
  href: hrefProp,
}: {
  video: VideoCardVideo;
  /** When set (e.g. YouTube watch URL), card links here instead of /weekly/slug */
  href?: string;
}) {
  const href =
    hrefProp ??
    ("slug" in video && video.slug
      ? `/weekly/${video.slug}`
      : `https://www.youtube.com/watch?v=${video.youtubeId}`);

  return (
    <Link href={href} className="block group h-full" target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
      <Card className="h-full flex flex-col overflow-hidden border-slate-200/80 bg-gradient-to-b from-slate-50 to-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700/50 dark:from-slate-800/60 dark:to-slate-900/40">
        <div className="relative aspect-video w-full shrink-0 bg-muted">
          <Image
            src={YOUTUBE_THUMB(video.youtubeId)}
            alt=""
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <CardHeader className="flex min-h-[7rem] flex-1 flex-col justify-between pb-4 pt-4">
          <CardTitle className="line-clamp-2 text-base leading-snug group-hover:text-primary transition-colors">
            {video.title}
          </CardTitle>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
            {video.cubeType && (
              <Badge variant="secondary">{video.cubeType}</Badge>
            )}
            {video.stepLabel && (
              <Badge variant="outline">{video.stepLabel}</Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(video.publishedAt)}
            </span>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
