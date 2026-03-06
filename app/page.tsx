import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getWeeklyVideos } from "@/lib/content";
import { VideoCard } from "@/components/video-card";
import { SubscribeForm } from "@/components/subscribe-form";
import { CubeSketch } from "@/components/cube-sketch";
import { YoutubeBanner } from "@/components/youtube-banner";

export default function Home() {
  const latest = getWeeklyVideos().slice(0, 4);

  return (
    <div className="container px-4 py-8 md:py-12">
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
            <Link href="/weekly">Weekly algorithms</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-2xl">
        <h2 className="text-xl font-semibold">Subscribe for new content</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Get email when Micah posts new algorithms, or use RSS.
        </p>
        <SubscribeForm className="mt-4" variant="stacked" />
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold">Latest from Micah</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Weekly algorithm videos for 3×3 (and more coming).
        </p>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((video) => (
            <li key={video.id}>
              <VideoCard video={video} />
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/weekly">View all weekly</Link>
          </Button>
        </div>
        <div className="mt-8">
          <YoutubeBanner />
        </div>
      </section>
    </div>
  );
}
