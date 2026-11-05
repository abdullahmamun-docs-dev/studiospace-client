"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    toast.success("Thanks for subscribing to StudioSpace!");
    setEmail("");
  }

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-studio section-space pb-8">

        {/* Main Footer */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
                S
              </span>

              <span className="text-xl font-bold tracking-tight">
                StudioSpace
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
              Find inspiring creative spaces, connect with trusted hosts,
              and bring your next project to life.
            </p>

            <p className="mt-5 text-xs leading-5 text-muted-dark">
              © {new Date().getFullYear()} StudioSpace. All rights reserved.
              <br />
              Terms & Conditions apply.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Quick Navigation
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <Link
                href="/"
                className="transition-colors hover:text-primary"
              >
                Home
              </Link>

              <Link
                href="/studios"
                className="transition-colors hover:text-primary"
              >
                Explore Studios
              </Link>

              <Link
                href="/about#how-it-works"
                className="transition-colors hover:text-primary"
              >
                How It Works
              </Link>

              <Link
                href="/about#about-us"
                className="transition-colors hover:text-primary"
              >
                About Us
              </Link>

              <Link
                href="/bookings"
                className="transition-colors hover:text-primary"
              >
                My Bookings
              </Link>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Popular Categories
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <Link
                href="/studios?category=Photo%20Studios"
                className="transition-colors hover:text-primary"
              >
                Photo Studios
              </Link>

              <Link
                href="/studios?category=Sound%20Stages"
                className="transition-colors hover:text-primary"
              >
                Sound Stages
              </Link>

              <Link
                href="/studios?category=Podcast%20Rooms"
                className="transition-colors hover:text-primary"
              >
                Podcast Rooms
              </Link>

              <Link
                href="/studios?category=Music%20Suites"
                className="transition-colors hover:text-primary"
              >
                Music Suites
              </Link>

              <Link
                href="/studios?category=Art%20Workshops"
                className="transition-colors hover:text-primary"
              >
                Art Workshops
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Stay Updated
            </h3>

            <p className="mt-4 text-sm leading-6 text-muted">
              Get new studio listings, creative tips, and StudioSpace
              updates in your inbox.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="mt-4 flex flex-col gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-dark focus:border-primary"
              />

              <button
                type="submit"
                className="studio-primary-button w-full cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-muted">
            Built for creators, photographers, musicians, podcasters & artists.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">

            {/* Facebook */}
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm font-bold transition-all hover:border-primary hover:bg-surface-hover hover:text-primary"
            >
              f
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm font-bold transition-all hover:border-primary hover:bg-surface-hover hover:text-primary"
            >
              ◎
            </a>

            {/* X */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm font-bold transition-all hover:border-primary hover:bg-surface-hover hover:text-primary"
            >
              𝕏
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm font-bold transition-all hover:border-primary hover:bg-surface-hover hover:text-primary"
            >
              in
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}