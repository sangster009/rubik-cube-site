import Link from "next/link";
import { SubscribeForm } from "@/components/subscribe-form";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Subscribe | SCM",
  description:
    "Subscribe by email or RSS to get notified when Micah posts new Rubik's cube algorithms.",
};

export default function SubscribePage() {
  return (
    <div className="container px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Subscribe
        </h1>
        <p className="mt-2 text-muted-foreground">
          Get notified when there&apos;s new content. We&apos;ll email you when Micah
          posts a new algorithm (about weekly). You can also use the RSS feed.
        </p>

        <div className="mt-8">
          <SubscribeForm variant="stacked" />
        </div>

        <div className="mt-8 border-t pt-8">
          <h2 className="text-sm font-medium">RSS feed</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add this feed to your reader to get new videos without email.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link href="/feed.xml">Open RSS feed</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
