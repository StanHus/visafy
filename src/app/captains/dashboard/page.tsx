"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FadeIn from "@/components/animations/FadeIn";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n-context";

interface BookingItem {
  id: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  status: string;
  totalAmount: number | null;
  captainPayout: number | null;
  clientName: string;
  captainName: string;
}

interface AvailSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-brand-50 text-brand-700",
  completed: "bg-accent-100 text-accent-700",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function CaptainDashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const ct = t.captains;

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [availability, setAvailability] = useState<AvailSlot[]>([]);
  const [tab, setTab] = useState<"bookings" | "availability" | "earnings">("bookings");
  const [loading, setLoading] = useState(true);
  const [savingAvail, setSavingAvail] = useState(false);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/signin");
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    Promise.all([
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/captains/availability").then((r) => r.json()),
    ]).then(([b, a]) => {
      setBookings(Array.isArray(b) ? b : []);
      setAvailability(Array.isArray(a) ? a : []);
      setLoading(false);
    });
  }, [authStatus]);

  const totalEarnings = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.captainPayout || 0), 0);

  const addSlot = () => {
    setAvailability([
      ...availability,
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isAvailable: true },
    ]);
  };

  const updateSlot = (idx: number, field: keyof AvailSlot, value: string | number | boolean) => {
    const updated = [...availability];
    updated[idx] = { ...updated[idx], [field]: value };
    setAvailability(updated);
  };

  const removeSlot = (idx: number) => {
    setAvailability(availability.filter((_, i) => i !== idx));
  };

  const saveAvailability = async () => {
    setSavingAvail(true);
    await fetch("/api/captains/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots: availability }),
    });
    setSavingAvail(false);
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {ct.dashboard}
          </h1>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={50}>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
            {(["bookings", "availability", "earnings"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  tab === t
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "bookings"
                  ? ct.myBookings
                  : t === "availability"
                    ? ct.myAvailability
                    : ct.earnings}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Bookings Tab */}
        {tab === "bookings" && (
          <FadeIn delay={100}>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {bookings.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  {ct.noBookings}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          {ct.bookingDate}
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          {ct.bookingTime}
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          {ct.bookingDuration}
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          {ct.bookingClient}
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          {ct.bookingAmount}
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          {ct.bookingStatus}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{b.date}</td>
                          <td className="px-4 py-3">{b.startTime}</td>
                          <td className="px-4 py-3">
                            {b.durationMinutes} {ct.minutes}
                          </td>
                          <td className="px-4 py-3">{b.clientName}</td>
                          <td className="px-4 py-3">
                            €{((b.captainPayout || 0) / 100).toFixed(0)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                STATUS_COLORS[b.status] || "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* Availability Tab */}
        {tab === "availability" && (
          <FadeIn delay={100}>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              {availability.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pb-4 border-b border-gray-100 last:border-0"
                >
                  <select
                    value={slot.dayOfWeek}
                    onChange={(e) =>
                      updateSlot(idx, "dayOfWeek", parseInt(e.target.value))
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                  >
                    {ct.days.map((day, i) => (
                      <option key={i} value={i}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{ct.from}</span>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        updateSlot(idx, "startTime", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <span className="text-xs text-gray-500">{ct.to}</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        updateSlot(idx, "endTime", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSlot(idx)}
                    className="text-rose-500 text-sm hover:text-rose-700 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSlot}
                >
                  {ct.addSlot}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  loading={savingAvail}
                  onClick={saveAvailability}
                >
                  {ct.saveAvailability}
                </Button>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Earnings Tab */}
        {tab === "earnings" && (
          <FadeIn delay={100}>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-sm text-gray-500 mb-2">{ct.totalEarnings}</p>
              <p className="text-4xl font-bold text-gray-900">
                €{(totalEarnings / 100).toFixed(2)}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {bookings.filter((b) => b.status === "completed").length}{" "}
                {ct.completedSessions}
              </p>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
