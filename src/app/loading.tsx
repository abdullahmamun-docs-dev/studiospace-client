export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-surface shadow-[0_0_40px_rgba(229,168,75,0.12)]">
          <div className="absolute h-9 w-9 rounded-full border-2 border-primary/80" />

          <div className="absolute h-5 w-5 rotate-45 rounded-[6px] border-2 border-primary" />

          <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_14px_rgba(229,168,75,0.8)]" />
        </div>

        <h1 className="mt-5 text-xl font-bold tracking-tight">
          Studio<span className="text-primary">Space</span>
        </h1>

        <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-surface-hover">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>

        <p className="mt-4 text-sm font-medium text-muted">
          Preparing your creative space...
        </p>
      </div>
    </main>
  );
}