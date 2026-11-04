"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Login successful!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
      });
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:py-12 md:py-16">
      <div className="mx-auto w-full max-w-md">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
              S
            </span>

            <span className="text-lg font-bold sm:text-xl">
              StudioSpace
            </span>
          </Link>

          <h1 className="mt-7 text-2xl font-bold sm:mt-8 sm:text-3xl">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Sign in to continue to your account.
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-7 rounded-2xl border border-border bg-surface p-4 shadow-xl sm:mt-8 sm:p-6 md:p-8">
          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="group flex min-h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md active:translate-y-0"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:scale-110"
            >
              <path
                fill="#4285F4"
                d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.23a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.92-4.2 2.92-7.42Z"
              />

              <path
                fill="#34A853"
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.5Z"
              />

              <path
                fill="#FBBC05"
                d="M6.54 13.58A5.86 5.86 0 0 1 6.24 12c0-.55.1-1.08.3-1.58V7.89H3.3A9.73 9.73 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.11l3.24-2.53Z"
              />

              <path
                fill="#EA4335"
                d="M12 6.39c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.5 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.39l3.24 2.53C7.31 8.11 9.46 6.39 12 6.39Z"
              />
            </svg>

            <span className="transition-colors duration-200 group-hover:text-gray-900">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email Login */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
                className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="min-h-11 w-full cursor-pointer rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm leading-6 text-muted">
            Do not have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Back */}
        <div className="mt-5 text-center sm:mt-6">
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}