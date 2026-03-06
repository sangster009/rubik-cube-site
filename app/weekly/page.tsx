import { getWeeklyVideos } from "@/lib/content";
import { VideoCard } from "@/components/video-card";

export const metadata = {
  title: "Weekly Algorithms | SCM",
  description: "Weekly Rubik's cube algorithm videos from Micah. 3×3 and more.",
};

export default function WeeklyPage() {
  const videos = getWeeklyVideos();

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Weekly algorithms
      </h1>
      <p className="mt-2 text-muted-foreground">
        New algorithm videos from Micah, weekly. 3×3 now; 3×3 OH and more coming.
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <li key={video.id}>
            <VideoCard video={video} />
          </li>
        ))}
      </ul>
    </div>
  );
}
