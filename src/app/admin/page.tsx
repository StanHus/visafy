"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { VISA_LABELS, STATUS_CONFIG } from "@/lib/constants";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren from "@/components/animations/StaggerChildren";

interface DocInfo {
  id: string;
  fileName: string;
  fileUrl: string;
  documentType: string;
  status: string;
  rejectionReason: string | null;
  uploadedAt: string;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface AdminApp {
  id: string;
  userId: string;
  visaType: string | null;
  status: string;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  fields: Record<string, string>;
  documents: DocInfo[];
  payments: Payment[];
  user: { fullName: string; email: string } | null;
}

interface AdminNote {
  id: string;
  content: string;
  createdAt: string;
  adminName: string | null;
}

interface Stats {
  totalApplications: number;
  totalUsers: number;
  totalRevenue: number;
  totalPayments: number;
  byStatus: Record<string, number>;
  byVisaType: Record<string, number>;
}

const formatDate = (d: string) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? "\u2014" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatDateTime = (d: string) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? "\u2014" : date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

function isImageFile(fileName: string) {
  const ext = fileName.toLowerCase().split(".").pop();
  return ext === "jpg" || ext === "jpeg" || ext === "png";
}

export default function AdminPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [apps, setApps] = useState<AdminApp[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [visaTypeFilter, setVisaTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [statusHistory, setStatusHistory] = useState<Array<{
    id: string;
    oldStatus: string | null;
    newStatus: string;
    note: string | null;
    createdAt: string;
    changedByName: string | null;
  }>>([]);
  const [tab, setTab] = useState<"overview" | "applications">("overview");
  const [updating, setUpdating] = useState(false);

  const loadApps = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (visaTypeFilter !== "all") params.set("visaType", visaTypeFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/applications?${params}`);
      const data = await res.json();
      if (Array.isArray(data)) setApps(data);
    } catch (err) {
      console.error("Failed to load apps:", err);
    }
  }, [statusFilter, visaTypeFilter, search]);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  useEffect(() => {
    Promise.all([loadApps(), loadStats()]).finally(() => setLoading(false));
  }, [loadApps]);

  const loadNotes = async (appId: string) => {
    try {
      const res = await fetch(`/api/admin/notes?applicationId=${appId}`);
      const data = await res.json();
      if (Array.isArray(data)) setNotes(data);
    } catch {}
  };

  const loadHistory = async (appId: string) => {
    try {
      const res = await fetch(`/api/status-history?applicationId=${appId}`);
      const data = await res.json();
      if (Array.isArray(data)) setStatusHistory(data);
    } catch {}
  };

  const selectApp = (appId: string) => {
    setSelectedApp(appId);
    loadNotes(appId);
    loadHistory(appId);
  };

  const updateStatus = async (appId: string, status: string, note?: string) => {
    setUpdating(true);
    try {
      await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, status, note }),
      });
      await loadApps();
      await loadHistory(appId);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const reviewDocument = async (docId: string, status: "approved" | "rejected", reason?: string) => {
    try {
      await fetch("/api/admin/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId, status, rejectionReason: reason }),
      });
      await loadApps();
    } catch (err) {
      console.error("Failed to review document:", err);
    }
  };

  const addNote = async (appId: string) => {
    if (!newNote.trim()) return;
    try {
      await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, content: newNote.trim() }),
      });
      setNewNote("");
      await loadNotes(appId);
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  const selected = apps.find((a) => a.id === selectedApp);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-bold text-gray-900 tracking-tight">
              KORE
            </Link>
            <span className="text-xs px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full font-medium">
              {t.admin.badge}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              {t.nav.dashboard}
            </Link>
            <span className="text-sm text-gray-400">{session?.user?.email}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab("overview")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              tab === "overview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.admin.overview}
          </button>
          <button
            onClick={() => setTab("applications")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              tab === "applications" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.admin.applications}
          </button>
        </div>

        {/* Overview Tab */}
        {tab === "overview" && stats && (
          <FadeIn duration={300} direction="up">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label={t.admin.totalApps} value={stats.totalApplications} />
              <StatCard label={t.admin.totalUsers} value={stats.totalUsers} />
              <StatCard
                label={t.admin.revenue}
                value={`\u20AC${(stats.totalRevenue / 100).toLocaleString()}`}
              />
              <StatCard label={t.admin.paidApps} value={stats.totalPayments} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* By Status */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-medium text-gray-900 mb-4">{t.admin.byStatus}</h3>
                <div className="space-y-3">
                  {Object.entries(stats.byStatus).map(([status, count]) => {
                    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}>
                          {cfg.label}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* By Visa Type */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-medium text-gray-900 mb-4">{t.admin.byVisaType}</h3>
                <div className="space-y-3">
                  {Object.entries(stats.byVisaType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{VISA_LABELS[type] || type}</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Applications Tab */}
        {tab === "applications" && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* List */}
            <div className={`${selectedApp ? "lg:w-1/2 xl:w-2/5" : "w-full"} space-y-4`}>
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder={t.admin.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 min-w-0 flex-1"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white cursor-pointer"
                >
                  <option value="all">{t.admin.allStatuses}</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="additional_info_needed">Info Needed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={visaTypeFilter}
                  onChange={(e) => setVisaTypeFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white cursor-pointer"
                >
                  <option value="all">{t.admin.allVisaTypes}</option>
                  {Object.entries(VISA_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* App list */}
              <div className="text-xs text-gray-400 mb-2">
                {apps.length} {t.admin.applicationsFound}
              </div>

              <StaggerChildren staggerMs={40} duration={300} direction="up" className="space-y-2">
                {apps.map((app) => {
                  const statusInfo = STATUS_CONFIG[app.status] || STATUS_CONFIG.draft;
                  const isSelected = selectedApp === app.id;
                  return (
                    <button
                      key={app.id}
                      onClick={() => selectApp(app.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-brand-600 bg-brand-50/50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {app.user?.fullName || "Unknown"}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusInfo.color} ${statusInfo.bg}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{VISA_LABELS[app.visaType || ""] || "N/A"}</span>
                        <span>&middot;</span>
                        <span>{app.user?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span>{formatDate(app.createdAt)}</span>
                        <span>&middot;</span>
                        <span>{app.documents.length} docs</span>
                        <span>&middot;</span>
                        <span>Step {app.currentStep}/6</span>
                      </div>
                    </button>
                  );
                })}
              </StaggerChildren>
            </div>

            {/* Detail Panel */}
            {selected && (
              <div className="lg:w-1/2 xl:w-3/5 space-y-4">
                <FadeIn duration={250} direction="up">
                  {/* Applicant info */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold text-gray-900">{selected.user?.fullName}</h2>
                        <p className="text-xs text-gray-400">{selected.user?.email} &middot; ID: {selected.id.slice(0, 8)}</p>
                      </div>
                      <button
                        onClick={() => setSelectedApp(null)}
                        className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {t.admin.close}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <InfoBox label={t.admin.visaType} value={VISA_LABELS[selected.visaType || ""] || "N/A"} />
                      <InfoBox label={t.admin.status} value={STATUS_CONFIG[selected.status]?.label || selected.status} />
                      <InfoBox label={t.admin.step} value={`${selected.currentStep} / 6`} />
                      <InfoBox label={t.admin.created} value={formatDate(selected.createdAt)} />
                    </div>

                    {/* Status Actions */}
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">{t.admin.changeStatus}</p>
                      <div className="flex flex-wrap gap-2">
                        {["under_review", "additional_info_needed", "approved", "rejected"].map((s) => {
                          const cfg = STATUS_CONFIG[s] || STATUS_CONFIG.draft;
                          const isCurrent = selected.status === s;
                          return (
                            <button
                              key={s}
                              disabled={isCurrent || updating}
                              onClick={() => {
                                const note = prompt(t.admin.notePrompt);
                                updateStatus(selected.id, s, note || undefined);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                isCurrent
                                  ? `${cfg.bg} ${cfg.color} border-current`
                                  : "border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              {cfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Application Fields */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">{t.admin.applicationData}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selected.fields).map(([key, value]) => (
                        <div key={key} className="p-2 bg-gray-50 rounded-lg">
                          <p className="text-[11px] text-gray-400 mb-0.5">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                          <p className="text-xs text-gray-900 truncate">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      {t.admin.documents} ({selected.documents.length})
                    </h3>
                    <div className="space-y-2">
                      {selected.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          {isImageFile(doc.fileName) ? (
                            <img src={doc.fileUrl} alt={doc.fileName} className="w-10 h-10 rounded object-cover border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-accent-100 text-accent-600 flex items-center justify-center">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-900 truncate">{doc.fileName}</p>
                            <p className="text-[11px] text-gray-400">
                              {doc.documentType.replace(/_/g, " ")} &middot; {doc.status}
                              {doc.rejectionReason && ` — ${doc.rejectionReason}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                              View
                            </a>
                            {doc.status === "pending" && (
                              <>
                                <button
                                  onClick={() => reviewDocument(doc.id, "approved")}
                                  className="text-xs text-accent-600 hover:text-accent-700 font-medium cursor-pointer"
                                >
                                  {t.admin.approve}
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt(t.admin.rejectionReasonPrompt);
                                    if (reason !== null) reviewDocument(doc.id, "rejected", reason);
                                  }}
                                  className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                                >
                                  {t.admin.reject}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                      {selected.documents.length === 0 && (
                        <p className="text-xs text-gray-400 py-2">{t.admin.noDocs}</p>
                      )}
                    </div>
                  </div>

                  {/* Status History */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">{t.admin.statusTimeline}</h3>
                    <div className="space-y-3">
                      {statusHistory.map((entry) => {
                        const cfg = STATUS_CONFIG[entry.newStatus] || STATUS_CONFIG.draft;
                        return (
                          <div key={entry.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${cfg.bg.replace("bg-", "bg-")}`} style={{ backgroundColor: entry.newStatus === "approved" ? "#2d4a3e" : entry.newStatus === "rejected" ? "#be123c" : "#302a7e" }} />
                              <div className="w-px flex-1 bg-gray-100 mt-1" />
                            </div>
                            <div className="pb-3">
                              <p className="text-xs font-medium text-gray-900">
                                {entry.oldStatus ? `${STATUS_CONFIG[entry.oldStatus]?.label || entry.oldStatus} \u2192 ` : ""}
                                {cfg.label}
                              </p>
                              {entry.note && <p className="text-xs text-gray-500 mt-0.5">{entry.note}</p>}
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {formatDateTime(entry.createdAt)}
                                {entry.changedByName && ` by ${entry.changedByName}`}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {statusHistory.length === 0 && (
                        <p className="text-xs text-gray-400">{t.admin.noHistory}</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">{t.admin.notes}</h3>
                    <div className="space-y-2 mb-3">
                      {notes.map((note) => (
                        <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-900">{note.content}</p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {note.adminName || "Admin"} &middot; {formatDateTime(note.createdAt)}
                          </p>
                        </div>
                      ))}
                      {notes.length === 0 && (
                        <p className="text-xs text-gray-400">{t.admin.noNotes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addNote(selected.id)}
                        placeholder={t.admin.addNotePlaceholder}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
                      />
                      <Button size="sm" onClick={() => addNote(selected.id)} loading={false}>
                        {t.admin.addNote}
                      </Button>
                    </div>
                  </div>
                </FadeIn>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 bg-gray-50 rounded-lg">
      <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
      <p className="text-xs text-gray-900 font-medium truncate">{value}</p>
    </div>
  );
}
