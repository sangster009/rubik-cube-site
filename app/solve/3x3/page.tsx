import Link from "next/link";
import { getSolveSteps } from "@/lib/content";
import { StepCard } from "@/components/step-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Solve 3×3 | SCM",
  description: "Step-by-step guide to solve the 3×3 Rubik's cube: cross, F2L, OLL, PLL.",
};

export default function Solve3x3Page() {
  const steps = getSolveSteps("3x3");

  return (
    <div className="container px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Solve the 3×3 Cube
        </h1>
        <p className="mt-2 text-muted-foreground">
          Follow these steps in order: cross, F2L, OLL, then PLL.
        </p>

        <div className="mt-8 space-y-8">
          {steps.map((step, index) => (
            <div key={step.order}>
              <StepCard
                step={step}
                stepIndex={index}
                totalSteps={steps.length}
                basePath="/solve/3x3"
                id={`step-${index + 1}`}
              />
              {index < steps.length - 1 && (
                <div className="mt-6 flex justify-between">
                  <Button asChild variant="ghost" size="sm">
                    <Link
                      href={index > 0 ? `#step-${index}` : "#step-1"}
                      className="inline-flex items-center gap-1"
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link
                      href={`#step-${index + 2}`}
                      className="inline-flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <Link href="/weekly">Watch weekly algorithms</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
