"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

const CATEGORY_OPTIONS = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

type Studio = {
  _id: string;
  name: string;
  location: string;
  category: string;
  pricePerHour: number;
  securityDeposit?: number;
  maxCapacity?: number;
  description: string;
  image: string;
  gallery?: string[];
  amenities?: string[];
  hostName?: string;
  hostEmail?: string;
};

export default function EditStudioPage() {
  const params = useParams();
  const router = useRouter();

  const studioId = String(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: CATEGORY_OPTIONS[0],
    pricePerHour: "",
    securityDeposit: "",
    maxCapacity: "",
    description: "",
    image: "",
    gallery: "",
    amenities: "",
  });

  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");

  useEffect(() => {
    async function loadStudio() {
      try {
        setLoading(true);

        const response = await apiFetch(
          `/api/studios/${studioId}`
        );

        if (!response.ok) {
          throw new Error("Failed to load studio.");
        }

        const studio: Studio = await response.json();

        let category = studio.category;

        if (category === "Photography") {
          category = "Photo Studios";
        }

        if (!CATEGORY_OPTIONS.includes(category)) {
          category = CATEGORY_OPTIONS[0];
        }

        setFormData({
          name: studio.name || "",
          location: studio.location || "",
          category,
          pricePerHour:
            studio.pricePerHour !== undefined
              ? String(studio.pricePerHour)
              : "",
          securityDeposit:
            studio.securityDeposit !== undefined
              ? String(studio.securityDeposit)
              : "",
          maxCapacity:
            studio.maxCapacity !== undefined
              ? String(studio.maxCapacity)
              : "",
          description: studio.description || "",
          image: studio.image || "",
          gallery: Array.isArray(studio.gallery)
            ? studio.gallery.join("\n")
            : "",
          amenities: Array.isArray(studio.amenities)
            ? studio.amenities.join(", ")
            : "",
        });

        setHostName(studio.hostName || "");
        setHostEmail(studio.hostEmail || "");
      } catch (error) {
        console.error("Failed to load studio:", error);
        toast.error("Failed to load studio.");
      } finally {
        setLoading(false);
      }
    }

    if (studioId) {
      loadStudio();
    }
  }, [studioId]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const pricePerHour = Number(formData.pricePerHour);
    const securityDeposit = Number(
      formData.securityDeposit
    );
    const maxCapacity = Number(formData.maxCapacity);

    if (!formData.name.trim()) {
      toast.error("Please enter studio name.");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please enter studio location.");
      return;
    }

    if (!CATEGORY_OPTIONS.includes(formData.category)) {
      toast.error("Please select a valid category.");
      return;
    }

    if (
      !Number.isFinite(pricePerHour) ||
      pricePerHour <= 0
    ) {
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
      toast.error("Please provide a studio image URL.");
      return;
    }

    setSaving(true);

    try {
      const gallery = formData.gallery
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 10);

      const amenities = formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const response = await apiFetch(
        `/api/studios/${studioId}`,
        {
          method: "PATCH",
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
            amenities,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update studio."
        );
      }

      toast.success(
        data.message || "Studio updated successfully."
      );

      router.push(`/studios/${studioId}`);
      router.refresh();
    } catch (error) {
      console.error("Update studio error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update studio."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-12">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="h-8 w-64 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-8 h-[700px] rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/studios/${studioId}`}
          className="text-sm text-gray-600 hover:underline dark:text-gray-400"
        >
          ← Back to studio
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          Edit Studio
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Update your studio information.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border bg-white p-6 shadow-sm dark:bg-gray-950"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Studio Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border bg-transparent px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border bg-transparent px-4 py-3"
              required
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Location
            </label>

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-lg border bg-transparent px-4 py-3"
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Hourly Rate
              </label>

              <input
                type="number"
                name="pricePerHour"
                min="1"
                value={formData.pricePerHour}
                onChange={handleChange}
                className="w-full rounded-lg border bg-transparent px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Security Deposit
              </label>

              <input
                type="number"
                name="securityDeposit"
                min="0"
                value={formData.securityDeposit}
                onChange={handleChange}
                className="w-full rounded-lg border bg-transparent px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Maximum Capacity
              </label>

              <input
                type="number"
                name="maxCapacity"
                min="1"
                value={formData.maxCapacity}
                onChange={handleChange}
                className="w-full rounded-lg border bg-transparent px-4 py-3"
                placeholder="e.g. 5"
                required
              />

              <p className="mt-1 text-xs text-gray-500">
                Maximum number of guests allowed.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Image URL
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full rounded-lg border bg-transparent px-4 py-3"
              required
            />
          </div>

          {/* Gallery */}
          <div>
            <label className="mb-2 block text-sm font-medium">
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
              className="w-full rounded-lg border bg-transparent px-4 py-3"
            />

            <p className="mt-1 text-xs text-gray-500">
              One image URL per line. Maximum 10 images.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Amenities
            </label>

            <input
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, AC, Parking, Sound System"
              className="w-full rounded-lg border bg-transparent px-4 py-3"
            />

            <p className="mt-1 text-xs text-gray-500">
              Separate amenities with commas.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Overview
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-lg border bg-transparent px-4 py-3"
              required
            />
          </div>

          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
            <h3 className="font-semibold">
              Host Information
            </h3>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">
                  Host Name
                </p>

                <p className="mt-1 font-medium">
                  {hostName || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Host Email
                </p>

                <p className="mt-1 font-medium">
                  {hostEmail || "Not available"}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {saving ? "Updating Studio..." : "Update Studio"}
          </button>
        </form>
      </div>
    </main>
  );
}