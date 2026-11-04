
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";

const categories = [
  {
    title: "Photography",
    description:
      "Professional spaces for portraits, products, fashion, campaigns, and creative shoots.",
    count: "24 studios",
    query: "photography",
  },
  {
    title: "Music & Recording",
    description:
      "Recording rooms and music spaces built for artists, producers, and performers.",
    count: "18 studios",
    query: "music",
  },
  {
    title: "Podcast",
    description:
      "Ready-to-use podcast spaces for interviews, conversations, and content production.",
    count: "12 studios",
    query: "podcast",
  },
  {
    title: "Video Production",
    description:
      "Production-ready spaces for commercials, short films, music videos, and branded content.",
    count: "16 studios",
    query: "video",
  },
  {
    title: "Content Creation",
    description:
      "Flexible creator spaces for YouTube, social media, livestreams, and digital content.",
    count: "21 studios",
    query: "content",
  },
  {
    title: "Creative Events",
    description:
      "Unique venues for workshops, launches, exhibitions, meetups, and creative gatherings.",
    count: "9 studios",
    query: "events",
  },
];

export default function CategoriesPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="border-b border-border py-20 sm:py-28">
          <div className="container-studio">
            <div className="section-heading">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Explore by category
              </p>

              <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                Find a space that fits your creative work.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                Whether you are shooting photos, recording music, producing
                video, or creating content, discover spaces designed around
                the way you work.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="section-space">
          <div className="container-studio">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <article
                  key={category.title}
                  className="studio-card group flex min-h-72 flex-col justify-between p-7"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black tracking-widest text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted">
                        {category.count}
                      </span>
                    </div>

                    <h2 className="mt-8 text-2xl font-bold tracking-tight">
                      {category.title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-muted">
                      {category.description}
                    </p>
                  </div>

                  <Link
                    href={`/studios?category=${category.query}`}
                    className="mt-8 inline-flex items-center text-sm font-bold text-primary transition-transform group-hover:translate-x-1"
                  >
                    Explore spaces
                    <span className="ml-2">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20 sm:pb-28">
          <div className="container-studio">
            <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Own a creative space?
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                Turn your studio into an opportunity.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-muted">
                List your space on StudioSpace and connect with creators
                looking for the right place to bring their ideas to life.
              </p>

              <div className="mt-8">
                <Link
                  href="/studios"
                  className="studio-primary-button"
                >
                  List Your Studio
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}
