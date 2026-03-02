"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren from "@/components/animations/StaggerChildren";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n-context";

interface CaptainItem {
  id: string;
  fullName: string;
  bio: string | null;
  photoUrl: string | null;
  city: string;
  languages: string[];
  expertise: string[];
  hourlyRate: number | null;
  avgRating: number;
  reviewCount: number;
}

export default function CaptainsPage() {
  const { t } = useLanguage();
  const [captains, setCaptains] = useState<CaptainItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [expertise, setExpertise] = useState("");

  const fetchCaptains = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (language) params.set("language", language);
    if (expertise) params.set("expertise", expertise);
    const res = await fetch(`/api/captains?${params}`);
    if (res.ok) setCaptains(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchCaptains();
  }, [language, expertise]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCaptains();
  };

  const ct = t.captains;
  const expertiseKeys = ["housing", "legal", "cultural", "business"] as const;
  const languageKeys = ["en", "es", "ru", "fr", "de", "pt", "zh", "ar"] as const;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {ct.title}
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {ct.subtitle}
            </p>
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={100}>
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={ct.searchPlaceholder}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="">{ct.allLanguages}</option>
                {languageKeys.map((l) => (
                  <option key={l} value={l}>
                    {ct.languageOptions[l]}
                  </option>
                ))}
              </select>
              <select
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="">{ct.allExpertise}</option>
                {expertiseKeys.map((e) => (
                  <option key={e} value={e}>
                    {ct.expertiseOptions[e]}
                  </option>
                ))}
              </select>
              <Button type="submit" size="md">
                {ct.filterLanguage}
              </Button>
            </form>
          </div>
        </FadeIn>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : captains.length === 0 ? (
          <FadeIn>
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">{ct.noCaptains}</p>
              <Link href="/captains/register">
                <Button variant="outline">{ct.register}</Button>
              </Link>
            </div>
          </FadeIn>
        ) : (
          <StaggerChildren staggerMs={80}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {captains.map((cap) => (
                <div
                  key={cap.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl shrink-0">
                      {cap.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {cap.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">{cap.city}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-orange-400 text-sm">
                          {"★".repeat(Math.round(Number(cap.avgRating)))}
                          {"☆".repeat(5 - Math.round(Number(cap.avgRating)))}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({cap.reviewCount} {ct.reviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  {cap.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {cap.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cap.expertise.map((e) => (
                      <span
                        key={e}
                        className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700"
                      >
                        {ct.expertiseOptions[e as keyof typeof ct.expertiseOptions] || e}
                      </span>
                    ))}
                    {cap.languages.map((l) => (
                      <span
                        key={l}
                        className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                      >
                        {ct.languageOptions[l as keyof typeof ct.languageOptions] || l}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      €{((cap.hourlyRate || 3000) / 100).toFixed(0)}
                      <span className="text-sm text-gray-400 font-normal">
                        {ct.hourlyRate}
                      </span>
                    </span>
                    <Link href={`/captains/${cap.id}`}>
                      <Button size="sm" variant="outline">
                        {ct.viewProfile}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </StaggerChildren>
        )}
      </div>
    </div>
  );
}
