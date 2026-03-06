"use client";

import { useState } from "react";
import { VideoCard } from "@/components/video-card";
import { Button } from "@/components/ui/button";
import type { ChannelVideo } from "@/lib/youtube";
import type { WeeklyVideo } from "@/lib/content";

const INITIAL_COUNT = 9;
const PER_PAGE = 9;

type VideoItem = ChannelVideo | (WeeklyVideo & { slug?: string });

interface VideoListLoadMoreProps {
  videos: VideoItem[];
  /** When true, cards link to YouTube; otherwise use /weekly/slug when slug exists */
  useYouTubeLinks?: boolean;
}

export function VideoListLoadMore({
  videos,
  useYouTubeLinks = false,
}: VideoListLoadMoreProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visible = videos.slice(0, visibleCount);
  const hasMore = visibleCount < videos.length;

  return (
    <>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((video) => (
          <li key={video.id} className="h-full">
            <VideoCard
              video={video}
              href={
                useYouTubeLinks
                  ? `https://www.youtube.com/watch?v=${video.youtubeId}`
                  : undefined
              }
            />
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() =>
              setVisibleCount((n) => Math.min(n + PER_PAGE, videos.length))
            }
          >
            Load more
          </Button>
        </div>
      )}
    </>
  );
}
