"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthGuard from "../components/AuthGuard";
import { apiFetch } from "@/lib/api";

export default function HostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    pricePerHour: "",
    securityDeposit: "",
    maxCapacity: "",
    description: "",
    image: "",
    gallery: "",
    amenities: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter studio name.");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please enter studio location.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    const pricePerHour = Number(formData.pricePerHour);
    const securityDeposit = Number(formData.securityDeposit);
    const maxCapacity = Number(formData.maxCapacity);

    if (!Number.isFinite(pricePerHour) || pricePerHour <= 0) {
      toast.error("Please enter a valid hourly price.");
      return;
    }

    if (
      !Number.isFinite(securityDeposit) ||
      securityDeposit < 0
    ) {
      toast.error("Please enter a valid security deposit.");
      return;
    }

    if (
      !Number.isInteger(maxCapacity) ||
      maxCapacity < 1
    ) {
      toast.error(
        "Please enter a valid maximum capacity."
      );
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter studio description.");
      return;
    }

    if (!formData.image.trim()) {
      toast.error("Please provide a main studio image.");
      return;
    }

    setLoading(true);

    try {
      const gallery = formData.gallery
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 10);

      const response = await apiFetch("/api/studios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          location: formData.location.trim(),
          category: formData.category,
          pricePerHour,
          securityDeposit,
          maxCapacity,
          description: formData.description.trim(),
          image: formData.image.trim(),
          gallery,
          amenities: formData.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create studio."
        );
      }

      toast.success("Studio listed successfully!");

      setFormData({
        name: "",
        location: "",
        category: "",
        pricePerHour: "",
        securityDeposit: "",
        maxCapacity: "",
        description: "",
        image: "",
        gallery: "",
        amenities: "",
      });

      router.push("/studios");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-background py-8 text-foreground sm:py-12 lg:py-16">
        <div className="container-studio">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
              Become a Host
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              List your creative studio
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
              Share your creative space with photographers,
              filmmakers, musicians, and other creators.
            </p>
          </div>

          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-4 shadow-xl sm:p-6 md:p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Studio Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Studio Name
                </label>

                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Creative House Studio"
                  required
                  className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Location + Category */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Location
                  </label>

                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Dhaka"
                    required
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    <option value="">
                      Select category
                    </option>
                    <option value="Photo Studios">
                      Photo Studios
                    </option>
                    <option value="Sound Stages">
                      Sound Stages
                    </option>
                    <option value="Podcast Rooms">
                      Podcast Rooms
                    </option>
                    <option value="Music Suites">
                      Music Suites
                    </option>
                    <option value="Art Workshops">
                      Art Workshops
                    </option>
                  </select>
                </div>
              </div>

              {/* Price + Deposit + Capacity */}
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Hourly Rate
                  </label>

                  <input
                    type="number"
                    name="pricePerHour"
                    min="1"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    placeholder="1200"
                    required
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Security Deposit
                  </label>

                  <input
                    type="number"
                    name="securityDeposit"
                    min="0"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    placeholder="2000"
                    required
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Maximum Capacity
                  </label>

                  <input
                    type="number"
                    name="maxCapacity"
                    min="1"
                    step="1"
                    value={formData.maxCapacity}
                    onChange={handleChange}
                    placeholder="10"
                    required
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your studio..."
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Main Image */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Main Studio Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/studio.jpg"
                  required
                  className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Gallery */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Studio Gallery
                </label>

                <textarea
                  name="gallery"
                  value={formData.gallery}
                  onChange={handleChange}
                  placeholder={`https://example.com/studio-1.jpg
https://example.com/studio-2.jpg
https://example.com/studio-3.jpg`}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none focus:border-primary"
                />

                <p className="mt-2 text-xs text-muted">
                  One image URL per line. Maximum 10 images.
                </p>
              </div>

              {/* Amenities */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Amenities
                </label>

                <input
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="WiFi, AC, Parking, Sound System"
                  className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />

                <p className="mt-2 text-xs text-muted">
                  Separate amenities with commas.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="min-h-11 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating Studio..."
                  : "List My Studio"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}