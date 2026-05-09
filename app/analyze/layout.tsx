import { AnalyzeBottomNav } from "@/components/analyze/analyze-bottom-nav";

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-1 flex-col bg-zinc-950 text-zinc-50">
      <div className="mx-auto w-full max-w-lg flex-1 px-4 pb-28 pt-2 sm:max-w-xl">
        {children}
      </div>
      <AnalyzeBottomNav />
    </div>
  );
}
