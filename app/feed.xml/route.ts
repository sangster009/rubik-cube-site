import { getWeeklyVideos } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rubik-solve.example.com";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const videos = getWeeklyVideos();
  const items = videos
    .map(
      (v) => `
    <item>
      <title>${escapeXml(v.title)}</title>
      <link>${SITE_URL}/weekly/${v.slug}</link>
      <pubDate>${new Date(v.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(v.description ?? v.title)}</description>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rubik Solve – Weekly Algorithms</title>
    <link>${SITE_URL}</link>
    <description>Weekly Rubik's cube algorithm videos from Micah.</description>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
