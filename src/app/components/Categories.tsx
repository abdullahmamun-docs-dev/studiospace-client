import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Studio = {
  category: string;
};

const categories = [
  {
    number: "01",
    name: "Photo Studios",
    slug: "photo-studios",
    description:
      "Portraits, products, fashion, and campaign-ready photography spaces.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
  },
  {
    number: "02",
    name: "Sound Stages",
    slug: "sound-stages",
    description:
      "Production-ready spaces for video shoots, films, commercials, and creative projects.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
  },
  {
    number: "03",
    name: "Podcast Rooms",
    slug: "podcast-rooms",
    description:
      "Professional spaces for podcasts, interviews, and conversations.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    number: "04",
    name: "Music Suites",
    slug: "music-suites",
    description:
      "Recording rooms, rehearsal spaces, and music production studios.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
  },
  {
    number: "05",
    name: "Art Workshops",
    slug: "art-workshops",
    description:
      "Flexible creative spaces for artists, workshops, exhibitions, and projects.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
];

async function getStudios(): Promise<Studio[]> {
  const response = await apiFetch("/api/studios", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch studios");
  }

  return response.json();
}

function getCategoryCount(studios: Studio[], slug: string) {
  const categoryMap: Record<string, string[]> = {
    "photo-studios": ["Photo Studios", "Photography"],
    "sound-stages": ["Sound Stages", "Video Production", "Film & Video"],
    "podcast-rooms": ["Podcast Rooms", "Podcast"],
    "music-suites": ["Music Suites", "Music", "Music & Recording"],
    "art-workshops": ["Art Workshops", "Art", "Creative Events"],
  };

  const allowedCategories = categoryMap[slug] || [];

  return studios.filter((studio) =>
    allowedCategories.includes(studio.category)
  ).length;
}

export default async function Categories() {
  const studios = await getStudios();

  return (
    <section className="bg-background py-14 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm sm:tracking-[0.2em]">
            Explore by category
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Find the right space for the way you create.
          </h2>

          <p className="mt-4 text-sm leading-6 text-muted sm:text-base sm:leading-7">
            Explore creative spaces designed for photography, music, podcasts,
            production, and art.
          </p>
        </div>

        {/* Category cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {categories.map((category) => {
            const count = getCategoryCount(studios, category.slug);

            return (
              <Link
                key={category.slug}
                href={`/studios?category=${category.slug}`}
                className="group relative min-h-[330px] overflow-hidden rounded-2xl border border-border bg-surface sm:min-h-[360px]"
              >
                {/* Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-primary">
                      {category.number}
                    </span>

                    <span className="shrink-0 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white sm:px-3 sm:text-xs">
                      {count} {count === 1 ? "space" : "spaces"}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-bold text-white sm:mt-4 sm:text-2xl">
                    {category.name}
                  </h3>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-300 sm:text-sm sm:leading-6">
                    {category.description}
                  </p>

                  <p className="mt-4 text-xs font-bold text-primary sm:mt-5 sm:text-sm">
                    Explore category →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}