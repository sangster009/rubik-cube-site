import Link from "next/link";
import { Youtube } from "lucide-react";

const CHANNEL_URL = "https://www.youtube.com/@mikayeo";

export function YoutubeBanner() {
  return (
    <Link
      href={CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md dark:from-neutral-900 dark:to-neutral-800 dark:hover:border-neutral-600"
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#ff0000] text-white transition-transform group-hover:scale-110">
            <Youtube className="size-7" aria-hidden />
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground">Micah&apos;s Channel</p>
            <p className="text-sm text-muted-foreground">
              Watch more algorithms on YouTube
            </p>
          </div>
        </div>
        <span className="inline-flex h-8 shrink-0 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
          <Youtube className="size-4" />
          Visit channel
        </span>
      </div>
    </Link>
  );
}
