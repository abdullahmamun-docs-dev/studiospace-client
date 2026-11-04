const steps = [
  {
    number: "01",
    title: "Discover Spaces",
    description: "Explore creative studios and find the right space for your project.",
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description: "Choose the date and number of hours that work best for you.",
  },
  {
    number: "03",
    title: "Book Instantly",
    description: "Confirm your booking and secure your creative space.",
  },
  {
    number: "04",
    title: "Create & Produce",
    description: "Arrive at the studio and bring your creative ideas to life.",
  },
];

export default function HowBookingWorks() {
  return (
    <section className="section-space">
      <div className="container-studio">

        <div className="section-heading">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">
            Simple Process
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            How Booking Works
          </h2>

          <p className="mt-4 text-muted">
            From finding a studio to creating your project, StudioSpace keeps
            the booking process simple.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="studio-card p-6"
            >
              <span className="text-sm font-bold text-primary">
                {step.number}
              </span>

              <h3 className="mt-4 text-lg font-bold">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}