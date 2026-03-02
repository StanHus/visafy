"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FadeIn from "@/components/animations/FadeIn";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLanguage } from "@/lib/i18n-context";

const AMENITY_OPTIONS = [
  "wifi", "parking", "ac", "elevator", "balcony",
  "pool", "gym", "laundry", "pets", "storage",
] as const;

export default function ListPropertyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const rt = t.rentals;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [furnished, setFurnished] = useState(false);
  const [visaFriendly, setVisaFriendly] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  // Photo upload state
  const [photos, setPhotos] = useState<{ url: string; isPrimary: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const toggleAmenity = (a: string) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || undefined,
        city,
        address: address || undefined,
        priceMonthly: Math.round(parseFloat(price) * 100),
        rooms: rooms ? parseInt(rooms) : undefined,
        bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
        areaSqm: area ? parseInt(area) : undefined,
        furnished,
        visaFriendly,
        amenities,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setPropertyId(data.property.id);
      setSuccess(true);
    } else {
      setError(data.error || "Something went wrong");
    }
    setSubmitting(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !propertyId) return;
    setUploading(true);

    for (const file of Array.from(e.target.files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("isPrimary", String(photos.length === 0));

      const res = await fetch(`/api/properties/${propertyId}/images`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPhotos((prev) => [
          ...prev,
          { url: data.image.imageUrl, isPrimary: data.image.isPrimary },
        ]);
      }
    }
    setUploading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center mx-auto mb-4 text-2xl">
                  ✓
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {rt.listSuccess}
                </h2>
              </div>

              {/* Photo upload section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {rt.uploadPhotos}
                </h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  {photos.map((p, i) => (
                    <div key={i} className="w-24 h-24 rounded-lg overflow-hidden relative">
                      <img
                        src={p.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {p.isPrimary && (
                        <span className="absolute top-1 left-1 text-xs bg-brand-600 text-white px-1.5 py-0.5 rounded">
                          {rt.primaryPhoto}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <label className="inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    loading={uploading}
                    onClick={() => {}}
                  >
                    {uploading ? rt.uploading : rt.addPhotos}
                  </Button>
                </label>
              </div>

              <div className="mt-6 flex gap-3 justify-center">
                <Button
                  onClick={() => router.push("/rentals/dashboard")}
                  variant="outline"
                >
                  {rt.dashboard}
                </Button>
                <Button onClick={() => router.push(`/rentals/${propertyId}`)}>
                  {rt.viewDetails}
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {rt.listTitle}
            </h1>
            <p className="text-gray-500">{rt.listSubtitle}</p>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-6"
          >
            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            <Input
              label={rt.titleLabel}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={rt.titlePlaceholder}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {rt.descriptionLabel}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={rt.descriptionPlaceholder}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={rt.cityLabel}
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={rt.cityPlaceholder}
              />
              <Input
                label={rt.addressLabel}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={rt.addressPlaceholder}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label={rt.priceLabel}
                required
                type="number"
                min="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={rt.pricePlaceholder}
              />
              <Input
                label={rt.roomsLabel}
                type="number"
                min="0"
                max="50"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
              />
              <Input
                label={rt.bathroomsLabel}
                type="number"
                min="0"
                max="20"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              />
              <Input
                label={rt.areaLabel}
                type="number"
                min="1"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={furnished}
                  onChange={(e) => setFurnished(e.target.checked)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                {rt.furnishedLabel}
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visaFriendly}
                  onChange={(e) => setVisaFriendly(e.target.checked)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span>
                  {rt.visaFriendlyLabel}
                  <span className="text-xs text-gray-400 ml-1">
                    ({rt.visaFriendlyHelp})
                  </span>
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {rt.amenitiesLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
                      amenities.includes(a)
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                    }`}
                  >
                    {rt.amenityOptions[a as keyof typeof rt.amenityOptions]}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" loading={submitting} className="w-full">
              {submitting ? rt.submitting : rt.submit}
            </Button>
          </form>
        </FadeIn>
      </div>
    </div>
  );
}
