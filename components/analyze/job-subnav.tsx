"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function JobSubnav({ jobId }: { jobId: string }) {
  const pathname = usePathname();
  const base = `/analyze/jobs/${jobId}`;

  const tabs = [
    { href: `${base}/overview`, label: "Overview" },
    { href: `${base}/timeline`, label: "Timeline" },
    { href: `${base}/moves`, label: "Moves" },
    { href: `${base}/recommendations`, label: "Coach" },
  ] as const;

  return (
    <div className="sticky top-14 z-40 -mx-4 border-b border-zinc-800 bg-zinc-950/90 px-2 backdrop-blur sm:-mx-0">
      <div className="flex gap-1 overflow-x-auto pb-px scrollbar-none">
        {tabs.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "min-h-11 shrink-0 rounded-t-lg px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-zinc-900 text-cyan-400 ring-1 ring-b-0 ring-zinc-800"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
