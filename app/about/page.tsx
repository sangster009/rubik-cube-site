import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Trophy, Target, Calendar } from "lucide-react";

const MICAH_IMAGE = "/micah-mug.png";

const WCA_PROFILE = "https://www.worldcubeassociation.org/persons/2022YEOM01";

const STATS = [
  { label: "Region", value: "United States" },
  { label: "WCA ID", value: "2022YEOM01" },
  { label: "Competitions", value: "70" },
  { label: "Completed solves", value: "2,139" },
] as const;

const MEDALS = [
  { type: "Gold", count: 8, label: "1st place" },
  { type: "Silver", count: 7, label: "2nd place" },
  { type: "Bronze", count: 14, label: "3rd place" },
] as const;

const RECORDS = [
  { event: "3×3×3 Cube", single: "5.32", average: "6.59", note: "NR 122 · Sub-7 average" },
  { event: "3×3×3 One-Handed", single: "7.95", average: "10.25", note: "NR 24 · Top 30 in North America" },
  { event: "2×2×2 Cube", single: "1.40", average: "2.77" },
  { event: "4×4×4 Cube", single: "30.14", average: "34.21" },
  { event: "5×5×5 Cube", single: "1:01.71", average: "1:12.60" },
  { event: "6×6×6 Cube", single: "2:57.17", average: "3:10.52" },
  { event: "7×7×7 Cube", single: "5:35.57" },
  { event: "Square-1", single: "8.17", average: "13.51" },
  { event: "Megaminx", single: "51.49", average: "1:02.44" },
  { event: "Clock", single: "6.63", average: "10.68" },
  { event: "Pyraminx", single: "3.28", average: "6.97" },
  { event: "Skewb", single: "3.91", average: "8.65" },
] as const;

export const metadata = {
  title: "About Micah | Cubing with Micah",
  description:
    "Micah Yeo – WCA speedcuber (2022YEOM01). US competitor with 70+ competitions, sub-7 3×3 average, and top rankings in 3×3 One-Handed.",
};

export default function AboutPage() {
  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="relative size-[6.5rem] shrink-0 sm:size-[7.8rem]">
            <Image
              src={MICAH_IMAGE}
              alt="Micah Yeo"
              fill
              className="rounded-full object-cover ring-4 ring-primary/10 shadow-lg"
              sizes="(max-width: 640px) 104px, 125px"
              priority
            />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
            About Micah
          </h1>
          <p className="mt-2 text-muted-foreground">
            Speedcuber, algorithm creator, and the voice behind Cubing with Micah&apos;s weekly
            tutorials.
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">WCA competitor</CardTitle>
            <CardDescription>
              Official results from the{" "}
              <a
                href="https://www.worldcubeassociation.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                World Cube Association
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {STATS.map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <Calendar className="size-4 text-muted-foreground" aria-hidden />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {label}
                    </p>
                    <p className="font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Trophy className="size-4" aria-hidden />
                Medal collection
              </h3>
              <div className="flex flex-wrap gap-2">
                {MEDALS.map(({ type, count }) => (
                  <Badge key={type} variant="secondary">
                    {count} {type}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Target className="size-4" aria-hidden />
                Personal records
              </h3>
              <p className="mb-4 text-xs text-muted-foreground">
                Current singles and averages (as on WCA profile). NR = National
                Rank, CR = Continental Rank.
              </p>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-2 text-left font-medium">Event</th>
                      <th className="px-3 py-2 text-right font-medium">Single</th>
                      <th className="px-3 py-2 text-right font-medium">Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECORDS.map((row) => (
                      <tr
                        key={row.event}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-3 py-2">
                          <span className="font-medium">{row.event}</span>
                          {row.note && (
                            <p className="text-xs text-muted-foreground">
                              {row.note}
                            </p>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {row.single}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {row.average ?? "–"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2">
              <Button asChild variant="outline" size="sm">
                <a
                  href={WCA_PROFILE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <ExternalLink className="size-4" />
                  View full WCA profile
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Button asChild variant="ghost">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
