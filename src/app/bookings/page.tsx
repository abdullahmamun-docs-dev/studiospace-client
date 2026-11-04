
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import AuthGuard from "../components/AuthGuard";
import { apiFetch } from "@/lib/api";

type Booking = {
  _id: string;
  studioName: string;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  totalHours: number;

  // Current backend fields
  price?: number;
  deposit?: number;
  totalAmount?: number;

  // Backward compatibility with older records
  totalPrice?: number;
  securityDeposit?: number;

  status: "pending" | "confirmed" | "completed" | "cancelled" | string;
};

type FilterType = "all" | "upcoming" | "completed" | "cancelled";

function getBookingPrice(booking: Booking) {
  if (booking.totalAmount !== undefined) {
    return Number(booking.totalAmount) || 0;
  }

  if (booking.totalPrice !== undefined) {
    return Number(booking.totalPrice) || 0;
  }

  return (
    (Number(booking.price) || 0) +
    (Number(booking.deposit ?? booking.securityDeposit) || 0)
  );
}

function getBookingDeposit(booking: Booking) {
  return Number(
    booking.deposit ?? booking.securityDeposit ?? 0
  ) || 0;
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-500";
    case "confirmed":
      return "bg-green-500/10 text-green-400";
    case "completed":
      return "bg-blue-500/10 text-blue-400";
    case "cancelled":
      return "bg-red-500/10 text-red-400";
    default:
      return "bg-surface-hover text-muted";
  }
}

function getStatusLabel(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function isUpcoming(status: string) {
  return status === "pending" || status === "confirmed";
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await apiFetch("/api/bookings/my-bookings");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch bookings."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid booking data received.");
        }

        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchBookings();
  }, []);

  async function handleCancelBooking() {
    if (!selectedBooking || selectedBooking.status !== "pending") {
      return;
    }

    const bookingId = selectedBooking._id;
    setCancellingId(bookingId);

    try {
      const response = await apiFetch(
        `/api/bookings/${bookingId}/cancel`,
        { method: "PATCH" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel booking."
        );
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      setSelectedBooking(null);
      setActiveFilter("cancelled");
      toast.success("Booking cancelled successfully.");
    } catch (error) {
      console.error("Failed to cancel booking:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to cancel booking."
      );
    } finally {
      setCancellingId(null);
    }
  }

  const counts = useMemo(() => {
    return {
      all: bookings.length,
      upcoming: bookings.filter((booking) =>
        isUpcoming(booking.status)
      ).length,
      completed: bookings.filter(
        (booking) => booking.status === "completed"
      ).length,
      cancelled: bookings.filter(
        (booking) => booking.status === "cancelled"
      ).length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    switch (activeFilter) {
      case "upcoming":
        return bookings.filter((booking) =>
          isUpcoming(booking.status)
        );
      case "completed":
        return bookings.filter(
          (booking) => booking.status === "completed"
        );
      case "cancelled":
        return bookings.filter(
          (booking) => booking.status === "cancelled"
        );
      default:
        return bookings;
    }
  }, [bookings, activeFilter]);

  if (loading) {
    return (
      <AuthGuard>
        <main className="min-h-screen bg-background text-foreground">
          <div className="mx-auto flex min-h-screen items-center justify-center px-4">
            <p className="text-sm text-muted">
              Loading your bookings...
            </p>
          </div>
        </main>
      </AuthGuard>
    );
  }

  const filterItems: {
    key: FilterType;
    label: string;
    count: number;
  }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "upcoming", label: "Upcoming", count: counts.upcoming },
    { key: "completed", label: "Completed", count: counts.completed },
    { key: "cancelled", label: "Cancelled", count: counts.cancelled },
  ];

  return (
    <AuthGuard>
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="border-b border-border bg-surface-soft">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm sm:tracking-[0.2em]">
              My bookings
            </p>

            <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Your creative space bookings.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
              Manage your studio reservations, check booking
              status, and keep track of your creative projects.
            </p>
          </div>
        </section>

        {/* Main */}
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Filter Tabs */}
            <div className="mb-8 overflow-x-auto">
              <div className="flex min-w-max gap-2 rounded-2xl border border-border bg-surface p-2">
                {filterItems.map((item) => {
                  const active = activeFilter === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveFilter(item.key)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all sm:px-5 ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted hover:bg-surface-hover hover:text-foreground"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                          active ? "bg-white/20" : "bg-surface-hover"
                        }`}
                      >
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Empty State */}
            {filteredBookings.length === 0 ? (
              <div className="rounded-2xl border border-border bg-surface px-5 py-12 text-center sm:px-8 sm:py-16">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-hover text-xl text-primary">
                  {activeFilter === "cancelled"
                    ? "×"
                    : activeFilter === "completed"
                      ? "✓"
                      : "○"}
                </div>

                <h2 className="mt-5 text-xl font-bold sm:text-2xl">
                  {activeFilter === "all"
                    ? "No bookings yet"
                    : activeFilter === "upcoming"
                      ? "No upcoming bookings"
                      : activeFilter === "completed"
                        ? "No completed bookings"
                        : "No cancelled bookings"}
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                  {activeFilter === "cancelled"
                    ? "You don't have any cancelled bookings."
                    : activeFilter === "completed"
                      ? "Your completed studio bookings will appear here."
                      : activeFilter === "upcoming"
                        ? "Your pending and confirmed bookings will appear here."
                        : "Explore available studios and book a space for your next project."}
                </p>

                {(activeFilter === "all" ||
                  activeFilter === "upcoming") && (
                  <Link
                    href="/studios"
                    className="studio-primary-button mt-6 w-full sm:w-auto"
                  >
                    Explore Studios
                  </Link>
                )}
              </div>
            ) : (
              <>
                {/* Section Heading */}
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                      {activeFilter === "all"
                        ? "All reservations"
                        : activeFilter === "upcoming"
                          ? "Upcoming reservations"
                          : activeFilter === "completed"
                            ? "Completed reservations"
                            : "Cancelled reservations"}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                      {filteredBookings.length}{" "}
                      {filteredBookings.length === 1
                        ? "booking"
                        : "bookings"}
                    </h2>
                  </div>
                </div>

                {/* Booking Cards */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
                  {filteredBookings.map((booking) => {
                    const cancelled = booking.status === "cancelled";
                    const bookingPrice = getBookingPrice(booking);
                    const bookingDeposit = getBookingDeposit(booking);

                    return (
                      <article
                        key={booking._id}
                        className={`rounded-2xl border bg-surface p-4 transition-shadow sm:p-6 ${
                          cancelled
                            ? "border-red-500/20 opacity-80"
                            : "border-border hover:shadow-lg"
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-primary sm:text-sm">
                              Studio booking
                            </p>

                            <h3 className="mt-2 break-words text-xl font-bold sm:text-2xl">
                              {booking.studioName}
                            </h3>
                          </div>

                          <span
                            className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                              booking.status
                            )}`}
                          >
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>

                        <div className="my-5 border-t border-border sm:my-6" />

                        {/* Details */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-muted sm:text-xs">
                              Date
                            </p>
                            <p className="mt-1 text-sm font-semibold sm:text-base">
                              {booking.date}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-muted sm:text-xs">
                              Time
                            </p>
                            <p className="mt-1 text-sm font-semibold sm:text-base">
                              {booking.startTime} - {booking.endTime}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-muted sm:text-xs">
                              Duration
                            </p>
                            <p className="mt-1 text-sm font-semibold sm:text-base">
                              {Number(booking.totalHours || 0).toFixed(2)} hours
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-muted sm:text-xs">
                              Guests
                            </p>
                            <p className="mt-1 text-sm font-semibold sm:text-base">
                              {booking.guests}
                            </p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-5 sm:mt-6">
                          <span className="text-sm text-muted">
                            Total price
                          </span>

                          <span className="shrink-0 text-xl font-bold text-primary sm:text-2xl">
                            ৳{bookingPrice.toLocaleString()}
                          </span>
                        </div>

                        {bookingDeposit > 0 && (
                          <div className="mt-3 flex items-center justify-between gap-4">
                            <span className="text-sm text-muted">
                              Security deposit
                            </span>

                            <span className="text-sm font-semibold">
                              ৳{bookingDeposit.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {/* Actions */}
                        {booking.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(booking)}
                            className="mt-5 flex min-h-11 w-full items-center justify-center rounded-full border border-danger/40 px-4 py-2.5 text-sm font-bold text-danger transition-colors hover:bg-danger/10"
                          >
                            Cancel Booking
                          </button>
                        )}

                        {booking.status === "confirmed" && (
                          <div className="mt-5 rounded-xl bg-green-500/5 px-4 py-3 text-sm text-green-400">
                            Your booking is confirmed.
                          </div>
                        )}

                        {booking.status === "completed" && (
                          <div className="mt-5 rounded-xl bg-blue-500/5 px-4 py-3 text-sm text-blue-400">
                            This booking has been completed.
                          </div>
                        )}

                        {booking.status === "cancelled" && (
                          <div className="mt-5 rounded-xl bg-red-500/5 px-4 py-3 text-sm text-red-400">
                            This booking was cancelled.
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Cancel Confirmation Modal */}
        {selectedBooking && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-5 backdrop-blur-sm sm:py-8"
            onClick={() => {
              if (!cancellingId) {
                setSelectedBooking(null);
              }
            }}
          >
            <div
              className="my-auto w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 text-lg font-bold text-danger sm:h-12 sm:w-12 sm:text-xl">
                !
              </div>

              <h2 className="mt-5 text-xl font-bold sm:text-2xl">
                Cancel this booking?
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                Are you sure you want to cancel your booking for{" "}
                <span className="font-semibold text-foreground">
                  {selectedBooking.studioName}
                </span>
                ?
              </p>

              <div className="mt-5 rounded-xl border border-border bg-surface-soft p-4 sm:mt-6">
                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-muted">Date</span>
                  <span className="text-right font-semibold">
                    {selectedBooking.date}
                  </span>
                </div>

                <div className="mt-3 flex items-start justify-between gap-4 text-sm">
                  <span className="text-muted">Time</span>
                  <span className="text-right font-semibold">
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </span>
                </div>

                <div className="mt-3 flex items-start justify-between gap-4 text-sm">
                  <span className="text-muted">Total</span>
                  <span className="text-right font-semibold text-primary">
                    ৳{getBookingPrice(selectedBooking).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  disabled={Boolean(cancellingId)}
                  className="min-h-11 w-full rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Keep Booking
                </button>

                <button
                  type="button"
                  onClick={handleCancelBooking}
                  disabled={Boolean(cancellingId)}
                  className="min-h-11 w-full rounded-full bg-danger px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {cancellingId ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
