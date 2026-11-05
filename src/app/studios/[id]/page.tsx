import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Studio = {
  _id: string;
  name: string;
  category: string;
  location: string;
  pricePerHour: number;
  securityDeposit?: number;
  maxCapacity?: number;
  image: string;
  description: string;
  amenities: string[];
  rating?: number;
};

async function getStudio(id: string): Promise<Studio | null> {
  try {
    const response = await apiFetch(`/api/studios/${id}`, {
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch studio: ${response.status}`
      );
    }

    const studio: Studio = await response.json();

    return studio ?? null;
  } catch (error) {
    console.error("Failed to load studio:", error);
    throw error;
  }
}

type StudioDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudioDetailsPage({
  params,
}: StudioDetailsPageProps) {
  const { id } = await params;

  const studio = await getStudio(id);

  if (!studio) {
    notFound();
  }

  const maxCapacity = Number(studio.maxCapacity);

  const validCapacity =
    Number.isInteger(maxCapacity) && maxCapacity > 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top navigation */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <Link
            href="/studios"
            className="text-xs font-semibold text-muted transition-colors hover:text-primary sm:text-sm"
          >
            ← Back to studios
          </Link>

          <span className="text-sm font-bold tracking-tight sm:text-base">
            StudioSpace
          </span>
        </div>
      </div>

      {/* Studio details */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Image */}
          <div className="relative h-[280px] overflow-hidden rounded-2xl border border-border sm:h-[400px] sm:rounded-3xl md:h-[480px] lg:h-[620px]">
            <Image
              src={studio.image}
              alt={studio.name}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
              className="object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/30 to-transparent p-5 sm:p-8 md:p-10">
              <span className="inline-flex max-w-full rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground sm:px-4 sm:py-2 sm:text-xs">
                {studio.category}
              </span>

              <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:mt-4 sm:text-5xl md:text-6xl">
                {studio.name}
              </h1>

              <p className="mt-2 text-xs font-medium text-white/80 sm:mt-3 sm:text-base">
                {studio.location}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 grid gap-8 sm:mt-10 sm:gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
            {/* Left content */}
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm sm:tracking-[0.2em]">
                About this space
              </p>

              <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                Built for creators who need room to make.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:mt-5 sm:text-base sm:leading-8">
                {studio.description}
              </p>

              {/* Rating */}
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold">
                <span>⭐</span>

                <span>{studio.rating ?? 0}</span>

                <span className="font-normal text-muted">
                  Studio rating
                </span>
              </div>

              {/* Facilities */}
              <div className="mt-8 sm:mt-10">
                <h3 className="text-lg font-bold sm:text-xl">
                  Studio facilities
                </h3>

                {studio.amenities.length > 0 ? (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2">
                    {studio.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="rounded-xl border border-border bg-surface p-3.5 text-sm font-medium sm:p-4"
                      >
                        <span className="mr-2 text-primary sm:mr-3">
                          ✓
                        </span>

                        {amenity}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted">
                    No facilities have been added yet.
                  </p>
                )}
              </div>
            </div>

            {/* Booking Card */}
            <aside className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-6 lg:sticky lg:top-8">
              <p className="text-sm text-muted">
                Starting from
              </p>

              <div className="mt-2">
                <span className="text-2xl font-bold text-primary sm:text-3xl">
                  ৳{Number(studio.pricePerHour).toLocaleString()}
                </span>

                <span className="text-xs text-muted sm:text-sm">
                  {" "}
                  / hour
                </span>
              </div>

              <div className="my-5 border-t border-border sm:my-6" />

              <div className="space-y-4 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-muted">
                    Location
                  </span>

                  <span className="text-right font-semibold">
                    {studio.location}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-muted">
                    Category
                  </span>

                  <span className="text-right font-semibold">
                    {studio.category}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-muted">
                    Maximum guests
                  </span>

                  <span className="text-right font-semibold">
                    {validCapacity
                      ? `${maxCapacity} guests`
                      : "Not configured"}
                  </span>
                </div>

                {studio.securityDeposit !== undefined && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-muted">
                      Security deposit
                    </span>

                    <span className="text-right font-semibold">
                      ৳
                      {Number(
                        studio.securityDeposit
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* BOOK BUTTON */}
              <Link
                href={`/studios/${studio._id}/book`}
                className="mt-6 flex w-full items-center justify-center rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary-hover sm:mt-7"
              >
                Book this studio
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-muted">
                Choose your date and time to continue with
                the booking.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}