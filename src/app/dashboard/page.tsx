"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
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

function isImageFile(fileName: string) {
  const ext = fileName.toLowerCase().split(".").pop();
  return ext === "jpg" || ext === "jpeg" || ext === "png";
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

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
                      <div className="flex items-center gap-2">
                        {app.status === "draft" && (
                          <Link href={`/onboarding?id=${app.id}`}>
                            <Button size="sm">{t.dashboard.continueApp}</Button>
                          </Link>
                        )}
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

                      {/* Documents list */}
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
                                  <p className="text-[11px] text-gray-400">{doc.documentType.replace(/_/g, " ")}</p>
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
