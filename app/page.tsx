import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getWeeklyVideos } from "@/lib/content";
import { getChannelVideos } from "@/lib/youtube";
import { getUpcomingCompetitions } from "@/lib/wca";
import { VideoCard } from "@/components/video-card";
import { CompetitionsTable } from "@/components/competitions-table";
import { CubeSketch } from "@/components/cube-sketch";
import { YoutubeBanner } from "@/components/youtube-banner";

const DEFAULT_CHANNEL = "@mikayeo";

export default async function Home() {
  const channelId =
    process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID ||
    process.env.YOUTUBE_CHANNEL_ID ||
    DEFAULT_CHANNEL;
  const latest = await getChannelVideos(channelId, 8);
  const isChannelFeed = true;
  const competitions = await getUpcomingCompetitions(8);

  return (
    <div className="container w-full max-w-6xl px-4 py-8 md:py-12">
      <section className="mx-auto max-w-2xl text-center">
        <CubeSketch className="mx-auto h-24 w-24 sm:h-28 sm:w-28" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Solve the 3×3 Rubik&apos;s Cube Step by Step
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Follow the guide, watch weekly algorithms from Micah, and get notified
          when new content drops.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/solve/3x3">Start solving 3×3</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/weekly">Videos</Link>
          </Button>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold">Latest from Micah</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent uploads.
        </p>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((video) => (
            <li key={video.id} className="h-full">
              <VideoCard
                video={video}
                href={
                  isChannelFeed
                    ? `https://www.youtube.com/watch?v=${video.youtubeId}`
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link
                href={
                  isChannelFeed && channelId
                    ? channelId.startsWith("@")
                      ? `https://www.youtube.com/${channelId}/videos`
                      : `https://www.youtube.com/channel/${channelId}`
                    : "/weekly"
                }
                target={isChannelFeed ? "_blank" : undefined}
                rel={isChannelFeed ? "noopener noreferrer" : undefined}
              >
                View all videos
              </Link>
          </Button>
        </div>

        <div className="mt-10">
            <h3 className="text-sm font-semibold text-foreground">
              Micah&apos;s next competitions
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Upcoming WCA competitions in Northern California (Yuba City excluded).{" "}
              <a
                href="https://www.worldcubeassociation.org/competitions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                View all on WCA
              </a>
            </p>
            <div className="mt-3">
              <CompetitionsTable data={competitions} />
            </div>
          </div>

        <div className="mt-8">
          <YoutubeBanner />
        </div>
      </section>
    </div>
  );
}
