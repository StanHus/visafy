"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FadeIn from "@/components/animations/FadeIn";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLanguage } from "@/lib/i18n-context";

const EXPERTISE_OPTIONS = ["housing", "legal", "cultural", "business"] as const;
const LANGUAGE_OPTIONS = ["en", "es", "ru", "fr", "de", "pt", "zh", "ar"] as const;

export default function CaptainRegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const ct = t.captains;

  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  const toggleItem = (
    arr: string[],
    set: (v: string[]) => void,
    item: string
  ) => {
    set(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/captains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio,
        city,
        languages,
        expertise,
        hourlyRate: Math.round(parseFloat(hourlyRate) * 100),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess(true);
    } else {
      setError(data.error || "Something went wrong");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <FadeIn>
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center mx-auto mb-4 text-2xl">
              ✓
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {ct.registerSuccess}
            </h2>
            <Button
              onClick={() => router.push("/captains/dashboard")}
              className="mt-4"
            >
              {ct.dashboard}
            </Button>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {ct.registerTitle}
            </h1>
            <p className="text-gray-500">{ct.registerSubtitle}</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {ct.bioLabel}
              </label>
              <textarea
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={ct.bioPlaceholder}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <Input
              label={ct.cityLabel}
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={ct.cityPlaceholder}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ct.languagesLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => toggleItem(languages, setLanguages, l)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
                      languages.includes(l)
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                    }`}
                  >
                    {ct.languageOptions[l]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ct.expertiseLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_OPTIONS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => toggleItem(expertise, setExpertise, e)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
                      expertise.includes(e)
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                    }`}
                  >
                    {ct.expertiseOptions[e]}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label={ct.hourlyRateLabel}
              required
              type="number"
              min="5"
              max="500"
              step="1"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder={ct.hourlyRatePlaceholder}
            />

            <Button type="submit" loading={submitting} className="w-full">
              {submitting ? ct.submitting : ct.submit}
            </Button>
          </form>
        </FadeIn>
      </div>
    </div>
  );
}
