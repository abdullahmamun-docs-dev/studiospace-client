const supportItems = [
  {
    title: "Liability Protection",
    description:
      "Extra peace of mind for hosts and creators while using StudioSpace.",
  },
  {
    title: "Verified Profiles",
    description:
      "Connect with trusted creators and hosts through verified user profiles.",
  },
  {
    title: "Equipment Safety",
    description:
      "Clear studio information helps creators use equipment responsibly.",
  },
  {
    title: "24/7 Host Support",
    description:
      "Get support when you need help with your studio or booking.",
  },
];

export default function HostSupport() {
  return (
    <section className="section-space">
      <div className="container-studio">

        <div className="section-heading">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">
            For Hosts & Creators
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Host Guarantee & Creator Support
          </h2>

          <p className="mt-4 text-muted">
            StudioSpace is designed to make creative space sharing safer,
            easier, and more reliable for everyone.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {supportItems.map((item) => (
            <div
              key={item.title}
              className="studio-card p-6"
            >
              <h3 className="text-lg font-bold">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}