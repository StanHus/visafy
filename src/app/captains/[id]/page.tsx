"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n-context";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewerName: string;
}

interface CaptainProfile {
  id: string;
  userId: string;
  fullName: string;
  bio: string | null;
  photoUrl: string | null;
  city: string;
  languages: string[];
  expertise: string[];
  hourlyRate: number | null;
  status: string;
  createdAt: string;
  avgRating: number;
  reviewCount: number;
  reviews: ReviewItem[];
  completedBookings: number;
}

export default function CaptainProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [captain, setCaptain] = useState<CaptainProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00");
  const [bookingDuration, setBookingDuration] = useState(60);
  const [bookingNotes, setBookingNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/captains/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCaptain(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const ct = t.captains;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        captainId: id,
        date: bookingDate,
        startTime: bookingTime,
        durationMinutes: bookingDuration,
        notes: bookingNotes || undefined,
      }),
    });
    if (res.ok) {
      setBookingSuccess(true);
      setShowBooking(false);
    }
    setBooking(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!captain) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <p className="text-gray-500">Captain not found</p>
      </div>
    );
  }

  const hourlyRate = (captain.hourlyRate || 3000) / 100;
  const totalCost = (hourlyRate * bookingDuration) / 60;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-3xl shrink-0 mx-auto sm:mx-0">
                {captain.fullName.charAt(0)}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {captain.fullName}
                  </h1>
                  {captain.status === "verified" && (
                    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-accent-100 text-accent-700 font-medium">
                      {ct.verified}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 mb-2">{captain.city}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                  <span className="text-orange-400">
                    {"★".repeat(Math.round(Number(captain.avgRating)))}
                    {"☆".repeat(5 - Math.round(Number(captain.avgRating)))}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({captain.reviewCount} {ct.reviews})
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>
                    €{hourlyRate.toFixed(0)}
                    {ct.hourlyRate}
                  </span>
                  <span>
                    {captain.completedBookings} {ct.completedSessions}
                  </span>
                  <span>
                    {ct.memberSince}{" "}
                    {new Date(captain.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <FadeIn delay={100}>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-3">{ct.about}</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {captain.bio || "—"}
                </p>
              </div>
            </FadeIn>

            {/* Expertise & Languages */}
            <FadeIn delay={150}>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-3">
                  {ct.expertise}
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {captain.expertise.map((e) => (
                    <span
                      key={e}
                      className="text-sm px-3 py-1 rounded-full bg-brand-50 text-brand-700"
                    >
                      {ct.expertiseOptions[e as keyof typeof ct.expertiseOptions] || e}
                    </span>
                  ))}
                </div>
                <h2 className="font-semibold text-gray-900 mb-3">
                  {ct.languages}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {captain.languages.map((l) => (
                    <span
                      key={l}
                      className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                    >
                      {ct.languageOptions[l as keyof typeof ct.languageOptions] || l}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Reviews */}
            <FadeIn delay={200}>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                  {ct.reviews} ({captain.reviewCount})
                </h2>
                {captain.reviews.length === 0 ? (
                  <p className="text-sm text-gray-400">{ct.noReviews}</p>
                ) : (
                  <div className="space-y-4">
                    {captain.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-gray-900">
                            {rev.reviewerName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-orange-400 text-sm">
                          {"★".repeat(rev.rating)}
                          {"☆".repeat(5 - rev.rating)}
                        </span>
                        {rev.comment && (
                          <p className="text-sm text-gray-600 mt-1">
                            {rev.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Sidebar: Book */}
          <div className="lg:col-span-1">
            <FadeIn delay={200}>
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                {bookingSuccess ? (
                  <div className="text-center">
                    <p className="text-accent-700 font-medium mb-3">
                      {ct.bookingForm.success}
                    </p>
                    <Link href="/dashboard">
                      <Button size="sm" variant="outline">
                        {t.nav.dashboard}
                      </Button>
                    </Link>
                  </div>
                ) : showBooking ? (
                  <form onSubmit={handleBook} className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      {ct.bookingForm.title}
                    </h3>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {ct.bookingForm.date}
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {ct.bookingForm.time}
                      </label>
                      <input
                        type="time"
                        required
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {ct.bookingForm.duration}
                      </label>
                      <select
                        value={bookingDuration}
                        onChange={(e) =>
                          setBookingDuration(parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                      >
                        <option value={30}>30 {ct.minutes}</option>
                        <option value={60}>60 {ct.minutes}</option>
                        <option value={90}>90 {ct.minutes}</option>
                        <option value={120}>120 {ct.minutes}</option>
                        <option value={180}>180 {ct.minutes}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {ct.bookingForm.notes}
                      </label>
                      <textarea
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder={ct.bookingForm.notesPlaceholder}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        {ct.bookingForm.total}
                      </span>
                      <span className="font-semibold text-gray-900">
                        €{totalCost.toFixed(0)}
                      </span>
                    </div>
                    <Button
                      type="submit"
                      loading={booking}
                      className="w-full"
                    >
                      {booking
                        ? ct.bookingForm.confirming
                        : ct.bookingForm.confirm}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      €{hourlyRate.toFixed(0)}
                      <span className="text-sm text-gray-400 font-normal">
                        {ct.hourlyRate}
                      </span>
                    </p>
                    {session ? (
                      <Button
                        onClick={() => setShowBooking(true)}
                        className="w-full mt-4"
                      >
                        {ct.bookSession}
                      </Button>
                    ) : (
                      <Link href="/auth/signin" className="block mt-4">
                        <Button className="w-full">{ct.bookSession}</Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
