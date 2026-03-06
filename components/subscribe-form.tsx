"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SubscribeFormProps {
  className?: string;
  variant?: "inline" | "stacked" | "footer";
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SubscribeForm({
  className,
  variant = "stacked",
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setSuccess(true);
      setEmail("");
      toast.success("You're subscribed! We'll notify you when there's new content.");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return variant === "footer" ? (
      <p className="text-xs text-muted-foreground">You&apos;re subscribed.</p>
    ) : (
      <p className="text-sm text-muted-foreground">
        You&apos;re subscribed. We&apos;ll email you when there&apos;s new content. You can also follow via{" "}
        <a href="/feed.xml" className="text-primary underline underline-offset-2">RSS</a>.
      </p>
    );
  }

  const isStacked = variant === "stacked";
  const isInline = variant === "inline";
  const isFooter = variant === "footer";
  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      aria-label="Subscribe by email"
    >
      <div
        className={
          isFooter
            ? "flex gap-2"
            : isStacked
              ? "flex flex-col gap-2"
              : isInline
                ? "flex flex-row gap-2"
                : "flex flex-col sm:flex-row gap-2 sm:gap-2"
        }
      >
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className={
            isFooter
              ? "h-8 w-44 text-sm"
              : isInline
                ? "w-1/2 min-w-0 shrink"
                : "min-w-0"
          }
          aria-label="Email address"
        />
        <Button
          type="submit"
          variant={isFooter ? "default" : "secondary"}
          size={isFooter ? "sm" : "default"}
          disabled={loading}
          className={isFooter ? "h-8 shrink-0 px-3 text-sm" : "shrink-0"}
        >
          {loading ? "…" : "Subscribe"}
        </Button>
      </div>
      {!isFooter && (
        <p className="mt-2 text-xs text-muted-foreground">
          Get notified when Micah posts new algorithms. Or use the{" "}
          <a href="/feed.xml" className="text-primary underline underline-offset-2">RSS feed</a>.
        </p>
      )}
    </form>
  );
}
