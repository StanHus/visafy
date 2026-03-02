"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren from "@/components/animations/StaggerChildren";
import { VISA_LABELS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n-context";

interface DocInfo {
  id: string;
  fileName: string;
  fileUrl: string;
  documentType: string;
  status: string;
}

interface Application {
  id: string;
  visaType: string | null;
  status: string;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  fields: Record<string, string>;
  documents: DocInfo[];
}

interface StatusHistoryEntry {
  id: string;
  oldStatus: string | null;
  newStatus: string;
  note: string | null;
  createdAt: string;
  changedByName: string | null;
}

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100" },
  submitted: { label: "Submitted", color: "text-brand-700", bg: "bg-brand-50" },
  under_review: { label: "Under Review", color: "text-brand-700", bg: "bg-brand-50" },
  additional_info_needed: { label: "Info Needed", color: "text-brand-700", bg: "bg-brand-50" },
  approved: { label: "Approved", color: "text-accent-700", bg: "bg-accent-50" },
  rejected: { label: "Rejected", color: "text-rose-700", bg: "bg-rose-50" },
};

const formatDate = (d: string) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? "\u2014" : date.toLocaleDateString();
};

const formatDateTime = (d: string) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? "\u2014" : date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

function isImageFile(fileName: string) {
  const ext = fileName.toLowerCase().split(".").pop();
  return ext === "jpg" || ext === "jpeg" || ext === "png";
}

function DashboardContent() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [timelineApp, setTimelineApp] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<StatusHistoryEntry[]>([]);
  const [payingApp, setPayingApp] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      setPaymentMessage(t.payments.success);
    } else if (payment === "cancelled") {
      setPaymentMessage(t.payments.cancelled);
    }
  }, [searchParams, t]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        if (Array.isArray(data)) {
          setApplications(data);
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const loadTimeline = async (appId: string) => {
    if (timelineApp === appId) {
      setTimelineApp(null);
      return;
    }
    setTimelineApp(appId);
    try {
      const res = await fetch(`/api/status-history?applicationId=${appId}`);
      const data = await res.json();
      if (Array.isArray(data)) setTimeline(data);
    } catch {
      setTimeline([]);
    }
  };

  const handlePayment = async (appId: string, visaType: string) => {
    setPayingApp(appId);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, visaType }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setPayingApp(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-gray-900 tracking-tight">
            KORE
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-sm text-gray-400 hidden sm:inline">
              {session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150 cursor-pointer"
            >
              {t.dashboard.signOut}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* Payment message */}
        {paymentMessage && (
          <FadeIn duration={300} direction="up">
            <div className="mb-6 p-4 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 text-sm flex items-center justify-between">
              <span>{paymentMessage}</span>
              <button onClick={() => setPaymentMessage(null)} className="text-brand-600 hover:text-brand-800 cursor-pointer text-xs font-medium ml-4">
                Dismiss
              </button>
            </div>
          </FadeIn>
        )}

        <FadeIn duration={400} direction="up">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">{t.dashboard.title}</h1>
              <p className="text-sm text-gray-500">
                {t.dashboard.welcomeBack} {session?.user?.name || "there"}.
              </p>
            </div>
            <Link href="/onboarding">
              <Button size="sm">+ New Application</Button>
            </Link>
          </div>
        </FadeIn>

        {applications.length === 0 ? (
          <FadeIn delay={100} duration={400} direction="up">
            <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {t.dashboard.noAppTitle}
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                {t.dashboard.noAppDesc}
              </p>
              <Link href="/onboarding">
                <Button className="w-full sm:w-auto">{t.dashboard.startApp}</Button>
              </Link>
            </div>
          </FadeIn>
        ) : (
          <StaggerChildren staggerMs={80} duration={400} direction="up" className="space-y-4">
            {applications.map((app) => {
              const statusInfo = STATUS_STYLES[app.status] || STATUS_STYLES.draft;
              const docs = app.documents || [];
              const isExpanded = expandedApp === app.id;
              const showTimeline = timelineApp === app.id;
              const canPay = app.status === "submitted";

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h2 className="text-base font-medium text-gray-900">
                            {VISA_LABELS[app.visaType || ""] || "Visa Application"}
                          </h2>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bg}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          ID: {app.id.slice(0, 8)} &middot; Created {formatDate(app.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {app.status === "draft" && (
                          <Link href={`/onboarding?id=${app.id}`}>
                            <Button size="sm">{t.dashboard.continueApp}</Button>
                          </Link>
                        )}
                        {canPay && (
                          <Button
                            size="sm"
                            onClick={() => handlePayment(app.id, app.visaType || "work_visa")}
                            loading={payingApp === app.id}
                          >
                            {t.payments.pay} &euro;499
                          </Button>
                        )}
                        <button
                          onClick={() => loadTimeline(app.id)}
                          className={`text-xs transition-colors cursor-pointer px-2 py-1 rounded ${
                            showTimeline ? "text-brand-600 bg-brand-50" : "text-gray-400 hover:text-gray-600"
                          }`}
                        >
                          {t.dashboard.timeline}
                        </button>
                        <button
                          onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer px-2 py-1"
                        >
                          {isExpanded ? "Less" : "Details"}
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-500">{t.dashboard.progress}</span>
                        <span className="text-gray-900 font-medium">
                          {t.dashboard.stepOf.replace("{current}", String(app.currentStep)).replace("{total}", "6")}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-brand-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(app.currentStep / 6) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick info row */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-[11px] text-gray-400 mb-0.5">{t.dashboard.visaType}</p>
                        <p className="text-xs text-gray-900 truncate">
                          {VISA_LABELS[app.visaType || ""] || t.dashboard.notSelected}
                        </p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-[11px] text-gray-400 mb-0.5">Step</p>
                        <p className="text-xs text-gray-900">{app.currentStep} / 6</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-[11px] text-gray-400 mb-0.5">Documents</p>
                        <p className="text-xs text-gray-900">{docs.length} uploaded</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  {showTimeline && (
                    <div className="border-t border-gray-100 p-4 sm:p-6 bg-brand-50/30">
                      <h4 className="text-xs font-medium text-gray-500 mb-3">{t.statusTimeline.title}</h4>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full mt-1.5 bg-gray-400" />
                            {timeline.length > 0 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                          </div>
                          <div className="pb-1">
                            <p className="text-xs font-medium text-gray-900">{t.statusTimeline.created}</p>
                            <p className="text-[11px] text-gray-400">{formatDateTime(app.createdAt)}</p>
                          </div>
                        </div>

                        {[...timeline].reverse().map((entry, idx) => {
                          const isLast = idx === timeline.length - 1;
                          return (
                            <div key={entry.id} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div
                                  className="w-2 h-2 rounded-full mt-1.5"
                                  style={{
                                    backgroundColor:
                                      entry.newStatus === "approved" ? "#2d4a3e"
                                      : entry.newStatus === "rejected" ? "#be123c"
                                      : "#302a7e"
                                  }}
                                />
                                {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                              </div>
                              <div className="pb-1">
                                <p className="text-xs font-medium text-gray-900">
                                  {STATUS_STYLES[entry.newStatus]?.label || entry.newStatus}
                                </p>
                                {entry.note && (
                                  <p className="text-xs text-gray-500 mt-0.5">{entry.note}</p>
                                )}
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                  {formatDateTime(entry.createdAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        {timeline.length === 0 && (
                          <p className="text-xs text-gray-400 pl-5">{t.statusTimeline.noHistory}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50/50">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                        <div className="p-3 bg-white rounded-lg border border-gray-100">
                          <p className="text-[11px] text-gray-400 mb-0.5">{t.dashboard.created}</p>
                          <p className="text-sm text-gray-900">{formatDate(app.createdAt)}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-gray-100">
                          <p className="text-[11px] text-gray-400 mb-0.5">{t.dashboard.updated}</p>
                          <p className="text-sm text-gray-900">{formatDate(app.updatedAt)}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-gray-100">
                          <p className="text-[11px] text-gray-400 mb-0.5">{t.dashboard.status}</p>
                          <p className="text-sm text-gray-900">{statusInfo.label}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-gray-100">
                          <p className="text-[11px] text-gray-400 mb-0.5">{t.dashboard.visaType}</p>
                          <p className="text-sm text-gray-900 truncate">
                            {VISA_LABELS[app.visaType || ""] || t.dashboard.notSelected}
                          </p>
                        </div>
                      </div>

                      {docs.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-2">Uploaded Documents</h4>
                          <div className="space-y-2">
                            {docs.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100"
                              >
                                {isImageFile(doc.fileName) ? (
                                  <img
                                    src={doc.fileUrl}
                                    alt={doc.fileName}
                                    className="w-8 h-8 rounded object-cover flex-shrink-0 border border-gray-200"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-accent-100 text-accent-600 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs text-gray-900 truncate">{doc.fileName}</p>
                                  <div className="flex items-center gap-1.5">
                                    <p className="text-[11px] text-gray-400">{doc.documentType.replace(/_/g, " ")}</p>
                                    {doc.status !== "pending" && (
                                      <span className={`text-[11px] font-medium ${doc.status === "approved" ? "text-accent-600" : "text-rose-600"}`}>
                                        {doc.status}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-brand-600 hover:text-brand-700 font-medium flex-shrink-0"
                                >
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </StaggerChildren>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
