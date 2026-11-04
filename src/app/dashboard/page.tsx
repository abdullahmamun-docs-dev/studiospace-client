"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

type Booking = {
  _id: string;
  studioName: string;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  totalHours: number;
  totalPrice: number;
  securityDeposit?: number;
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | string;
};

type Studio = {
  _id: string;
  name: string;
};

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) {
    return dateString;
  }

  return new Date(
    year,
    month - 1,
    day
  ).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(amount: number) {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-600";

    case "confirmed":
      return "border-green-500/20 bg-green-500/10 text-green-600";

    case "completed":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600";

    case "cancelled":
      return "border-red-500/20 bg-red-500/10 text-red-600";

    default:
      return "border-border bg-surface-hover text-muted";
  }
}

function getStatusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function DashboardPage() {
  const { data: session } = authClient.useSession();

  const user = session?.user;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoadingStats(true);

        const [bookingResponse, studioResponse] =
          await Promise.all([
            apiFetch("/api/bookings/my-bookings", {
              cache: "no-store",
            }),

            apiFetch("/api/studios/my-studios", {
              cache: "no-store",
            }),
          ]);

        const bookingData = await bookingResponse.json();
        const studioData = await studioResponse.json();

        if (!bookingResponse.ok) {
          throw new Error(
            bookingData.message ||
              "Failed to load booking statistics."
          );
        }

        if (!studioResponse.ok) {
          throw new Error(
            studioData.message ||
              "Failed to load studio statistics."
          );
        }

        setBookings(
          Array.isArray(bookingData)
            ? bookingData
            : bookingData.bookings || []
        );

        setStudios(
          Array.isArray(studioData)
            ? studioData
            : studioData.studios || []
        );
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data."
        );
      } finally {
        setLoadingStats(false);
      }
    }

    if (session?.user) {
      void loadDashboardData();
    }
  }, [session?.user]);

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  const recentBookings = [...bookings]
    .sort((a, b) => {
      const first = `${a.date} ${a.startTime}`;
      const second = `${b.date} ${b.startTime}`;

      return second.localeCompare(first);
    })
    .slice(0, 4);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <section className="border-b border-border bg-surface-soft">
          <div className="container-studio py-10 sm:py-14 lg:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
              Dashboard
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Welcome back
              {user?.name ? `, ${user.name}` : ""}.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Manage your bookings, studio listings, and
              creative spaces from one place.
            </p>
          </div>
        </section>

        <section className="section-space">
          <div className="container-studio">
            {/* User information */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User profile"}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {(user?.name ||
                      user?.email ||
                      "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold">
                    {user?.name || "User"}
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <div className="rounded-2xl border border-border bg-surface p-5">
                <p className="text-sm text-muted">
                  Total bookings
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {loadingStats ? "—" : totalBookings}
                </p>

                <p className="mt-1 text-xs text-muted">
                  All reservations
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                <p className="text-sm text-muted">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {loadingStats ? "—" : pendingBookings}
                </p>

                <p className="mt-1 text-xs text-muted">
                  Waiting for host
                </p>
              </div>

              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
                <p className="text-sm text-muted">
                  Confirmed
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {loadingStats ? "—" : confirmedBookings}
                </p>

                <p className="mt-1 text-xs text-muted">
                  Upcoming bookings
                </p>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <p className="text-sm text-muted">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {loadingStats ? "—" : completedBookings}
                </p>

                <p className="mt-1 text-xs text-muted">
                  Finished bookings
                </p>
              </div>

              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                <p className="text-sm text-muted">
                  Cancelled
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {loadingStats ? "—" : cancelledBookings}
                </p>

                <p className="mt-1 text-xs text-muted">
                  Cancelled reservations
                </p>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-sm text-muted">
                  My studios
                </p>

                <p className="mt-2 text-3xl font-bold text-primary">
                  {loadingStats ? "—" : studios.length}
                </p>

                <p className="mt-1 text-xs text-muted">
                  Listed creative spaces
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-8">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Quick Actions
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  What would you like to do?
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <Link
                  href="/bookings"
                  className="studio-card p-6"
                >
                  <p className="text-sm font-bold text-primary">
                    My Bookings
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Manage your bookings
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    View reservations, booking status, and
                    cancellation options.
                  </p>

                  <span className="mt-5 inline-block text-sm font-semibold">
                    View bookings →
                  </span>
                </Link>

                <Link
                  href="/host-bookings"
                  className="studio-card p-6"
                >
                  <p className="text-sm font-bold text-primary">
                    Host Bookings
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Manage incoming bookings
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    Review requests, confirm or reject
                    reservations, and complete bookings.
                  </p>

                  <span className="mt-5 inline-block text-sm font-semibold">
                    Manage bookings →
                  </span>
                </Link>

                <Link
                  href="/my-studios"
                  className="studio-card p-6"
                >
                  <p className="text-sm font-bold text-primary">
                    My Studio Listings
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Manage your studios
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    View, edit, and manage your listed
                    creative spaces.
                  </p>

                  <span className="mt-5 inline-block text-sm font-semibold">
                    View listings →
                  </span>
                </Link>

                <Link
                  href="/host"
                  className="studio-card p-6"
                >
                  <p className="text-sm font-bold text-primary">
                    Add New Studio
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    List a creative space
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    Share your studio with creators and start
                    receiving bookings.
                  </p>

                  <span className="mt-5 inline-block text-sm font-semibold">
                    Add studio →
                  </span>
                </Link>
              </div>
            </div>

            {/* Recent bookings */}
            <div className="mt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    Recent Activity
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Recent bookings
                  </h2>
                </div>

                {bookings.length > 0 && (
                  <Link
                    href="/bookings"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View all →
                  </Link>
                )}
              </div>

              {loadingStats ? (
                <div className="mt-5 grid gap-4">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-28 animate-pulse rounded-2xl bg-surface-hover"
                    />
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-border bg-surface-soft p-8 text-center">
                  <h3 className="text-lg font-bold">
                    No bookings yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                    You have not made any studio bookings yet.
                    Explore available studios and find the
                    perfect space for your next project.
                  </p>

                  <Link
                    href="/studios"
                    className="studio-primary-button mt-5"
                  >
                    Explore Studios
                  </Link>
                </div>
              ) : (
                <div className="mt-5 grid gap-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold">
                              {booking.studioName}
                            </h3>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                                booking.status
                              )}`}
                            >
                              {getStatusLabel(
                                booking.status
                              )}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                            <span>
                              {formatDate(booking.date)}
                            </span>

                            <span>
                              {booking.startTime} –{" "}
                              {booking.endTime}
                            </span>

                            <span>
                              {booking.guests} guest
                              {booking.guests !== 1
                                ? "s"
                                : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
                          <p className="font-bold text-primary">
                            {formatPrice(
                              booking.totalPrice
                            )}
                          </p>

                          <Link
                            href="/bookings"
                            className="text-sm font-semibold hover:text-primary"
                          >
                            Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Explore */}
            <div className="mt-10 rounded-2xl border border-border bg-surface-soft p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wider text-primary">
                Keep creating
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Need a new space for your next project?
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                Explore photography studios, sound stages,
                podcast rooms, music suites, and art
                workshops.
              </p>

              <Link
                href="/studios"
                className="studio-primary-button mt-6"
              >
                Explore Studios
              </Link>
            </div>
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}