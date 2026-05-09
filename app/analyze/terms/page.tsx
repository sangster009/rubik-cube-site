import Link from "next/link";

export default function AnalyzeTermsPage() {
  return (
    <article className="prose prose-invert prose-sm max-w-none py-4 prose-p:text-zinc-400 prose-headings:text-zinc-100">
      <h1 className="text-xl font-bold text-zinc-50">Solve lab terms</h1>
      <p>
        This feature targets experienced WCA competitors. Metrics are{" "}
        <strong>model estimates</strong>, not officiated results. Finger tricks,
        lookahead, and recognition splits can be wrong — always cross-check with
        reconstruction or hardware logging.
      </p>
      <h2 className="text-base font-semibold">Retention</h2>
      <p>
        On this demo deployment, jobs live in an in-memory store and may be lost
        on cold start. Production should use explicit retention windows, encrypted
        object storage, and regional compliance review.
      </p>
      <h2 className="text-base font-semibold">YouTube</h2>
      <p>
        You supply links; we fetch through the app pipeline for analysis only.
        Respect creator rights, platform ToS, and minors&apos; privacy. Do not
        submit third-party footage without permission.
      </p>
      <h2 className="text-base font-semibold">Corrections</h2>
      <p>
        Use the notes field on results to log ground truth (e.g. actual AUF,
        mis-detected rotations). That helps future model iterations and keeps
        coaching honest.
      </p>
      <Link href="/analyze/upload" className="text-cyan-400">
        ← Back to import
      </Link>
    </article>
  );
}
