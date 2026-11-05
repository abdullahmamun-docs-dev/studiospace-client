
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(
          error.message || "Invalid email or password."
        );
        return;
      }

      toast.success("Login successful!");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login failed:", error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (googleLoading) return;

    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL:
          typeof window !== "undefined"
            ? window.location.origin
            : "https://studiospace-client-lemon.vercel.app",
      });
    } catch (error) {
      console.error("Google login failed:", error);

      toast.error(
        "Google login failed. Please try again."
      );

      setGoogleLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-block text-2xl font-bold text-gray-900 dark:text-white"
            >
              StudioSpace
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Login to continue to StudioSpace
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-white outline-none transition focus:border-black dark:focus:border-white"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-white outline-none transition focus:border-black dark:focus:border-white"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />

            <span className="text-sm text-gray-500">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 font-semibold text-gray-900 dark:text-white transition hover:bg-gray-50 dark:hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              "Connecting..."
            ) : (
              <>
                <span className="text-lg font-bold">
                  G
                </span>

                Continue with Google
              </>
            )}
          </button>

          {/* Signup */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-blue-600 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
