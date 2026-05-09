import { Skeleton } from "@/components/ui/skeleton";

export function AnalysisOverviewSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-36 w-full rounded-2xl bg-zinc-800" />
      <Skeleton className="h-24 w-full rounded-2xl bg-zinc-800" />
      <Skeleton className="h-48 w-full rounded-2xl bg-zinc-800" />
    </div>
  );
}

export function JobProcessingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="mx-auto h-4 w-48 rounded bg-zinc-800" />
      <Skeleton className="h-3 w-full rounded-full bg-zinc-800" />
      <Skeleton className="h-20 w-full rounded-xl bg-zinc-800" />
    </div>
  );
}
