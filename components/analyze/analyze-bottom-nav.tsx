"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, GitCompare, History, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/analyze", label: "Lab", icon: BarChart3 },
  { href: "/analyze/upload", label: "Import", icon: Plus },
  { href: "/analyze/history", label: "History", icon: History },
  { href: "/analyze/compare", label: "Compare", icon: GitCompare },
] as const;

export function AnalyzeBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      aria-label="Solve lab navigation"
    >
      <div className="mx-auto flex max-w-lg justify-around gap-1 px-2 pt-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/analyze"
              ? pathname === "/analyze"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-12 min-w-[4.5rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-xs font-medium transition-colors",
                active
                  ? "text-cyan-400"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon className={cn("size-6", active && "stroke-[2.5]")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
