"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface Application {
  id: string;
  visaType: string | null;
  status: string;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  fields: Record<string, string>;
}

const visaLabels: Record<string, string> = {
  work_visa: "Work Visa",
  golden_visa: "Golden Visa",
  student_visa: "Student Visa",
  digital_nomad: "Digital Nomad Visa",
  family_reunification: "Family Reunification",
  non_lucrative: "Non-Lucrative Visa",
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-gray-700", bg: "bg-gray-100" },
  submitted: { label: "Submitted", color: "text-blue-700", bg: "bg-blue-100" },
  under_review: { label: "Under Review", color: "text-yellow-700", bg: "bg-yellow-100" },
  additional_info_needed: { label: "Info Needed", color: "text-orange-700", bg: "bg-orange-100" },
  approved: { label: "Approved", color: "text-green-700", bg: "bg-green-100" },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-100" },
};

const timelineSteps = [
  { status: "draft", label: "Application Started" },
  { status: "submitted", label: "Application Submitted" },
  { status: "under_review", label: "Under Review" },
  { status: "approved", label: "Decision Made" },
];

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
  const statusInfo = app ? statusConfig[app.status] || statusConfig.draft : null;

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Visafy</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Welcome back, {session?.user?.name || "there"}. Here&apos;s your
          application overview.
        </p>

        {!app ? (
          /* No application yet */
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-8 h-8 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Application Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start your immigration journey by creating a new visa application.
              Our guided process makes it simple.
            </p>
            <Link href="/onboarding">
              <Button size="lg">Start Application</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Application Overview Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {visaLabels[app.visaType || ""] || "Visa Application"}
                      </h2>
                      {statusInfo && (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bg}`}
                        >
                          {statusInfo.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Application ID: {app.id.slice(0, 8)}...
                    </p>
                  </div>
                  {app.status === "draft" && (
                    <Link href="/onboarding">
                      <Button>Continue Application</Button>
                    </Link>
                  )}
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Application Progress</span>
                    <span className="font-medium text-gray-900">
                      Step {app.currentStep} of 6
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(app.currentStep / 6) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Created</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(app.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Visa Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {visaLabels[app.visaType || ""] || "Not selected"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className="text-sm font-medium text-gray-900">
                      {statusInfo?.label || "Draft"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Application Timeline
              </h3>
              <div className="space-y-0">
                {timelineSteps.map((step, idx) => {
                  const status = getTimelineStatus(step.status);
                  return (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            status === "completed"
                              ? "bg-orange-500 text-white"
                              : status === "current"
                              ? "bg-orange-500 text-white ring-4 ring-orange-100"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {status === "completed" ? (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <div
                              className={`w-2 h-2 rounded-full ${
                                status === "current"
                                  ? "bg-white"
                                  : "bg-gray-400"
                              }`}
                            />
                          )}
                        </div>
                        {idx < timelineSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              status === "completed"
                                ? "bg-orange-500"
                                : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-12 last:pb-0">
                        <p
                          className={`text-sm font-medium ${
                            status === "upcoming"
                              ? "text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          {step.label}
                        </p>
                        {status === "current" && (
                          <p className="text-xs text-orange-500 mt-0.5">
                            Current stage
                          </p>
                        )}
                        {status === "completed" && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Completed
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notifications
              </h3>
              {app.status === "additional_info_needed" ? (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-orange-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-orange-800">
                        Additional Information Required
                      </p>
                      <p className="text-sm text-orange-700 mt-1">
                        Our team needs more information to process your
                        application. Please check your email for details.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">
                    No new notifications. We&apos;ll notify you when there are
                    updates to your application.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
