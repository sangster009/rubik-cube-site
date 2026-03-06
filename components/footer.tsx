import Link from "next/link";
import { Rss } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Micah. Rubik&apos;s cube algorithms and tutorials.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/feed.xml"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="RSS feed"
            >
              <Rss className="size-4" />
              RSS
            </Link>
            <Link
              href="/subscribe"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
