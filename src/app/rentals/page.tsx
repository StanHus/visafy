"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren from "@/components/animations/StaggerChildren";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n-context";

interface PropertyItem {
  id: string;
  title: string;
  description: string | null;
  city: string;
  priceMonthly: number;
  rooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  furnished: boolean;
  visaFriendly: boolean;
  verified: boolean;
  primaryImage: string | null;
  landlordName: string;
}

export default function RentalsPage() {
  const { t } = useLanguage();
  const rt = t.rentals;
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [furnished, setFurnished] = useState(false);
  const [visaFriendly, setVisaFriendly] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (maxPrice) params.set("maxPrice", String(parseInt(maxPrice) * 100));
    if (rooms) params.set("rooms", rooms);
    if (furnished) params.set("furnished", "true");
    if (visaFriendly) params.set("visaFriendly", "true");
    const res = await fetch(`/api/properties?${params}`);
    if (res.ok) setProperties(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, [furnished, visaFriendly]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {rt.title}
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {rt.subtitle}
            </p>
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={100}>
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={rt.searchPlaceholder}
                className="flex-1 min-w-[200px] px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={rt.filterPrice + " (€)"}
                className="w-full sm:w-36 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <select
                value={rooms}
                onChange={(e) => {
                  setRooms(e.target.value);
                  setTimeout(fetchProperties, 0);
                }}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="">{rt.allRooms}</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} {rt.rooms}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={furnished}
                  onChange={(e) => setFurnished(e.target.checked)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                {rt.filterFurnished}
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visaFriendly}
                  onChange={(e) => setVisaFriendly(e.target.checked)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                {rt.filterVisaFriendly}
              </label>
              <Button type="submit" size="md">
                {rt.filterRooms}
              </Button>
            </form>
          </div>
        </FadeIn>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : properties.length === 0 ? (
          <FadeIn>
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">{rt.noProperties}</p>
              <Link href="/rentals/list">
                <Button variant="outline">{rt.listProperty}</Button>
              </Link>
            </div>
          </FadeIn>
        ) : (
          <StaggerChildren staggerMs={80}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <Link
                  key={prop.id}
                  href={`/rentals/${prop.id}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 block"
                >
                  {/* Image */}
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {prop.primaryImage ? (
                      <img
                        src={prop.primaryImage}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-300 text-4xl">🏠</span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1">
                        {prop.title}
                      </h3>
                      {prop.verified && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent-100 text-accent-700 ml-2 shrink-0">
                          {rt.verified}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 mb-3">{prop.city}</p>

                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                      {prop.rooms !== null && (
                        <span>
                          {prop.rooms} {rt.rooms}
                        </span>
                      )}
                      {prop.bathrooms !== null && (
                        <span>
                          {prop.bathrooms} {rt.bathrooms}
                        </span>
                      )}
                      {prop.areaSqm !== null && (
                        <span>
                          {prop.areaSqm} {rt.sqm}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {prop.furnished && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                          {rt.furnished}
                        </span>
                      )}
                      {prop.visaFriendly && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                          {rt.visaFriendly}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        €{(prop.priceMonthly / 100).toFixed(0)}
                        <span className="text-sm text-gray-400 font-normal">
                          {rt.perMonth}
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </StaggerChildren>
        )}
      </div>
    </div>
  );
}
