"use client";

import { useEffect, useMemo, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

type Booking = {
  _id: string;
  studioId: string;
  studioName: string;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  totalHours: number;
  totalPrice: number;
  securityDeposit?: number;
  status: BookingStatus;
  userName?: string;
  userEmail?: string;
  customerName?: string;
  customerEmail?: string;
};

type ActionType = "confirm" | "reject" | "complete";

type FilterType =
  | "all"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export default function HostBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("all");

  const [selectedAction, setSelectedAction] =
    useState<{
      bookingId: string;
      action: ActionType;
    } | null>(null);

  useEffect(() => {
    void fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);

      const response = await apiFetch(
        "/api/bookings/host-bookings",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load bookings."
        );
      }

      setBookings(
        Array.isArray(data)
          ? data
          : data.bookings || []
      );
    } catch (error) {
      console.error("Failed to load host bookings:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load bookings."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleBookingAction(
    bookingId: string,
    action: ActionType
  ) {
    try {
      setProcessingId(bookingId);

      const response = await apiFetch(
        `/api/bookings/${bookingId}/${action}`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Booking update failed."
        );
      }

      const status: BookingStatus =
        action === "reject"
          ? "cancelled"
          : action === "confirm"
          ? "confirmed"
          : "completed";

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status }
            : booking
        )
      );

      const messages = {
        confirm: "Booking confirmed successfully.",
        reject: "Booking rejected successfully.",
        complete: "Booking marked as completed.",
      };

      toast.success(messages[action]);
    } catch (error) {
      console.error(
        "Failed to update booking:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setProcessingId(null);
      setSelectedAction(null);
    }
  }

  function formatDate(dateString: string) {
    const [year, month, day] =
      dateString.split("-").map(Number);

    if (!year || !month || !day) {
      return dateString;
    }

    return new Date(
      year,
      month - 1,
      day
    ).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatPrice(amount: number) {
    return `৳${Number(amount || 0).toLocaleString(
      "en-BD"
    )}`;
  }

  function getStatusStyle(status: BookingStatus) {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";

      case "confirmed":
        return "bg-green-500/10 text-green-600 border-green-500/20";

      case "completed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";

      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";

      default:
        return "bg-surface-soft text-muted border-border";
    }
  }

  function getStatusLabel(status: BookingStatus) {
    switch (status) {
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

  function getActionMessage(action: ActionType) {
    switch (action) {
      case "confirm":
        return "Are you sure you want to confirm this booking? The customer will be able to use the studio at the selected time.";

      case "reject":
        return "Are you sure you want to reject this booking? The booking will be marked as cancelled.";

      case "complete":
        return "Mark this booking as completed? This action indicates that the studio session has finished.";
    }
  }

  const counts = useMemo(() => {
    return {
      all: bookings.length,

      pending: bookings.filter(
        (booking) => booking.status === "pending"
      ).length,

      confirmed: bookings.filter(
        (booking) => booking.status === "confirmed"
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
    if (activeFilter === "all") {
      return bookings;
    }

    return bookings.filter(
      (booking) => booking.status === activeFilter
    );
  }, [bookings, activeFilter]);

  const filterItems: {
    key: FilterType;
    label: string;
    count: number;
  }[] = [
    {
      key: "all",
      label: "All",
      count: counts.all,
    },
    {
      key: "pending",
      label: "Pending",
      count: counts.pending,
    },
    {
      key: "confirmed",
      label: "Confirmed",
      count: counts.confirmed,
    },
    {
      key: "completed",
      label: "Completed",
      count: counts.completed,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: counts.cancelled,
    },
  ];

  return (
    <AuthGuard>
      <main className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <section className="border-b border-border bg-surface-soft">
          <div className="container-studio py-10 sm:py-14 lg:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
              Host dashboard
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Manage your bookings.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Review customer requests, confirm reservations,
              and manage completed studio sessions.
            </p>
          </div>
        </section>

        <section className="section-space">
          <div className="container-studio">
            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-border bg-surface p-5">
                <p className="text-sm text-muted">
                  Total Bookings
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {counts.all}
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                <p className="text-sm text-muted">
                  Pending Requests
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {counts.pending}
                </p>
              </div>

              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
                <p className="text-sm text-muted">
                  Confirmed
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {counts.confirmed}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <p className="text-sm text-muted">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {counts.completed}
                </p>
              </div>
            </div>

            {/* Filter + Refresh */}
            <div className="mt-8">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    Booking management
                  </p>

                  <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                    Your reservations
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => void fetchBookings()}
                  disabled={loading}
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {loading
                    ? "Refreshing..."
                    : "Refresh bookings"}
                </button>
              </div>

              {/* Tabs */}
              <div className="overflow-x-auto">
                <div className="flex min-w-max gap-2 rounded-2xl border border-border bg-surface p-2">
                  {filterItems.map((item) => {
                    const active =
                      activeFilter === item.key;

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          setActiveFilter(item.key)
                        }
                        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted hover:bg-surface-hover hover:text-foreground"
                        }`}
                      >
                        <span>{item.label}</span>

                        <span
                          className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                            active
                              ? "bg-white/20"
                              : "bg-surface-hover"
                          }`}
                        >
                          {item.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mt-6">
              {loading ? (
                <div className="rounded-2xl border border-border bg-surface p-10 text-center">
                  <p className="text-sm text-muted">
                    Loading bookings...
                  </p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="rounded-2xl border border-border bg-surface px-5 py-12 text-center sm:px-8 sm:py-16">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-hover text-xl text-primary">
                    {activeFilter === "cancelled"
                      ? "×"
                      : activeFilter === "completed"
                      ? "✓"
                      : activeFilter === "pending"
                      ? "○"
                      : "—"}
                  </div>

                  <h3 className="mt-5 text-xl font-bold sm:text-2xl">
                    {activeFilter === "all"
                      ? "No bookings yet"
                      : activeFilter === "pending"
                      ? "No pending requests"
                      : activeFilter === "confirmed"
                      ? "No confirmed bookings"
                      : activeFilter === "completed"
                      ? "No completed bookings"
                      : "No cancelled bookings"}
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                    {activeFilter === "pending"
                      ? "New customer booking requests will appear here."
                      : activeFilter === "confirmed"
                      ? "Confirmed reservations will appear here."
                      : activeFilter === "completed"
                      ? "Completed studio sessions will appear here."
                      : activeFilter === "cancelled"
                      ? "Rejected or cancelled bookings will appear here."
                      : "When customers book one of your studios, their reservations will appear here."}
                  </p>
                </div>
              ) : (
                <>
                  {/* Section heading */}
                  <div className="mb-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                        {activeFilter === "all"
                          ? "All reservations"
                          : `${getStatusLabel(
                              activeFilter as BookingStatus
                            )} reservations`}
                      </p>

                      <h3 className="mt-1 text-xl font-bold sm:text-2xl">
                        {filteredBookings.length}{" "}
                        {filteredBookings.length === 1
                          ? "booking"
                          : "bookings"}
                      </h3>
                    </div>
                  </div>

                  {/* Booking Cards */}
                  <div className="grid gap-5">
                    {filteredBookings.map((booking) => {
                      const customerName =
                        booking.customerName ||
                        booking.userName ||
                        "Customer";

                      const customerEmail =
                        booking.customerEmail ||
                        booking.userEmail ||
                        "Email not available";

                      const isCancelled =
                        booking.status === "cancelled";

                      return (
                        <article
                          key={booking._id}
                          className={`rounded-2xl border bg-surface p-5 transition-shadow sm:p-6 ${
                            isCancelled
                              ? "border-red-500/20 opacity-80"
                              : "border-border hover:shadow-lg"
                          }`}
                        >
                          {/* Card top */}
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                                Studio reservation
                              </p>

                              <h3 className="mt-2 break-words text-xl font-bold sm:text-2xl">
                                {booking.studioName ||
                                  "Studio"}
                              </h3>

                              <p className="mt-1 break-all text-xs text-muted">
                                Booking ID: {booking._id}
                              </p>
                            </div>

                            <span
                              className={`w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                                booking.status
                              )}`}
                            >
                              {getStatusLabel(
                                booking.status
                              )}
                            </span>
                          </div>

                          <div className="my-5 border-t border-border" />

                          {/* Information */}
                          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Customer */}
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                                Customer
                              </p>

                              <p className="mt-2 break-words font-semibold">
                                {customerName}
                              </p>

                              <p className="mt-1 break-all text-sm text-muted">
                                {customerEmail}
                              </p>
                            </div>

                            {/* Date */}
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                                Date
                              </p>

                              <p className="mt-2 font-semibold">
                                {formatDate(
                                  booking.date
                                )}
                              </p>

                              <p className="mt-1 text-sm text-muted">
                                {booking.startTime} –{" "}
                                {booking.endTime}
                              </p>
                            </div>

                            {/* Guests */}
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                                Guests
                              </p>

                              <p className="mt-2 font-semibold">
                                {booking.guests} Guests
                              </p>

                              <p className="mt-1 text-sm text-muted">
                                {Number(
                                  booking.totalHours || 0
                                ).toFixed(2)}{" "}
                                Hours
                              </p>
                            </div>

                            {/* Payment */}
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                                Booking total
                              </p>

                              <p className="mt-2 text-xl font-bold text-primary">
                                {formatPrice(
                                  booking.totalPrice
                                )}
                              </p>

                              {booking.securityDeposit !==
                                undefined && (
                                <p className="mt-1 text-xs text-muted">
                                  Deposit:{" "}
                                  {formatPrice(
                                    booking.securityDeposit
                                  )}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              {booking.status ===
                                "pending" && (
                                <p className="text-sm text-yellow-600">
                                  This booking is waiting
                                  for your approval.
                                </p>
                              )}

                              {booking.status ===
                                "confirmed" && (
                                <p className="text-sm text-green-600">
                                  This reservation is
                                  confirmed.
                                </p>
                              )}

                              {booking.status ===
                                "completed" && (
                                <p className="text-sm text-blue-600">
                                  This studio session has
                                  been completed.
                                </p>
                              )}

                              {booking.status ===
                                "cancelled" && (
                                <p className="text-sm text-red-600">
                                  This booking was
                                  cancelled or rejected.
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {booking.status ===
                                "pending" && (
                                <>
                                  <button
                                    type="button"
                                    disabled={
                                      processingId ===
                                      booking._id
                                    }
                                    onClick={() =>
                                      setSelectedAction({
                                        bookingId:
                                          booking._id,
                                        action:
                                          "confirm",
                                      })
                                    }
                                    className="min-h-11 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    Confirm
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      processingId ===
                                      booking._id
                                    }
                                    onClick={() =>
                                      setSelectedAction({
                                        bookingId:
                                          booking._id,
                                        action:
                                          "reject",
                                      })
                                    }
                                    className="min-h-11 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {booking.status ===
                                "confirmed" && (
                                <button
                                  type="button"
                                  disabled={
                                    processingId ===
                                    booking._id
                                  }
                                  onClick={() =>
                                    setSelectedAction({
                                      bookingId:
                                        booking._id,
                                      action:
                                        "complete",
                                    })
                                  }
                                  className="min-h-11 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Complete Booking
                                </button>
                              )}

                              {(booking.status ===
                                "completed" ||
                                booking.status ===
                                  "cancelled") && (
                                <span className="self-center text-sm text-muted">
                                  No actions available
                                </span>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Confirmation Modal */}
        {selectedAction && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
            onClick={() => {
              if (!processingId) {
                setSelectedAction(null);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-confirmation-title"
              className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:p-6"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                !
              </div>

              <h2
                id="booking-confirmation-title"
                className="mt-5 text-xl font-bold sm:text-2xl"
              >
                Confirm action
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                {getActionMessage(
                  selectedAction.action
                )}
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={
                    processingId !== null
                  }
                  onClick={() =>
                    setSelectedAction(null)
                  }
                  className="min-h-11 w-full rounded-xl border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Go Back
                </button>

                <button
                  type="button"
                  disabled={
                    processingId !== null
                  }
                  onClick={() =>
                    handleBookingAction(
                      selectedAction.bookingId,
                      selectedAction.action
                    )
                  }
                  className="min-h-11 w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {processingId
                    ? "Processing..."
                    : selectedAction.action ===
                      "confirm"
                    ? "Confirm Booking"
                    : selectedAction.action ===
                      "reject"
                    ? "Reject Booking"
                    : "Complete Booking"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}