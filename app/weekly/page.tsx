import { getChannelVideos } from "@/lib/youtube";
import { VideoListLoadMore } from "@/components/video-list-load-more";

export const metadata = {
  title: "YouTube Videos | Cubing with Micah",
  description: "New videos from Micah, 3×3, 3×3 OH and more.",
};

const DEFAULT_CHANNEL = "@mikayeo";

export default async function WeeklyPage() {
  const channelId =
    process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID ||
    process.env.YOUTUBE_CHANNEL_ID ||
    DEFAULT_CHANNEL;

  const videos = await getChannelVideos(channelId, 50);

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        YouTube Videos
      </h1>
      <p className="mt-2 text-muted-foreground">
        New videos from Micah, 3×3, 3×3 OH and more.
      </p>

      <VideoListLoadMore
        videos={videos}
        useYouTubeLinks={true}
      />
    </div>
  );
}
