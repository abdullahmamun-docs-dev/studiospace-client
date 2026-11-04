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
    amenities: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      Number(formData.pricePerHour) <= 0 ||
      Number(formData.securityDeposit) < 0 ||
      Number(formData.maxCapacity) <= 0
    ) {
      toast.error("Please enter valid price, deposit, and capacity.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch("/api/studios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          category: formData.category,
          pricePerHour: Number(formData.pricePerHour),
          securityDeposit: Number(formData.securityDeposit),
          maxCapacity: Number(formData.maxCapacity),
          description: formData.description,
          image: formData.image,
          amenities: formData.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create studio.");
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
        amenities: "",
      });

      router.push("/studios");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-background py-8 text-foreground sm:py-12 lg:py-16">
        <div className="container-studio">
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm sm:tracking-[0.2em]">
              Become a Host
            </p>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              List your creative studio
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Share your creative space with photographers,
              filmmakers, musicians, and other creators.
            </p>
          </div>

          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-4 shadow-xl sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Studio Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Creative House Studio"
                  required
                  className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Dhaka"
                    required
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  >
                    <option value="">Select category</option>
                    <option value="Photo Studios">Photo Studios</option>
                    <option value="Sound Stages">Sound Stages</option>
                    <option value="Podcast Rooms">Podcast Rooms</option>
                    <option value="Music Suites">Music Suites</option>
                    <option value="Art Workshops">Art Workshops</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div>
                  <label
                    htmlFor="pricePerHour"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Price per Hour (৳)
                  </label>

                  <input
                    id="pricePerHour"
                    name="pricePerHour"
                    type="number"
                    min="1"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    placeholder="1200"
                    required
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="securityDeposit"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Security Deposit (৳)
                  </label>

                  <input
                    id="securityDeposit"
                    name="securityDeposit"
                    type="number"
                    min="0"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    placeholder="2000"
                    required
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="maxCapacity"
                  className="mb-2 block text-sm font-semibold"
                >
                  Maximum Capacity (People)
                </label>

                <input
                  id="maxCapacity"
                  name="maxCapacity"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  placeholder="10"
                  required
                  className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your studio and what creators can use it for."
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-semibold"
                >
                  Studio Image URL
                </label>

                <input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/studio-image.jpg"
                  required
                  className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />

                <p className="mt-2 text-xs leading-5 text-muted">
                  Use a direct image URL.
                </p>
              </div>

              <div>
                <label
                  htmlFor="amenities"
                  className="mb-2 block text-sm font-semibold"
                >
                  Amenities
                </label>

                <input
                  id="amenities"
                  name="amenities"
                  type="text"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="Wi-Fi, Lighting, Changing Room"
                  className="min-h-11 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />

                <p className="mt-2 text-xs leading-5 text-muted">
                  Separate multiple amenities with commas.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="min-h-11 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-12"
              >
                {loading ? "Creating Studio..." : "List My Studio"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}