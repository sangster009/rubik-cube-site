import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Notation } from "@/components/notation";
import type { SolveStep } from "@/lib/content";
import { Play } from "lucide-react";

interface StepCardProps {
  step: SolveStep;
  stepIndex: number;
  totalSteps: number;
  basePath?: string;
  id?: string;
}

/** Extract first algorithm-like string from body (e.g. "R U R' U'") for preview */
function getAlgFromBody(body: string): string | null {
  const match = body.match(/([RUFDLB][2']?\s*)+/);
  return match ? match[0].trim() : null;
}

export function StepCard({
  step,
  stepIndex,
  totalSteps,
  basePath = "/solve/3x3",
  id,
}: StepCardProps) {
  const alg = getAlgFromBody(step.body);
  const watchUrl =
    step.youtubeId &&
    `https://www.youtube.com/watch?v=${step.youtubeId}`;

  return (
    <Card id={id} className="overflow-hidden scroll-mt-20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">
            Step {stepIndex + 1} of {totalSteps}: {step.title}
          </CardTitle>
        </div>
        {alg && (
          <CardDescription className="mt-1">
            <Notation alg={alg} />
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {step.body}
        </p>
        {watchUrl && (
          <Button asChild variant="outline" size="sm">
            <Link
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Play className="size-4" />
              Watch
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
