import { JobSubnav } from "@/components/analyze/job-subnav";

export default async function AnalyzeJobLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex flex-col gap-2">
      <JobSubnav jobId={id} />
      {children}
    </div>
  );
}
