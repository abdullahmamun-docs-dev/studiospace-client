"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    eyebrow: "PHOTOGRAPHY • PRODUCTION",
    title: "A space that makes your creative vision feel real.",
    description:
      "Discover inspiring studios built for photography, video production, campaigns, and creative projects.",
    button: "Explore Studios",
    href: "/studios",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: 2,
    eyebrow: "MUSIC • AUDIO • PODCAST",
    title: "Find the room where your next sound comes alive.",
    description:
      "Book purpose-built music rooms, recording spaces, podcast studios, and audio-ready creative environments.",
    button: "Explore Audio Spaces",
    href: "/studios?category=music",
    image:
      "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: 3,
    eyebrow: "CREATORS • HOSTS • COMMUNITY",
    title: "Turn your creative space into an opportunity.",
    description:
      "List your studio, connect with creators, and earn from your space when you are not using it.",
    button: "Host Your Space",
    href: "/host",
    image:
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1400&q=85",
  },
];

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slide = slides[activeSlide];

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  return (
    <section className="overflow-hidden bg-background">
      <div className="mx-auto grid min-h-[600px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">

        {/* Content */}
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary sm:mb-5 sm:text-sm sm:tracking-[0.2em]">
            {slide.eyebrow}
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl">
            {slide.title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:mt-7 sm:text-lg sm:leading-8">
            {slide.description}
          </p>

          {/* CTA */}
          <div className="mt-7 sm:mt-9">
            <Link
              href={slide.href}
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary-hover sm:w-auto sm:text-base"
            >
              {slide.button}
            </Link>
          </div>

          {/* Slider controls */}
          <div className="mt-9 flex items-center gap-4 sm:mt-12 sm:gap-5">
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous slide"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border text-base transition-colors hover:bg-surface-hover sm:h-11 sm:w-11 sm:text-lg"
            >
              ←
            </button>

            <div className="flex items-center gap-2">
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 cursor-pointer rounded-full transition-all ${
                    index === activeSlide
                      ? "w-7 bg-primary sm:w-8"
                      : "w-2 bg-muted-dark"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border text-base transition-colors hover:bg-surface-hover sm:h-11 sm:w-11 sm:text-lg"
            >
              →
            </button>
          </div>
        </div>

        {/* Visual area */}
        <div className="relative h-[280px] sm:h-[360px] lg:h-[500px]">

          {/* Image */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl border border-border bg-surface sm:rounded-[2rem]">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={activeSlide === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-all duration-500"
            />

            {/* Image overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Decorative circle */}
            <div className="absolute right-5 top-5 h-20 w-20 rounded-full border border-primary/30 bg-primary/10 sm:right-10 sm:top-10 sm:h-32 sm:w-32" />

            {/* Text */}
            <div className="absolute inset-0 flex items-end p-5 pb-24 sm:p-8 sm:pb-28">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/80 sm:text-sm sm:tracking-[0.18em]">
                  StudioSpace
                </p>

                <p className="mt-2 max-w-xs text-xl font-bold leading-tight text-white sm:text-2xl">
                  Create something worth remembering.
                </p>
              </div>
            </div>
          </div>

          {/* Featured badge */}
          <div className="absolute bottom-0 left-3 z-10 rounded-xl border border-border bg-surface px-4 py-3 shadow-xl sm:left-5 sm:rounded-2xl sm:px-5 sm:py-4">
            <p className="text-[10px] uppercase tracking-widest text-muted sm:text-xs">
              Featured space
            </p>

            <p className="mt-1 text-sm font-semibold sm:text-base">
              Built for creators
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}