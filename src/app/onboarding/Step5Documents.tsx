"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n-context";
import type { FormData, UploadedDoc } from "./page";

interface Props {
  formData: FormData;
  applicationId: string | null;
  uploadedDocs: UploadedDoc[];
  setUploadedDocs: (docs: UploadedDoc[] | ((prev: UploadedDoc[]) => UploadedDoc[])) => void;
  onNext: (fields: FormData) => void;
  onBack: () => void;
  saving: boolean;
}

const requiredDocsByVisa: Record<string, string[]> = {
  work_visa: ["passport", "photo", "employment_contract", "criminal_record", "health_insurance"],
  golden_visa: ["passport", "photo", "proof_of_income", "bank_statement", "criminal_record", "health_insurance"],
  student_visa: ["passport", "photo", "bank_statement", "health_insurance", "accommodation_proof"],
  digital_nomad: ["passport", "photo", "proof_of_income", "employment_contract", "health_insurance", "criminal_record"],
  family_reunification: ["passport", "photo", "proof_of_income", "accommodation_proof", "criminal_record", "health_insurance"],
  non_lucrative: ["passport", "photo", "bank_statement", "proof_of_income", "health_insurance", "criminal_record", "accommodation_proof"],
};

function isImageFile(fileName: string) {
  const ext = fileName.toLowerCase().split(".").pop();
  return ext === "jpg" || ext === "jpeg" || ext === "png";
}

export default function Step5Documents({
  formData,
  applicationId,
  uploadedDocs,
  setUploadedDocs,
  onNext,
  onBack,
  saving,
}: Props) {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentDocType, setCurrentDocType] = useState("");

  const visaType = formData.visaType || "work_visa";
  const docKeys = requiredDocsByVisa[visaType] || requiredDocsByVisa.work_visa;
  const dl = t.onboarding.docLabels;

  const getDocLabel = (type: string) => {
    return dl[type as keyof typeof dl] || type.replace(/_/g, " ");
  };

  const handleUpload = async (file: File, docType: string) => {
    if (!applicationId) {
      setError(t.onboarding.step5Error);
      return;
    }

    setUploading(docType);
    setError("");

    try {
      const form = new window.FormData();
      form.append("file", file);
      form.append("applicationId", applicationId);
      form.append("documentType", docType);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.onboarding.uploadFailed);
        return;
      }

      setUploadedDocs((prev: UploadedDoc[]) => [
        ...prev.filter((d) => d.documentType !== docType),
        data.document,
      ]);
    } catch {
      setError(t.onboarding.uploadFailed);
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (docId: string, docType: string) => {
    if (!applicationId) return;
    setDeleting(docId);
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId, applicationId }),
      });
      if (res.ok) {
        setUploadedDocs((prev: UploadedDoc[]) => prev.filter((d) => d.id !== docId));
      } else {
        const data = await res.json();
        setError(data.error || "Failed to remove document");
      }
    } catch {
      setError("Failed to remove document");
    } finally {
      setDeleting(null);
    }
  };

  const triggerUpload = (docType: string) => {
    setCurrentDocType(docType);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentDocType) {
      handleUpload(file, currentDocType);
    }
    e.target.value = "";
  };

  const getDocStatus = (docType: string) => {
    return uploadedDocs.find((d) => d.documentType === docType);
  };

  const handleNext = () => {
    onNext({ documentsUploaded: String(uploadedDocs.length) });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        {t.onboarding.step5Title}
      </h2>
      <p className="text-sm text-gray-500 mb-6 sm:mb-8">
        {t.onboarding.step5Subtitle}
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
      />

      <div className="space-y-2">
        {docKeys.map((docType) => {
          const uploaded = getDocStatus(docType);
          const isUploading = uploading === docType;

          return (
            <div
              key={docType}
              className={`p-3 sm:p-4 rounded-xl border transition-all ${
                uploaded
                  ? "border-accent-200 bg-accent-50/50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Thumbnail or icon */}
                  {uploaded && isImageFile(uploaded.fileName) ? (
                    <img
                      src={uploaded.fileUrl}
                      alt={uploaded.fileName}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        uploaded
                          ? "bg-accent-100 text-accent-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {uploaded ? (
                        uploaded.fileName.toLowerCase().endsWith(".pdf") ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{getDocLabel(docType)}</p>
                    {uploaded && (
                      <p className="text-xs text-accent-600 truncate">{uploaded.fileName}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                  {uploaded && (
                    <>
                      <a
                        href={uploaded.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 transition-all min-h-[32px] inline-flex items-center"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(uploaded.id, docType)}
                        disabled={deleting === uploaded.id}
                        className="px-2 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 transition-all cursor-pointer min-h-[32px] disabled:opacity-50"
                      >
                        {deleting === uploaded.id ? "..." : "Remove"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => triggerUpload(docType)}
                    disabled={isUploading}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer min-h-[32px] ${
                      uploaded
                        ? "text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300"
                        : "text-brand-600 hover:text-brand-700 border border-brand-200 hover:border-brand-300"
                    } disabled:opacity-50`}
                  >
                    {isUploading ? (
                      <span className="flex items-center gap-1.5">
                        <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t.onboarding.uploading}
                      </span>
                    ) : uploaded ? (
                      t.onboarding.replace
                    ) : (
                      t.onboarding.upload
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-gray-400">
        {uploadedDocs.length} / {docKeys.length} {t.onboarding.docsUploaded}{" "}
        {t.onboarding.docsNote}
      </p>

      <div className="flex justify-between gap-3 mt-8 md:static fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:border-0 md:p-0 md:bg-transparent">
        <Button variant="outline" onClick={onBack}>
          {t.onboarding.back}
        </Button>
        <Button onClick={handleNext} loading={saving}>
          {t.onboarding.continueToReview}
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
