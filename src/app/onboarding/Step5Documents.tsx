"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";
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

const requiredDocsByVisa: Record<string, { type: string; label: string }[]> = {
  work_visa: [
    { type: "passport", label: "Passport Copy" },
    { type: "photo", label: "Passport Photo" },
    { type: "employment_contract", label: "Employment Contract" },
    { type: "criminal_record", label: "Criminal Record Certificate" },
    { type: "health_insurance", label: "Health Insurance" },
  ],
  golden_visa: [
    { type: "passport", label: "Passport Copy" },
    { type: "photo", label: "Passport Photo" },
    { type: "proof_of_income", label: "Proof of Investment" },
    { type: "bank_statement", label: "Bank Statement" },
    { type: "criminal_record", label: "Criminal Record Certificate" },
    { type: "health_insurance", label: "Health Insurance" },
  ],
  student_visa: [
    { type: "passport", label: "Passport Copy" },
    { type: "photo", label: "Passport Photo" },
    { type: "bank_statement", label: "Bank Statement" },
    { type: "health_insurance", label: "Health Insurance" },
    { type: "accommodation_proof", label: "Accommodation Proof" },
  ],
  digital_nomad: [
    { type: "passport", label: "Passport Copy" },
    { type: "photo", label: "Passport Photo" },
    { type: "proof_of_income", label: "Proof of Remote Income" },
    { type: "employment_contract", label: "Employment/Client Contract" },
    { type: "health_insurance", label: "Health Insurance" },
    { type: "criminal_record", label: "Criminal Record Certificate" },
  ],
  family_reunification: [
    { type: "passport", label: "Passport Copy" },
    { type: "photo", label: "Passport Photo" },
    { type: "proof_of_income", label: "Sponsor's Income Proof" },
    { type: "accommodation_proof", label: "Accommodation Proof" },
    { type: "criminal_record", label: "Criminal Record Certificate" },
    { type: "health_insurance", label: "Health Insurance" },
  ],
  non_lucrative: [
    { type: "passport", label: "Passport Copy" },
    { type: "photo", label: "Passport Photo" },
    { type: "bank_statement", label: "Bank Statement (12 months)" },
    { type: "proof_of_income", label: "Proof of Income/Funds" },
    { type: "health_insurance", label: "Health Insurance" },
    { type: "criminal_record", label: "Criminal Record Certificate" },
    { type: "accommodation_proof", label: "Accommodation Proof" },
  ],
};

export default function Step5Documents({
  formData,
  applicationId,
  uploadedDocs,
  setUploadedDocs,
  onNext,
  onBack,
  saving,
}: Props) {
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentDocType, setCurrentDocType] = useState("");

  const visaType = formData.visaType || "work_visa";
  const requiredDocs = requiredDocsByVisa[visaType] || requiredDocsByVisa.work_visa;

  const handleUpload = async (file: File, docType: string) => {
    if (!applicationId) {
      setError("Application not found. Please go back and try again.");
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
        setError(data.error || "Upload failed");
        return;
      }

      setUploadedDocs((prev: UploadedDoc[]) => [
        ...prev.filter((d) => d.documentType !== docType),
        data.document,
      ]);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(null);
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
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Document Upload
      </h2>
      <p className="text-gray-600 mb-8">
        Upload the required documents for your application. You can upload
        PDF, JPG, or PNG files up to 10MB each.
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

      <div className="space-y-3">
        {requiredDocs.map((doc) => {
          const uploaded = getDocStatus(doc.type);
          const isUploading = uploading === doc.type;

          return (
            <div
              key={doc.type}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                uploaded
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    uploaded
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {uploaded ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {doc.label}
                  </p>
                  {uploaded && (
                    <p className="text-xs text-green-600">
                      {uploaded.fileName}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => triggerUpload(doc.type)}
                disabled={isUploading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  uploaded
                    ? "text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400"
                    : "text-orange-500 hover:text-orange-600 border border-orange-300 hover:border-orange-400"
                } disabled:opacity-50`}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </span>
                ) : uploaded ? (
                  "Replace"
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {uploadedDocs.length} of {requiredDocs.length} documents uploaded.
        You can continue and upload remaining documents later.
      </p>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button onClick={handleNext} loading={saving} size="lg">
          Continue to Review
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
