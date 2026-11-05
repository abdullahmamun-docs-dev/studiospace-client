
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

  // Theme state
  // FIX: effect-এর ভিতরে setState করা হয়নি
  const [isLightTheme, setIsLightTheme] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem("studiospace-theme") === "light";
  });

  const menuRef = useRef<HTMLDivElement>(null);

  // Apply theme
  useEffect(() => {
    if (isLightTheme) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [isLightTheme]);

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
    const nextTheme = !isLightTheme;

    setIsLightTheme(nextTheme);

    localStorage.setItem(
      "studiospace-theme",
      nextTheme ? "light" : "dark"
    );
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-xl font-black tracking-tight"
        >
          Studio<span className="text-primary">Space</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className={navLinkClass("/")}
          >
            Home
          </Link>

          <Link
            href="/studios"
            className={navLinkClass("/studios")}
          >
            Studios
          </Link>

          <Link
            href="/bookings"
            className={navLinkClass("/bookings")}
          >
            My Bookings
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">

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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm transition hover:bg-surface-hover"
          >
            {isLightTheme ? "🌙" : "☀️"}
          </button>

          {user ? (
            <div
              ref={menuRef}
              className="relative"
            >
              {/* Profile Button */}
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 transition hover:bg-surface-hover"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
                  {user.name || "User"}
                </span>

                <span className="text-xs">
                  {menuOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Profile Dropdown */}
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-border bg-background p-2 shadow-xl"
                >
                  <div className="border-b border-border px-3 py-3">
                    <p className="truncate text-sm font-bold">
                      {user.name || "User"}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="mt-2 block rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-surface-hover"
                    role="menuitem"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/bookings"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-surface-hover"
                    role="menuitem"
                  >
                    My Bookings
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    role="menuitem"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/auth/login"
                className="rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-surface-hover"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="border-t border-border md:hidden">
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6">
          <Link
            href="/"
            className={mobileLinkClass("/")}
          >
            Home
          </Link>

          <Link
            href="/studios"
            className={mobileLinkClass("/studios")}
          >
            Studios
          </Link>

          <Link
            href="/bookings"
            className={mobileLinkClass("/bookings")}
          >
            Bookings
          </Link>

          {!user && (
            <>
              <Link
                href="/auth/login"
                className={mobileLinkClass("/auth/login")}
              >
                Login
              </Link>

              <Link
                href="/register"
                className={mobileLinkClass("/register")}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
