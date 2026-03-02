"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n-context";

interface PropertyImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface PropertyDetail {
  id: string;
  landlordId: string;
  title: string;
  description: string | null;
  city: string;
  address: string | null;
  priceMonthly: number;
  rooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  furnished: boolean;
  visaFriendly: boolean;
  amenities: string[] | null;
  status: string;
  verified: boolean;
  createdAt: string;
  landlordName: string;
  images: PropertyImage[];
}

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { t } = useLanguage();
  const rt = t.rentals;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: id,
        message: inquiryMsg,
      }),
    });
    if (res.ok) {
      setInquirySent(true);
      setShowInquiry(false);
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <p className="text-gray-500">Property not found</p>
      </div>
    );
  }

  const isOwner = session?.user?.id === property.landlordId;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Photo Gallery */}
        <FadeIn>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="h-64 sm:h-96 bg-gray-100 flex items-center justify-center">
              {property.images.length > 0 ? (
                <img
                  src={property.images[selectedImage]?.imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-300 text-6xl">🏠</span>
              )}
            </div>
            {property.images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {property.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors cursor-pointer ${
                      selectedImage === idx
                        ? "border-brand-600"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Title + badges */}
            <FadeIn delay={100}>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {property.title}
                  </h1>
                  <div className="flex gap-2 shrink-0">
                    {property.verified && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent-100 text-accent-700">
                        {rt.verified}
                      </span>
                    )}
                    {property.visaFriendly && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                        {rt.visaFriendly}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-500 mb-4">{property.city}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {property.rooms !== null && (
                    <span>
                      {property.rooms} {rt.rooms}
                    </span>
                  )}
                  {property.bathrooms !== null && (
                    <span>
                      {property.bathrooms} {rt.bathrooms}
                    </span>
                  )}
                  {property.areaSqm !== null && (
                    <span>
                      {property.areaSqm} {rt.sqm}
                    </span>
                  )}
                  {property.furnished && <span>{rt.furnished}</span>}
                </div>
              </div>
            </FadeIn>

            {/* Description */}
            {property.description && (
              <FadeIn delay={150}>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-semibold text-gray-900 mb-3">
                    {rt.description}
                  </h2>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {property.description}
                  </p>
                </div>
              </FadeIn>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <FadeIn delay={200}>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-semibold text-gray-900 mb-3">
                    {rt.amenities}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((a) => (
                      <span
                        key={a}
                        className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                      >
                        {rt.amenityOptions[a as keyof typeof rt.amenityOptions] || a}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

          {/* Sidebar: Price + Contact */}
          <div className="lg:col-span-1">
            <FadeIn delay={200}>
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  €{(property.priceMonthly / 100).toFixed(0)}
                  <span className="text-sm text-gray-400 font-normal">
                    {rt.perMonth}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {property.landlordName}
                </p>

                {inquirySent ? (
                  <div className="p-3 bg-accent-50 text-accent-700 text-sm rounded-lg text-center">
                    {rt.inquirySent}
                  </div>
                ) : showInquiry ? (
                  <form onSubmit={handleInquiry} className="space-y-3">
                    <textarea
                      required
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      placeholder={rt.inquiryPlaceholder}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    />
                    <Button
                      type="submit"
                      loading={sending}
                      className="w-full"
                    >
                      {rt.sendInquiry}
                    </Button>
                  </form>
                ) : !isOwner ? (
                  session ? (
                    <Button
                      onClick={() => setShowInquiry(true)}
                      className="w-full"
                    >
                      {rt.contactLandlord}
                    </Button>
                  ) : (
                    <Link href="/auth/signin" className="block">
                      <Button className="w-full">{rt.contactLandlord}</Button>
                    </Link>
                  )
                ) : null}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
