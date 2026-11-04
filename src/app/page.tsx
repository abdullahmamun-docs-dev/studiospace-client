import HeroSlider from "./components/HeroSlider";
import FeaturedStudios from "./components/FeaturedStudios";
import Categories from "./components/Categories";
import HowBookingWorks from "./components/HowBookingWorks";
import HostSupport from "./components/HostSupport";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <HeroSlider />

      {/* Featured Studios */}
      <FeaturedStudios />

      {/* Browse Categories */}
      <Categories />

      {/* How Booking Works */}
      <HowBookingWorks />

      {/* Host Guarantee & Creator Support */}
      <HostSupport />
    </main>
  );
}