import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Studio = {
  _id: string;
  name: string;
  category: string;
  location: string;
  pricePerHour: number;
  image: string;
  rating?: number;
};

async function getFeaturedStudios(): Promise<Studio[]> {
  const response = await apiFetch("/api/studios?limit=6", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch featured studios");
  }

  const studios: Studio[] = await response.json();

  return studios.slice(0, 6);
}

export default async function FeaturedStudios() {
  const studios = await getFeaturedStudios();

  return (
    <section className="bg-background py-14 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm sm:tracking-[0.2em]">
              Featured spaces
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Spaces built for your next big idea.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Explore creative spaces for photography, music, production,
              content creation, and more.
            </p>
          </div>

          <Link
            href="/studios"
            className="w-fit text-sm font-bold text-primary transition-colors hover:text-primary-hover"
          >
            View all studios →
          </Link>
        </div>

        {/* Empty State */}
        {studios.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface-soft p-8 text-center sm:mt-10 sm:p-12">
            <p className="text-lg font-bold">
              No featured studios available yet.
            </p>

            <p className="mt-2 text-sm text-muted">
              Check back soon for new creative spaces.
            </p>

            <Link
              href="/studios"
              className="studio-primary-button mt-5 inline-flex"
            >
              Explore Studios
            </Link>
          </div>
        ) : (
          /* Studio cards */
          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                {/* Image */}
                <div className="relative h-56 w-full shrink-0 overflow-hidden sm:h-60 lg:h-64">
                  <Image
                    src={studio.image}
                    alt={studio.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Category */}
                  <span className="absolute left-3 top-3 max-w-[80%] truncate rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white sm:left-4 sm:top-4">
                    {studio.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold sm:text-xl">
                        {studio.name}
                      </h3>

                      <p className="mt-1 truncate text-sm text-muted">
                        {studio.location}
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        ⭐ {studio.rating ?? 0}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-primary sm:text-base">
                      ৳{studio.pricePerHour}
                      <span className="font-normal text-muted">/hr</span>
                    </p>
                  </div>

                  <Link
                    href={`/studios/${studio._id}`}
                    className="mt-auto pt-5"
                  >
                    <span className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover">
                      View Details
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}