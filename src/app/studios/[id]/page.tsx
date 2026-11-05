import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Review = {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type Studio = {
  _id: string;
  name: string;
  category: string;
  location: string;
  pricePerHour: number;
  securityDeposit?: number;
  maxCapacity?: number;
  image: string;
  gallery?: string[];
  description: string;
  amenities: string[];
  rating?: number;
  reviews?: Review[];
  hostId?: string;
  hostName?: string;
  hostEmail?: string;
};

async function getStudio(
  id: string
): Promise<Studio | null> {
  try {
    const response = await apiFetch(
      `/api/studios/${id}`,
      {
        cache: "no-store",
      }
    );

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
  params: Promise<{ id: string }>;
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
    Number.isInteger(maxCapacity) &&
    maxCapacity > 0;

  const gallery = Array.from(
    new Set(
      [
        studio.image,
        ...(Array.isArray(studio.gallery)
          ? studio.gallery
          : []),
      ].filter(Boolean)
    )
  );

  const reviews = Array.isArray(studio.reviews)
    ? studio.reviews
    : [];

  const rating =
    typeof studio.rating === "number"
      ? studio.rating
      : 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container-studio py-8 sm:py-12">
        {/* Back */}
        <Link
          href="/studios"
          className="inline-flex text-sm font-semibold text-muted transition hover:text-foreground"
        >
          ← Back to Explore Studios
        </Link>

        {/* Main */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
          {/* Left */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface">
              <Image
                src={studio.image}
                alt={studio.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover"
              />
            </div>

            {/* Gallery */}
            {gallery.length > 1 && (
              <section className="mt-6">
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    Gallery
                  </p>

                  <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                    Explore the space
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {gallery.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface"
                    >
                      <Image
                        src={image}
                        alt={`${studio.name} gallery image ${
                          index + 1
                        }`}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover transition duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Studio Information */}
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {studio.category}
                </span>

                <span className="text-sm text-muted">
                  📍 {studio.location}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {studio.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <span className="font-semibold">
                  ⭐ {rating.toFixed(1)}
                </span>

                <span className="text-muted">
                  {reviews.length}{" "}
                  {reviews.length === 1
                    ? "review"
                    : "reviews"}
                </span>

                {validCapacity && (
                  <span className="text-muted">
                    👥 Up to {maxCapacity} guests
                  </span>
                )}
              </div>

              {/* Description */}
              <section className="mt-8">
                <h2 className="text-xl font-bold">
                  About this space
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted sm:text-base">
                  {studio.description}
                </p>
              </section>

              {/* Amenities */}
              {studio.amenities?.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-xl font-bold">
                    Facilities & Amenities
                  </h2>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {studio.amenities.map(
                      (amenity, index) => (
                        <div
                          key={`${amenity}-${index}`}
                          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm"
                        >
                          ✓ {amenity}
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}

              {/* Host Details */}
              <section className="mt-8">
                <h2 className="text-xl font-bold">
                  Host Details
                </h2>

                <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                        Host Name
                      </p>

                      <p className="mt-2 font-semibold">
                        {studio.hostName ||
                          "StudioSpace Host"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                        Host Email
                      </p>

                      <p className="mt-2 break-all font-semibold">
                        {studio.hostEmail ||
                          "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Reviews */}
              <section className="mt-10">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                      Reviews
                    </p>

                    <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                      What creators say
                    </h2>
                  </div>

                  <p className="font-semibold">
                    ⭐ {rating.toFixed(1)} / 5
                  </p>
                </div>

                {reviews.length > 0 ? (
                  <div className="mt-5 space-y-4">
                    {reviews.map((review) => (
                      <article
                        key={review._id}
                        className="rounded-2xl border border-border bg-surface p-5"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-bold">
                              {review.userName}
                            </p>

                            <p className="mt-1 text-sm">
                              {"⭐".repeat(
                                Math.max(
                                  1,
                                  Math.min(
                                    5,
                                    review.rating
                                  )
                                )
                              )}
                            </p>
                          </div>

                          <span className="text-xs text-muted">
                            {new Date(
                              review.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-muted">
                          {review.comment}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-border bg-surface p-6 text-center">
                    <p className="font-semibold">
                      No reviews yet
                    </p>

                    <p className="mt-2 text-sm text-muted">
                      Be the first creator to share your
                      experience.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Booking Card */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-lg sm:p-6">
              <p className="text-sm text-muted">
                Starting from
              </p>

              <div className="mt-1 flex items-end gap-2">
                <span className="text-3xl font-bold">
                  ৳{studio.pricePerHour}
                </span>

                <span className="pb-1 text-sm text-muted">
                  / hour
                </span>
              </div>

              {studio.securityDeposit !== undefined && (
                <div className="mt-4 rounded-xl bg-background p-4">
                  <p className="text-xs text-muted">
                    Security Deposit
                  </p>

                  <p className="mt-1 font-bold">
                    ৳{studio.securityDeposit}
                  </p>
                </div>
              )}

              {validCapacity && (
                <div className="mt-3 rounded-xl bg-background p-4">
                  <p className="text-xs text-muted">
                    Maximum Capacity
                  </p>

                  <p className="mt-1 font-bold">
                    {maxCapacity} guests
                  </p>
                </div>
              )}

              <Link
                href={`/studios/${studio._id}/book`}
                className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
              >
                Book this studio
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-muted">
                Secure your creative space and start
                producing.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}