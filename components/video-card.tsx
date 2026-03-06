import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeeklyVideo } from "@/lib/content";

const YOUTUBE_THUMB = (id: string) =>
  `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function VideoCard({ video }: { video: WeeklyVideo }) {
  return (
    <Link href={`/weekly/${video.slug}`} className="block group">
      <Card className="overflow-hidden transition-shadow hover:shadow-md h-full flex flex-col">
        <div className="relative aspect-video w-full bg-muted">
          <Image
            src={YOUTUBE_THUMB(video.youtubeId)}
            alt=""
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 text-base group-hover:text-primary transition-colors">
            {video.title}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{video.cubeType}</Badge>
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
