"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AuthGuard from "../components/AuthGuard";
import { apiFetch } from "@/lib/api";

type Studio = {
  _id: string;
  name: string;
  category: string;
  location: string;
  pricePerHour: number;
  image: string;
  description: string;
  amenities: string[];
};

export default function MyStudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(
    null
  );

  useEffect(() => {
    async function loadStudios() {
      try {
        const response = await apiFetch("/api/studios/my-studios");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load your studios."
          );
        }

        setStudios(data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load your studios."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadStudios();
  }, []);

  async function handleDelete() {
    if (!selectedStudio) return;

    const id = selectedStudio._id;

    setDeletingId(id);

    try {
      const response = await apiFetch(`/api/studios/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete studio."
        );
      }

      setStudios((currentStudios) =>
        currentStudios.filter((studio) => studio._id !== id)
      );

      setSelectedStudio(null);

      toast.success("Studio deleted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete studio."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-background py-8 text-foreground sm:py-12 lg:py-16">
        <div className="container-studio">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm sm:tracking-[0.2em]">
                Host Dashboard
              </p>

              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                My Studios
              </h1>

              <p className="mt-3 text-sm leading-6 text-muted sm:text-base sm:leading-7">
                Manage the creative spaces you have listed on
                StudioSpace.
              </p>
            </div>

            <Link
              href="/host"
              className="studio-primary-button w-full sm:w-fit"
            >
              + List New Studio
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-border bg-surface px-5 py-12 text-center sm:px-8 sm:py-16">
              <p className="text-sm text-muted">
                Loading your studios...
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && studios.length === 0 && (
            <div className="rounded-2xl border border-border bg-surface px-5 py-12 text-center sm:px-8 sm:py-16">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-hover text-lg text-primary sm:h-14 sm:w-14 sm:text-xl">
                +
              </div>

              <h2 className="mt-5 text-xl font-bold sm:text-2xl">
                No studios listed yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                You have not listed a creative space yet. Add your
                first studio and start connecting with creators.
              </p>

              <Link
                href="/host"
                className="studio-primary-button mt-6 w-full sm:w-auto"
              >
                List Your Studio
              </Link>
            </div>
          )}

          {/* Studio cards */}
          {!loading && studios.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {studios.map((studio) => (
                <article
                  key={studio._id}
                  className="overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-52 w-full sm:h-56 lg:h-60">
                    <Image
                      src={studio.image}
                      alt={studio.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="max-w-[60%] truncate rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                        {studio.category}
                      </span>

                      <span className="shrink-0 text-sm font-bold text-primary">
                        ৳{studio.pricePerHour}/hr
                      </span>
                    </div>

                    <h2 className="mt-4 break-words text-lg font-bold sm:text-xl">
                      {studio.name}
                    </h2>

                    <p className="mt-2 truncate text-sm text-muted">
                      {studio.location}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                      {studio.description}
                    </p>

                    {/* View + Update */}
                    <div className="mt-5 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                      <Link
                        href={`/studios/${studio._id}`}
                        className="studio-secondary-button w-full"
                      >
                        View
                      </Link>

                      <Link
                        href={`/studios/edit/${studio._id}`}
                        className="studio-primary-button w-full"
                      >
                        Update
                      </Link>
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setSelectedStudio(studio)}
                      className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full border border-danger/40 px-4 py-2.5 text-sm font-bold text-danger transition-colors hover:bg-danger/10"
                    >
                      Delete Studio
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {selectedStudio && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-5 backdrop-blur-sm sm:py-8"
            onClick={() => {
              if (!deletingId) {
                setSelectedStudio(null);
              }
            }}
          >
            <div
              className="my-auto w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Icon */}
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 text-lg text-danger sm:h-12 sm:w-12 sm:text-xl">
                !
              </div>

              <h2 className="mt-5 text-xl font-bold sm:text-2xl">
                Delete this studio?
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  {selectedStudio.name}
                </span>
                ? This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedStudio(null)}
                  disabled={Boolean(deletingId)}
                  className="min-h-11 w-full rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={Boolean(deletingId)}
                  className="min-h-11 w-full rounded-full bg-danger px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {deletingId ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}