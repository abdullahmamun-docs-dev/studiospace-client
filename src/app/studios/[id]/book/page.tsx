"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const DEFAULT_MAX_CAPACITY = 10;

type Studio = {
  _id: string;
  name: string;
  category: string;
  location: string;
  pricePerHour?: number;
  price?: number;
  securityDeposit?: number;
  maxCapacity?: number;
  image?: string;
  description?: string;
  hostName?: string;
  hostEmail?: string;
};

type BookingResponse = {
  message?: string;
  booking?: {
    _id: string;
    studioName: string;
    date: string;
    startTime: string;
    endTime: string;
    guests: number;
    totalHours: number;
    price: number;
    deposit: number;
    status: string;
  };
};

function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentTimeInMinutes() {
  const now = new Date();

  return now.getHours() * 60 + now.getMinutes();
}

function timeToMinutes(time: string) {
  if (!time) {
    return 0;
  }

  const [hours, minutes] = time.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
}

export default function BookStudioPage() {
  const params = useParams();
  const router = useRouter();

  const studioId = String(params.id);

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guests, setGuests] = useState("1");

  /*
  |--------------------------------------------------------------------------
  | Load studio
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadStudio() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await apiFetch(`/api/studios/${studioId}`, {
          cache: "no-store",
        });

        let data: Studio | { message?: string } | null = null;

        try {
          data = await response.json();
        } catch {
          throw new Error("The server returned an invalid response.");
        }

        if (!response.ok) {
          throw new Error(
            (data && "message" in data && data.message) ||
              "Failed to load studio."
          );
        }

        setStudio(data as Studio);
      } catch (error) {
        console.error("Failed to load studio:", error);

        const message =
          error instanceof TypeError
            ? "Cannot connect to the server. Please make sure the backend is running."
            : error instanceof Error
              ? error.message
              : "Failed to load studio.";

        setLoadError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    if (studioId) {
      void loadStudio();
    }
  }, [studioId]);

  /*
  |--------------------------------------------------------------------------
  | Capacity
  |--------------------------------------------------------------------------
  */

  const storedCapacity = Number(studio?.maxCapacity);

  const maxCapacity =
    Number.isInteger(storedCapacity) && storedCapacity > 0
      ? storedCapacity
      : DEFAULT_MAX_CAPACITY;

  const guestCount = Number(guests);

  const validGuestCount =
    Number.isInteger(guestCount) &&
    guestCount >= 1 &&
    guestCount <= maxCapacity;

  /*
  |--------------------------------------------------------------------------
  | Booking duration
  |--------------------------------------------------------------------------
  */

  const duration = useMemo(() => {
    if (!startTime || !endTime) {
      return 0;
    }

    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    if (end <= start) {
      return 0;
    }

    return (end - start) / 60;
  }, [startTime, endTime]);

  /*
  |--------------------------------------------------------------------------
  | Time validation
  |--------------------------------------------------------------------------
  */

  const isToday = date === getToday();

  const startTimeIsValidForToday =
    !isToday ||
    !startTime ||
    timeToMinutes(startTime) > getCurrentTimeInMinutes();

  const bookingTimeIsValid =
    Boolean(startTime) &&
    Boolean(endTime) &&
    duration > 0 &&
    startTimeIsValidForToday;

  /*
  |--------------------------------------------------------------------------
  | Price calculation
  |--------------------------------------------------------------------------
  */

  const hourlyRate = Number(
    studio?.pricePerHour ?? studio?.price ?? 0
  );

  const estimatedPrice =
    duration > 0 ? duration * hourlyRate : 0;

  const securityDeposit =
    studio && Number.isFinite(Number(studio.securityDeposit))
      ? Math.max(0, Number(studio.securityDeposit))
      : 0;

  const totalAmount = estimatedPrice + securityDeposit;

  /*
  |--------------------------------------------------------------------------
  | Form validation
  |--------------------------------------------------------------------------
  */

  const dateIsValid =
    Boolean(date) && date >= getToday();

  const formIsValid =
    Boolean(studio) &&
    dateIsValid &&
    bookingTimeIsValid &&
    validGuestCount &&
    hourlyRate > 0;

  /*
  |--------------------------------------------------------------------------
  | Submit booking
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (bookingLoading) {
      return;
    }

    if (!studio) {
      toast.error("Studio information is not available.");
      return;
    }

    if (!date) {
      toast.error("Please select a booking date.");
      return;
    }

    if (date < getToday()) {
      toast.error("You cannot select a past date.");
      return;
    }

    if (!startTime || !endTime) {
      toast.error("Please select both start and end time.");
      return;
    }

    if (duration <= 0) {
      toast.error("End time must be later than start time.");
      return;
    }

    if (
      isToday &&
      timeToMinutes(startTime) <= getCurrentTimeInMinutes()
    ) {
      toast.error(
        "For today's booking, the start time must be in the future."
      );
      return;
    }

    if (!validGuestCount) {
      toast.error(
        `Guest count must be between 1 and ${maxCapacity}.`
      );
      return;
    }

    if (hourlyRate <= 0) {
      toast.error(
        "This studio does not have a valid hourly price."
      );
      return;
    }

    setBookingLoading(true);

    try {
      const response = await apiFetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studioId,
          studioName: studio.name,
          date,
          startTime,
          endTime,
          guests: guestCount,
          totalHours: duration,
          price: estimatedPrice,
          deposit: securityDeposit,
          totalAmount,
        }),
      });

      let data: BookingResponse = {};

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      console.log("Booking response:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create booking."
        );
      }

      toast.success(
        data.message || "Booking created successfully!"
      );

      router.push("/bookings");
    } catch (error) {
      console.error("Create booking error:", error);

      if (error instanceof TypeError) {
        toast.error(
          "Cannot connect to the server. Please make sure the backend is running."
        );
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create booking."
        );
      }
    } finally {
      setBookingLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading state
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 sm:py-14">
        <div className="container-studio">
          <div className="animate-pulse">
            <div className="mb-6 h-5 w-32 rounded bg-surface-hover" />

            <div className="h-9 w-72 rounded bg-surface-hover" />

            <div className="mt-3 h-5 w-40 rounded bg-surface-hover" />

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
              <div className="h-[520px] rounded-2xl bg-surface-hover" />

              <div className="h-[520px] rounded-2xl bg-surface-hover" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Studio loading error
  |--------------------------------------------------------------------------
  */

  if (loadError && !studio) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6">
        <div className="container-studio">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-xl font-bold text-red-500">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Unable to load studio
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted">
              {loadError}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="studio-primary-button"
              >
                Try Again
              </button>

              <Link
                href="/studios"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-bold transition hover:bg-surface-hover"
              >
                Back to Studios
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Studio not found
  |--------------------------------------------------------------------------
  */

  if (!studio) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6">
        <div className="container-studio">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center">
            <h1 className="text-2xl font-bold">
              Studio not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted">
              We could not find the studio you are trying to book.
            </p>

            <Link
              href="/studios"
              className="studio-primary-button mt-6"
            >
              Back to Studios
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isLegacyCapacity =
    !Number.isInteger(storedCapacity) ||
    storedCapacity <= 0;

  return (
    <main className="min-h-screen bg-background py-8 text-foreground sm:py-12 lg:py-16">
      <div className="container-studio">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/studios/${studio._id}`}
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            ← Back to studio
          </Link>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Studio Booking
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Book {studio.name}
          </h1>

          <p className="mt-2 text-sm text-muted sm:text-base">
            {studio.location}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:gap-8">
          {/* Studio information */}
          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="relative h-64 w-full sm:h-80">
              {studio.image ? (
                <Image
                  src={studio.image}
                  alt={studio.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-surface-hover text-sm text-muted">
                  No image available
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">
                    {studio.name}
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    {studio.category}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    ৳{hourlyRate.toLocaleString("en-BD")}
                  </p>

                  <p className="text-xs text-muted">
                    per hour
                  </p>
                </div>
              </div>

              {/* Studio specs */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface-hover p-4">
                  <p className="text-xs text-muted">
                    Maximum guests
                  </p>

                  <p className="mt-1 font-bold">
                    {maxCapacity} guests
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-surface-hover p-4">
                  <p className="text-xs text-muted">
                    Security deposit
                  </p>

                  <p className="mt-1 font-bold">
                    ৳{securityDeposit.toLocaleString("en-BD")}
                  </p>
                </div>
              </div>

              {/* Legacy studio notice */}
              {isLegacyCapacity ? (
                <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm leading-6 text-muted">
                    This studio uses the default capacity of{" "}
                    <span className="font-semibold text-foreground">
                      {DEFAULT_MAX_CAPACITY} guests
                    </span>
                    .
                  </p>
                </div>
              ) : null}

              {studio.description && (
                <div className="mt-6">
                  <h3 className="font-bold">
                    About this studio
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {studio.description}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Booking form */}
          <section className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Reserve your time
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Booking Details
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                Choose your date, time and number of guests.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              {/* Date */}
              <div>
                <label
                  htmlFor="booking-date"
                  className="mb-2 block text-sm font-semibold"
                >
                  Date
                </label>

                <input
                  id="booking-date"
                  type="date"
                  min={getToday()}
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  disabled={bookingLoading}
                  aria-invalid={date.length > 0 && !dateIsValid}
                  className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  required
                />

                {date && !dateIsValid ? (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    Please choose today or a future date.
                  </p>
                ) : null}
              </div>

              {/* Time */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="start-time"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Start time
                  </label>

                  <input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(event) =>
                      setStartTime(event.target.value)
                    }
                    disabled={bookingLoading}
                    aria-invalid={
                      Boolean(startTime) &&
                      isToday &&
                      !startTimeIsValidForToday
                    }
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="end-time"
                    className="mb-2 block text-sm font-semibold"
                  >
                    End time
                  </label>

                  <input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(event) =>
                      setEndTime(event.target.value)
                    }
                    disabled={bookingLoading}
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              {/* Time validation messages */}
              {startTime &&
              isToday &&
              !startTimeIsValidForToday ? (
                <p className="text-sm font-medium text-red-500">
                  For today is booking, the start time must be in
                  the future.
                </p>
              ) : null}

              {startTime && endTime && duration <= 0 ? (
                <p className="text-sm font-medium text-red-500">
                  End time must be later than start time.
                </p>
              ) : null}

              {/* Guests */}
              <div>
                <label
                  htmlFor="guest-count"
                  className="mb-2 block text-sm font-semibold"
                >
                  Number of guests
                </label>

                <input
                  id="guest-count"
                  type="number"
                  min="1"
                  max={maxCapacity}
                  value={guests}
                  onChange={(event) =>
                    setGuests(event.target.value)
                  }
                  disabled={bookingLoading}
                  aria-invalid={
                    guests.length > 0 && !validGuestCount
                  }
                  className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  required
                />

                <p className="mt-2 text-xs text-muted">
                  Maximum {maxCapacity} guests
                </p>

                {guests && !validGuestCount ? (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    Guest count must be between 1 and{" "}
                    {maxCapacity}.
                  </p>
                ) : null}
              </div>

              {/* Price summary */}
              <div className="rounded-xl border border-border bg-surface-hover p-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">
                    Duration
                  </span>

                  <span className="font-semibold">
                    {duration > 0
                      ? `${duration} hour${
                          duration === 1 ? "" : "s"
                        }`
                      : "—"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">
                    Studio price
                  </span>

                  <span className="font-semibold">
                    ৳{estimatedPrice.toLocaleString("en-BD")}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">
                    Security deposit
                  </span>

                  <span className="font-semibold">
                    ৳{securityDeposit.toLocaleString("en-BD")}
                  </span>
                </div>

                <div className="my-4 border-t border-border" />

                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold">
                    Estimated total
                  </span>

                  <span className="text-lg font-bold text-primary">
                    ৳{totalAmount.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  bookingLoading || !formIsValid
                }
                className="studio-primary-button min-h-12 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bookingLoading
                  ? "Creating booking..."
                  : "Continue with booking"}
              </button>

              <p className="text-center text-xs leading-5 text-muted">
                Your booking will be created as{" "}
                <span className="font-semibold text-foreground">
                  pending
                </span>{" "}
                until the host confirms it.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}