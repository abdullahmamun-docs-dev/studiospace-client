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
  description: string;
  amenities: string[];
  rating?: number;
};

type StudiosPageProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
};

const categoryMap: Record<string, string[]> = {
  "photo-studios": ["Photo Studios", "Photography"],
  "sound-stages": [
    "Sound Stages",
    "Video Production",
    "Film & Video",
  ],
  "podcast-rooms": ["Podcast Rooms", "Podcast"],
  "music-suites": [
    "Music Suites",
    "Music",
    "Music & Recording",
  ],
  "art-workshops": [
    "Art Workshops",
    "Art",
    "Creative Events",
  ],
};

const categoryNames: Record<string, string> = {
  "photo-studios": "Photo Studios",
  "sound-stages": "Sound Stages",
  "podcast-rooms": "Podcast Rooms",
  "music-suites": "Music Suites",
  "art-workshops": "Art Workshops",
};

async function getStudios(
  category?: string,
  searchQuery?: string
): Promise<Studio[]> {
  const response = await apiFetch("/api/studios", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch studios");
  }

  const studios: Studio[] = await response.json();

  let filteredStudios = studios;

  // Category filter
  if (category) {
    const allowedCategories = categoryMap[category];

    if (!allowedCategories) {
      return [];
    }

    filteredStudios = filteredStudios.filter((studio) =>
      allowedCategories.includes(studio.category)
    );
  }

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase().trim();

    filteredStudios = filteredStudios.filter((studio) => {
      return (
        studio.name.toLowerCase().includes(query) ||
        studio.location.toLowerCase().includes(query) ||
        studio.category.toLowerCase().includes(query) ||
        studio.description.toLowerCase().includes(query)
      );
    });
  }

  return filteredStudios;
}

export default async function StudiosPage({
  searchParams,
}: StudiosPageProps) {
  const params = await searchParams;

  const category = params.category?.toLowerCase();
  const searchQuery = params.q?.trim() || "";

  const studios = await getStudios(category, searchQuery);

  const selectedCategory = category
    ? categoryNames[category] || "Studios"
    : "All Studios";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="border-b border-border bg-surface-soft">
        <div className="container-studio py-10 sm:py-14 lg:py-20">
          <Link
            href="/"
            className="text-xs font-semibold text-muted transition-colors hover:text-primary sm:text-sm"
          >
            ← Back to home
          </Link>

          <div className="mt-7 flex flex-col gap-6 sm:mt-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm sm:tracking-[0.2em]">
                {selectedCategory}
              </p>

              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {category
                  ? `Spaces for ${selectedCategory.toLowerCase()}.`
                  : "Find a space made for your work."}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
                Discover creative studios for photography, music,
                podcasts, production, and art.
              </p>
            </div>

            {category && (
              <Link
                href="/studios"
                className="studio-secondary-button w-fit shrink-0 text-sm"
              >
                View all studios
              </Link>
            )}
          </div>

          {/* Search */}
          <form
            action="/studios"
            method="GET"
            className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row"
          >
            {category && (
              <input
                type="hidden"
                name="category"
                value={category}
              />
            )}

            <div className="relative flex-1">
              <label htmlFor="studio-search" className="sr-only">
                Search studios
              </label>

              <input
                id="studio-search"
                name="q"
                type="search"
                defaultValue={searchQuery}
                placeholder="Search by studio name, location, category..."
                className="h-12 w-full rounded-full border border-border bg-surface px-5 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="studio-primary-button h-12 shrink-0 px-6"
            >
              Search
            </button>

            {searchQuery && (
              <Link
                href={
                  category
                    ? `/studios?category=${category}`
                    : "/studios"
                }
                className="studio-secondary-button h-12 shrink-0"
              >
                Clear
              </Link>
            )}
          </form>
        </div>
      </section>

      {/* Studios */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container-studio">
          {/* Active filters */}
          {(category || searchQuery) && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">
                Active filters:
              </span>

              {category && (
                <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold">
                  {selectedCategory}
                </span>
              )}

              {searchQuery && (
                <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold">
                  Search: “{searchQuery}”
                </span>
              )}
            </div>
          )}

          {/* Result count */}
          <div className="mb-6 sm:mb-8">
            <p className="text-sm text-muted">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {studios.length}
              </span>{" "}
              {studios.length === 1
                ? "creative space"
                : "creative spaces"}
            </p>
          </div>

          {/* Empty state */}
          {studios.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface px-5 py-12 text-center sm:px-6 sm:py-16">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border text-lg text-primary sm:h-14 sm:w-14 sm:text-xl">
                ◌
              </div>

              <h2 className="mt-5 text-xl font-bold sm:mt-6 sm:text-2xl">
                No spaces found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                {searchQuery
                  ? `We could not find any studios matching "${searchQuery}". Try another search term.`
                  : "We do not have any studios listed in this category yet. Explore all available spaces instead."}
              </p>

              <Link
                href="/studios"
                className="studio-primary-button mt-6 w-full sm:w-auto"
              >
                Explore all studios
              </Link>
            </div>
          ) : (
            /* Studio cards */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {studios.map((studio) => (
                <article
                  key={studio._id}
                  className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl"
                >
                  {/* Image */}
                  <div className="relative h-56 w-full overflow-hidden sm:h-64 lg:h-72">
                    <Image
                      src={studio.image}
                      alt={studio.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Category */}
                    <span className="absolute left-3 top-3 max-w-[80%] truncate rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:left-4 sm:top-4">
                      {studio.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      {/* Studio info */}
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold tracking-tight sm:text-xl">
                          {studio.name}
                        </h2>

                        <p className="mt-1 truncate text-sm text-muted">
                          {studio.location}
                        </p>

                        {/* Rating */}
                        <p className="mt-2 text-sm font-semibold">
                          ⭐ {studio.rating ?? 0}
                        </p>
                      </div>

                      {/* Price */}
                      <p className="shrink-0 text-sm font-bold text-primary sm:text-base">
                        ৳{studio.pricePerHour}
                        <span className="font-normal text-muted">
                          /hr
                        </span>
                      </p>
                    </div>

                    {/* View Details */}
                    <Link
                      href={`/studios/${studio._id}`}
                      className="mt-5 flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}