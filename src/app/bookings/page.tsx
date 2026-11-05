
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";

type Booking = {
  _id: string;
  id?: string;
  studioId?: string;
  studioName?: string;
  studioTitle?: string;
  title?: string;
  date: string;
  startTime: string;
  endTime: string;
  guests?: number;
  guestCount?: number;
  status: string;
  totalPrice?: number;
  totalAmount?: number;
  price?: number;
  deposit?: number;
  depositAmount?: number;
  location?: string;
  createdAt?: string;
};

type FilterType = "all" | "upcoming" | "completed" | "cancelled";

function getBookingId(booking: Booking) {
  return booking._id || booking.id || "";
}

function getBookingName(booking: Booking) {
  return booking.studioName || booking.studioTitle || booking.title || "Studio";
}

function getBookingGuests(booking: Booking) {
  return booking.guests ?? booking.guestCount ?? 1;
}

function getBookingPrice(booking: Booking) {
  return booking.totalPrice ?? booking.totalAmount ?? booking.price ?? 0;
}

function getBookingDeposit(booking: Booking) {
  return booking.deposit ?? booking.depositAmount ?? 0;
}

function getBookingStatus(booking: Booking) {
  return booking.status?.toLowerCase() || "pending";
}

function isUpcoming(booking: Booking) {
  const status = getBookingStatus(booking);
  return status === "pending" || status === "confirmed";
}

function isCompleted(booking: Booking) {
  return getBookingStatus(booking) === "completed";
}

function isCancelled(booking: Booking) {
  const status = getBookingStatus(booking);

  return (
    status === "cancelled" ||
    status === "canceled" ||
    status === "rejected"
  );
}

function formatDate(date: string) {
  if (!date) return "Date unavailable";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatStatus(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "confirmed") return "Confirmed";
  if (normalized === "pending") return "Pending";
  if (normalized === "completed") return "Completed";
  if (normalized === "rejected") return "Rejected";

  if (
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "Cancelled";
  }

  return status;
}

function getStatusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "confirmed") {
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  }

  if (normalized === "completed") {
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  }

  if (normalized === "pending") {
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "rejected"
  ) {
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }

  return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
}

export default function BookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [activeFilter, setActiveFilter] =
    useState<FilterType>("all");

  const [cancellingId, setCancellingId] =
    useState<string | null>(null);

  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchBookings() {
      try {
        const response = await apiFetch(
          "/api/bookings/my-bookings"
        );

        let data: unknown;

        try {
          data = await response.json();
        } catch {
          throw new Error(
            "The server returned an invalid response."
          );
        }

        if (!response.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof data.message === "string"
              ? data.message
              : "Failed to fetch bookings.";

          throw new Error(message);
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid booking data received.");
        }

        if (!cancelled) {
          setBookings(data as Booking[]);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);

        if (!cancelled) {
          setBookings([]);

          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load your bookings."
          );
        }
      }
    }

    void fetchBookings();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const list = bookings ?? [];

    return {
      all: list.length,
      upcoming: list.filter(isUpcoming).length,
      completed: list.filter(isCompleted).length,
      cancelled: list.filter(isCancelled).length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const list = bookings ?? [];

    if (activeFilter === "upcoming") {
      return list.filter(isUpcoming);
    }

    if (activeFilter === "completed") {
      return list.filter(isCompleted);
    }

    if (activeFilter === "cancelled") {
      return list.filter(isCancelled);
    }

    return list;
  }, [bookings, activeFilter]);

  async function handleCancelBooking() {
    if (!cancellingId) return;

    setIsCancelling(true);

    try {
      const response = await apiFetch(
        `/api/bookings/${cancellingId}/cancel`,
        {
          method: "PATCH",
        }
      );

      let data: unknown = null;

      try {
        data = await response.json();
      } catch {
        // Response may not contain JSON.
      }

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof data.message === "string"
            ? data.message
            : "Failed to cancel booking.";

        throw new Error(message);
      }

      setBookings((currentBookings) => {
        if (!currentBookings) return currentBookings;

        return currentBookings.map((booking) => {
          if (getBookingId(booking) !== cancellingId) {
            return booking;
          }

          return {
            ...booking,
            status: "cancelled",
          };
        });
      });

      setCancellingId(null);

      toast.success("Booking cancelled successfully.");
    } catch (error) {
      console.error("Failed to cancel booking:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to cancel booking."
      );
    } finally {
      setIsCancelling(false);
    }
  }

  if (bookings === null) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

            <p className="mt-4 text-sm font-medium text-muted">
              Loading your bookings...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            StudioSpace
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            View and manage all your studio booking requests in one place.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-medium text-muted">
              All Bookings
            </p>
            <p className="mt-2 text-3xl font-black">{stats.all}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-medium text-muted">
              Upcoming
            </p>
            <p className="mt-2 text-3xl font-black">
              {stats.upcoming}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-medium text-muted">
              Completed
            </p>
            <p className="mt-2 text-3xl font-black">
              {stats.completed}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-medium text-muted">
              Cancelled
            </p>
            <p className="mt-2 text-3xl font-black">
              {stats.cancelled}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {(
            [
              ["all", "All", stats.all],
              ["upcoming", "Upcoming", stats.upcoming],
              ["completed", "Completed", stats.completed],
              ["cancelled", "Cancelled", stats.cancelled],
            ] as const
          ).map(([value, label, count]) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveFilter(value)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeFilter === value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-surface text-foreground hover:bg-surface-hover"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
              📅
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              No bookings found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              {activeFilter === "all"
                ? "You haven't made any studio bookings yet."
                : `There are no ${activeFilter} bookings right now.`}
            </p>

            <button
              type="button"
              onClick={() => router.push("/studios")}
              className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
            >
              Explore Studios
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map((booking) => {
              const bookingId = getBookingId(booking);
              const status = getBookingStatus(booking);

              // Only pending bookings can be cancelled.
              const canCancel = status === "pending";

              return (
                <article
                  key={bookingId}
                  className="overflow-hidden rounded-3xl border border-border bg-surface"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-bold">
                            {getBookingName(booking)}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                              status
                            )}`}
                          >
                            {formatStatus(status)}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                              Date
                            </p>
                            <p className="mt-1 font-semibold">
                              {formatDate(booking.date)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                              Time
                            </p>
                            <p className="mt-1 font-semibold">
                              {booking.startTime} - {booking.endTime}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                              Guests
                            </p>
                            <p className="mt-1 font-semibold">
                              {getBookingGuests(booking)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                              Total
                            </p>
                            <p className="mt-1 font-semibold">
                              ৳{getBookingPrice(booking).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {booking.location && (
                          <p className="mt-5 text-sm text-muted">
                            📍 {booking.location}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                        {booking.studioId && (
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/studios/${booking.studioId}`
                              )
                            }
                            className="rounded-full border border-border px-5 py-2.5 text-sm font-bold transition hover:bg-surface-hover"
                          >
                            View Studio
                          </button>
                        )}

                        {canCancel && (
                          <button
                            type="button"
                            onClick={() =>
                              setCancellingId(bookingId)
                            }
                            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-sm text-muted">
                      <span>
                        Total: ৳{getBookingPrice(booking).toLocaleString()}
                      </span>

                      <span>
                        Deposit: ৳{getBookingDeposit(booking).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Cancel Modal */}
      {cancellingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl">
            <h2 className="text-xl font-bold">
              Cancel this booking?
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              Are you sure you want to cancel this booking?
              This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setCancellingId(null)}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-bold transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancelBooking}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
