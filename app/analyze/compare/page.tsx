import { Suspense } from "react";
import { AnalyzeCompareClient } from "./compare-client";

export default function AnalyzeComparePage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-zinc-500">Loading…</div>
      }
    >
      <AnalyzeCompareClient />
    </Suspense>
  );
}
