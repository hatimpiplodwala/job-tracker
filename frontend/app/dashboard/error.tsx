"use client";

import { useEffect } from "react";
import { ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <Card className="flex flex-col items-center gap-3 px-8 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-sunken text-ink-soft">
          <ServerCrash className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Something went wrong
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            The dashboard failed to load. Try again or refresh the page.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={reset}>
          Try again
        </Button>
      </Card>
    </main>
  );
}
