import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
          StudioSpace
        </p>

        <h1 className="mt-6 text-8xl font-black tracking-tight sm:text-9xl">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold tracking-tight">
          This creative space doesn&apos;t exist.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted">
          The page you are looking for may have been moved, removed, or never
          existed.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-primary-hover"
          >
            Back to home
          </Link>

          <Link
            href="/studios"
            className="rounded-full border border-border px-6 py-3 font-semibold transition hover:bg-surface-hover"
          >
            Explore studios
          </Link>
        </div>
      </div>
    </main>
  );
}