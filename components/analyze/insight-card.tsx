"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { StageInsight } from "@/lib/analyze/types";
import { ConfidenceBadge } from "./confidence-badge";

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-sm leading-relaxed text-zinc-300">{children}</li>
  );
}

export function InsightCard({ insight }: { insight: StageInsight }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold tracking-tight text-zinc-50">
          {insight.stage}
        </h3>
        <ConfidenceBadge value={insight.confidence} />
      </div>
      <p className="mb-4 text-sm leading-relaxed text-zinc-400">{insight.summary}</p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="deep" className="border-zinc-800">
          <AccordionTrigger className="py-3 text-sm text-cyan-400 hover:no-underline">
            Deep analysis
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            {insight.workingWell.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400/90">
                  Working
                </p>
                <ul className="space-y-1.5 pl-0 list-none">
                  {insight.workingWell.map((x, i) => (
                    <Bullet key={i}>{x}</Bullet>
                  ))}
                </ul>
              </div>
            )}
            {insight.inefficiencies.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-400/90">
                  Inefficiencies
                </p>
                <ul className="space-y-1.5 list-none">
                  {insight.inefficiencies.map((x, i) => (
                    <Bullet key={i}>{x}</Bullet>
                  ))}
                </ul>
              </div>
            )}
            {insight.missedOptimizations.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Missed optimizations
                </p>
                <ul className="space-y-1.5 list-none">
                  {insight.missedOptimizations.map((x, i) => (
                    <Bullet key={i}>{x}</Bullet>
                  ))}
                </ul>
              </div>
            )}
            {insight.suggestions.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-400/90">
                  Suggestions
                </p>
                <ul className="space-y-1.5 list-none">
                  {insight.suggestions.map((x, i) => (
                    <Bullet key={i}>{x}</Bullet>
                  ))}
                </ul>
              </div>
            )}
            <p className="border-t border-zinc-800 pt-3 text-sm text-zinc-400">
              <span className="font-medium text-zinc-300">vs elite: </span>
              {insight.vsElite}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
