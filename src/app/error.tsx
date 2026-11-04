
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("StudioSpace error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
          StudioSpace
        </p>

        <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-danger/30 bg-surface">
          <span className="text-3xl font-bold text-danger">!</span>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Something went wrong!
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted sm:text-base">
          Something unexpected happened while loading this page.
          Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="studio-primary-button mt-8 min-h-11"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
