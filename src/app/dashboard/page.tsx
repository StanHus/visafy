"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { VISA_LABELS, STATUS_CONFIG } from "@/lib/constants";

interface Application {
  id: string;
  visaType: string | null;
  status: string;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  fields: Record<string, string>;
}

const timelineSteps = [
  { status: "draft", label: "Application Started" },
  { status: "submitted", label: "Application Submitted" },
  { status: "under_review", label: "Under Review" },
  { status: "approved", label: "Decision Made" },
];

const formatDate = (d: string) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? "\u2014" : date.toLocaleDateString();
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const app = applications[0];
  const statusInfo = app ? STATUS_CONFIG[app.status] || STATUS_CONFIG.draft : null;

  const getTimelineStatus = (stepStatus: string) => {
    const statusOrder = ["draft", "submitted", "under_review", "approved"];
    const currentIdx = statusOrder.indexOf(app?.status || "draft");
    const stepIdx = statusOrder.indexOf(stepStatus);
    if (stepIdx < currentIdx) return "completed";
    if (stepIdx === currentIdx) return "current";
    return "upcoming";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-gray-900 tracking-tight">
            KORE
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500 mb-8">
          Welcome back, {session?.user?.name || "there"}.
        </p>

        {!app ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <h3 className="text-base font-medium text-gray-900 mb-2">
              No application yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Start your immigration journey by creating a new visa application.
            </p>
            <Link href="/onboarding">
              <Button>Start Application</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-base font-medium text-gray-900">
                      {VISA_LABELS[app.visaType || ""] || "Visa Application"}
                    </h2>
                    {statusInfo && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bg}`}
                      >
                        {statusInfo.label}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    ID: {app.id.slice(0, 8)}
                  </p>
                </div>
                {app.status === "draft" && (
                  <Link href="/onboarding">
                    <Button size="sm">Continue Application</Button>
                  </Link>
                )}
              </div>

              {/* Progress */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-gray-900 font-medium">
                    Step {app.currentStep} of 6
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(app.currentStep / 6) * 100}%` }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[11px] text-gray-400 mb-0.5">Created</p>
                  <p className="text-sm text-gray-900">{formatDate(app.createdAt)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[11px] text-gray-400 mb-0.5">Updated</p>
                  <p className="text-sm text-gray-900">{formatDate(app.updatedAt)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[11px] text-gray-400 mb-0.5">Visa Type</p>
                  <p className="text-sm text-gray-900">
                    {VISA_LABELS[app.visaType || ""] || "Not selected"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[11px] text-gray-400 mb-0.5">Status</p>
                  <p className="text-sm text-gray-900">{statusInfo?.label || "Draft"}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-5">
                Timeline
              </h3>
              <div className="space-y-0">
                {timelineSteps.map((step, idx) => {
                  const status = getTimelineStatus(step.status);
                  return (
                    <div key={step.status} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            status === "completed"
                              ? "bg-indigo-600 text-white"
                              : status === "current"
                              ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                              : "bg-gray-100 text-gray-300"
                          }`}
                        >
                          {status === "completed" ? (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                status === "current" ? "bg-white" : "bg-gray-300"
                              }`}
                            />
                          )}
                        </div>
                        {idx < timelineSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-10 ${
                              status === "completed" ? "bg-indigo-600" : "bg-gray-100"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-10 last:pb-0">
                        <p
                          className={`text-sm ${
                            status === "upcoming" ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {step.label}
                        </p>
                        {status === "current" && (
                          <p className="text-xs text-indigo-600 mt-0.5">Current</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
