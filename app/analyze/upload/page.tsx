"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AnalyzeUploadPage() {
  const router = useRouter();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createYoutubeJob() {
    setError(null);
    if (!consent) {
      setError("Confirm retention terms to continue.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/analyze/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "youtube", youtubeUrl }),
      });
      const data = (await res.json()) as { jobId?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      router.push(`/analyze/jobs/${data.jobId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function createUploadJobAndPick() {
    setError(null);
    if (!consent) {
      setError("Confirm retention terms to continue.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/analyze/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "upload" }),
      });
      const data = (await res.json()) as {
        jobId?: string;
        presignedUpload?: { url: string };
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      const jobId = data.jobId;
      const uploadUrl = data.presignedUpload?.url;
      if (!jobId || !uploadUrl) throw new Error("Missing upload target");

      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/*";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) {
          setBusy(false);
          return;
        }
        const fd = new FormData();
        fd.set("file", file);
        const up = await fetch(uploadUrl, { method: "POST", body: fd });
        if (!up.ok) {
          setError("Upload failed");
          setBusy(false);
          return;
        }
        setBusy(false);
        router.push(`/analyze/jobs/${jobId}`);
      };
      input.click();
      setBusy(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h1 className="text-xl font-bold text-zinc-50">Import solve</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Large tap targets, fast path. Max ~80MB per upload on this demo
          deployment.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-300">
          YouTube URL
        </label>
        <Input
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
          className="min-h-12 border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600"
        />
        <Button
          type="button"
          disabled={busy || !youtubeUrl.trim()}
          className="min-h-12 w-full bg-cyan-600 text-white hover:bg-cyan-500"
          onClick={createYoutubeJob}
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : "Queue YouTube ingest"}
        </Button>
      </div>

      <div className="relative py-2 text-center text-xs text-zinc-500">
        <span className="bg-zinc-950 px-2">or</span>
        <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-zinc-800" />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={busy}
        className="min-h-12 w-full border-zinc-700 bg-zinc-900/50"
        onClick={createUploadJobAndPick}
      >
        Upload video file
      </Button>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 size-5 shrink-0 rounded border-zinc-600"
        />
        <span className="text-sm leading-relaxed text-zinc-400">
          I agree uploads/URLs are processed for analysis; demo instances may retain
          data in memory only.{" "}
          <Link href="/analyze/terms" className="text-cyan-400 underline">
            Full terms
          </Link>
        </span>
      </label>

      {error && (
        <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
