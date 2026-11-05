"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const user = session?.user ?? null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("studiospace-theme");
    const light = savedTheme === "light";

    setIsLightTheme(light);

    if (light) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close profile dropdown with Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function toggleTheme() {
    const html = document.documentElement;

    if (html.classList.contains("light")) {
      html.classList.remove("light");
      localStorage.setItem("studiospace-theme", "dark");
      setIsLightTheme(false);
    } else {
      html.classList.add("light");
      localStorage.setItem("studiospace-theme", "light");
      setIsLightTheme(true);
    }
  }

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await authClient.signOut();
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  function isActive(path: string) {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  }

  function navLinkClass(path: string) {
    return `whitespace-nowrap text-sm font-medium transition-colors ${
      isActive(path)
        ? "font-bold text-primary"
        : "text-muted hover:text-foreground"
    }`;
  }

  function mobileLinkClass(path: string) {
    return `shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
      isActive(path)
        ? "bg-primary text-primary-foreground"
        : "text-muted hover:bg-surface-hover"
    }`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-3 sm:min-h-20 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="StudioSpace Home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground shadow-lg shadow-primary/10 transition-transform duration-200 hover:scale-105 sm:h-10 sm:w-10">
            S
          </span>

          <span className="text-lg font-bold tracking-tight sm:text-xl">
            StudioSpace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          <Link href="/" className={navLinkClass("/")}>
            Home
          </Link>

          <Link href="/studios" className={navLinkClass("/studios")}>
            Explore Studios
          </Link>

          <Link href="/about" className={navLinkClass("/about")}>
            How It Works
          </Link>

          <Link href="/about#about-us" className={navLinkClass("/about")}>
            About Us
          </Link>
        </div>

        {/* Right Side */}
        <div className="relative flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isLightTheme
                ? "Switch to dark theme"
                : "Switch to light theme"
            }
            title={
              isLightTheme
                ? "Switch to dark theme"
                : "Switch to light theme"
            }
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-base transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-surface-hover sm:h-10 sm:w-10"
          >
            {isLightTheme ? "🌙" : "☀️"}
          </button>

          {user ? (
            <>
              {/* Profile */}
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  aria-label="Open profile menu"
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-2 py-1.5 transition-all duration-200 hover:border-primary hover:bg-surface-hover sm:px-3"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User profile"}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                      aria-hidden="true"
                    >
                      {(user.name || user.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}

                  <span className="hidden max-w-28 truncate text-sm font-semibold md:block">
                    {user.name || user.email}
                  </span>

                  <span
                    className="text-xs text-muted"
                    aria-hidden="true"
                  >
                    {menuOpen ? "▲" : "▼"}
                  </span>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div
                    className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-border bg-surface p-2 shadow-2xl"
                    role="menu"
                    aria-label="Profile menu"
                  >
                    {/* User Info */}
                    <div className="border-b border-border px-3 py-3">
                      <p className="truncate text-sm font-bold">
                        {user.name || "User"}
                      </p>

                      <p className="truncate text-xs text-muted">
                        {user.email}
                      </p>
                    </div>

                    {/* Dashboard */}
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="mt-2 block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
                      role="menuitem"
                    >
                      Dashboard
                    </Link>

                    {/* Add Studio */}
                    <Link
                      href="/host"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
                      role="menuitem"
                    >
                      Add New Studio
                    </Link>

                    {/* My Listings */}
                    <Link
                      href="/my-studios"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
                      role="menuitem"
                    >
                      My Studio Listings
                    </Link>

                    {/* My Bookings */}
                    <Link
                      href="/bookings"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
                      role="menuitem"
                    >
                      My Bookings
                    </Link>

                    {/* Host Bookings */}
                    <Link
                      href="/host-bookings"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
                      role="menuitem"
                    >
                      Host Bookings
                    </Link>

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="mt-1 w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
                      role="menuitem"
                    >
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/auth/login"
                className="rounded-full px-3 py-2 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-hover sm:px-4 sm:text-sm"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                href="/auth/signup"
                className="rounded-full bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md sm:px-4 sm:text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="border-t border-border lg:hidden">
        <div className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-3 py-2.5 sm:px-6">
          <Link href="/" className={mobileLinkClass("/")}>
            Home
          </Link>

          <Link href="/studios" className={mobileLinkClass("/studios")}>
            Explore
          </Link>

          <Link href="/about" className={mobileLinkClass("/about")}>
            How It Works
          </Link>

          <Link
            href="/about#about-us"
            className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-surface-hover"
          >
            About Us
          </Link>
        </div>
      </div>
    </header>
  );
}