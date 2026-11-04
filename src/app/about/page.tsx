import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Find a studio",
    description:
      "Explore creative spaces by category, location, and your project needs.",
  },
  {
    number: "02",
    title: "Choose your time",
    description:
      "Select the date, start time, end time, and number of guests.",
  },
  {
    number: "03",
    title: "Book your space",
    description:
      "Confirm your booking and get ready to create in a space that fits your project.",
  },
];

const features = [
  "Creative studios for different types of projects",
  "Simple studio discovery and booking",
  "Clear hourly pricing",
  "Secure user accounts",
  "Easy access to your bookings",
  "Spaces for creators, artists, and teams",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border bg-surface-soft">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            How StudioSpace works
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Find the right space for your next creative project.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            StudioSpace makes it easier to discover and book creative spaces
            for photography, music, podcasts, video production, and content
            creation.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/studios" className="studio-primary-button">
              Explore Studios
            </Link>

            <Link href="/studios" className="studio-secondary-button">
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Simple process
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Book a creative space in three steps.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <span className="text-sm font-bold text-primary">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us / Why StudioSpace */}
      <section
        id="about-us"
        className="scroll-mt-24 border-y border-border bg-surface-soft py-20 sm:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              About Us
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Built around the needs of creators.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              Finding the right environment can make a big difference to a
              creative project. StudioSpace brings different types of spaces
              together in one simple platform.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-primary">✓</span>

                  <p className="text-sm leading-6 text-muted">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to create something?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted">
            Explore available studios and find a space that fits your next
            project.
          </p>

          <Link href="/studios" className="studio-primary-button mt-7">
            Explore Studios
          </Link>
        </div>
      </section>
    </main>
  );
}