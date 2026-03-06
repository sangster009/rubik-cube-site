/**
 * Fetch recent uploads from a YouTube channel via its public RSS feed.
 * No API key required. Use NEXT_PUBLIC_YOUTUBE_CHANNEL_ID or YOUTUBE_CHANNEL_ID.
 * You can set the channel ID (UC...) or the handle (e.g. @mikayeo) – we resolve handles to the correct channel so videos match youtube.com/@mikayeo/videos.
 */

export interface ChannelVideo {
  id: string;
  youtubeId: string;
  title: string;
  publishedAt: string;
  description?: string;
}

const RSS_URL = "https://www.youtube.com/feeds/videos.xml";

/** UC + 22 base64url chars = 24. Accept only proper channel IDs. */
const CHANNEL_ID_REGEX = /^UC[\w-]{22}$/;

const channelIdCache = new Map<string, string>();

/**
 * Resolve channel ID or handle to the canonical UC... channel ID so we always show videos from the correct channel.
 * Handles like @mikayeo are resolved by fetching the channel page; UC... is returned as-is.
 */
export async function resolveChannelId(idOrHandle: string): Promise<string> {
  const trimmed = idOrHandle.trim();
  if (CHANNEL_ID_REGEX.test(trimmed)) return trimmed;
  const handle = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  if (!handle) return trimmed;

  const cacheKey = `@${handle}`;
  const cached = channelIdCache.get(cacheKey);
  if (cached) return cached;

  const url = `https://www.youtube.com/@${encodeURIComponent(handle)}`;
  const res = await fetch(url, {
    next: { revalidate: 86400 },
    headers: { "User-Agent": "Mozilla/5.0 (compatible; RubikSolve/1.0)" },
  });
  const html = await res.text();
  // ytInitialData or inline JSON often contains "channelId":"UC..."
  const match = html.match(/"channelId"\s*:\s*"(UC[\w-]{22})"/) ?? html.match(/"externalId"\s*:\s*"(UC[\w-]{22})"/);
  const resolved = match ? match[1]! : trimmed;
  if (resolved !== trimmed) channelIdCache.set(cacheKey, resolved);
  return resolved;
}

function parseRssEntry(entryXml: string): ChannelVideo | null {
  const videoIdMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
  const titleMatch = entryXml.match(/<title>([^<]+)<\/title>/);
  const publishedMatch = entryXml.match(/<published>([^<]+)<\/published>/);
  const descriptionMatch = entryXml.match(
    /<media:description[^>]*>([\s\S]*?)<\/media:description>/
  );

  if (!videoIdMatch || !titleMatch || !publishedMatch) return null;

  const youtubeId = videoIdMatch[1];
  const title = titleMatch[1].replace(/&amp;/g, "&").replace(/&#39;/g, "'");
  const publishedRaw = publishedMatch[1];
  const publishedAt =
    publishedRaw.length >= 20
      ? new Date(publishedRaw).toISOString()
      : publishedRaw;
  let description: string | undefined;
  if (descriptionMatch && descriptionMatch[1]) {
    description = descriptionMatch[1]
      .trim()
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .slice(0, 300);
  }

  return {
    id: youtubeId,
    youtubeId,
    title,
    publishedAt,
    description: description || undefined,
  };
}

function parseRssFeed(xml: string): ChannelVideo[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  const videos: ChannelVideo[] = [];
  for (const entry of entries) {
    const video = parseRssEntry(entry);
    if (video) videos.push(video);
  }
  return videos;
}

const cache = new Map<
  string,
  { videos: ChannelVideo[]; fetchedAt: number }
>();
const CACHE_MS = 60 * 60 * 1000; // 1 hour

export async function getChannelVideos(
  channelIdOrHandle: string,
  limit = 12
): Promise<ChannelVideo[]> {
  const channelId = await resolveChannelId(channelIdOrHandle);

  const cached = cache.get(channelId);
  if (cached && Date.now() - cached.fetchedAt < CACHE_MS) {
    return cached.videos.slice(0, limit);
  }

  const url = `${RSS_URL}?channel_id=${encodeURIComponent(channelId)}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { "User-Agent": "Mozilla/5.0 (compatible; RubikSolve/1.0)" },
  });
  if (!res.ok) return [];
  const xml = await res.text();
  const videos = parseRssFeed(xml);
  cache.set(channelId, { videos, fetchedAt: Date.now() });
  return videos.slice(0, limit);
}
