"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { FormData, UploadedDoc } from "./page";

interface Props {
  formData: FormData;
  uploadedDocs: UploadedDoc[];
  onBack: () => void;
  onSubmit: () => void;
  saving: boolean;
}

const visaLabels: Record<string, string> = {
  work_visa: "Work Visa",
  golden_visa: "Golden Visa",
  student_visa: "Student Visa",
  digital_nomad: "Digital Nomad Visa",
  family_reunification: "Family Reunification",
  non_lucrative: "Non-Lucrative Visa",
};

const fundSourceLabels: Record<string, string> = {
  employment: "Employment / Salary",
  self_employment: "Self-Employment / Business",
  investments: "Investments / Dividends",
  savings: "Savings",
  pension: "Pension / Retirement",
  family_support: "Family Support",
  other: "Other",
};

export default function Step6Review({
  formData,
  uploadedDocs,
  onBack,
  onSubmit,
  saving,
}: Props) {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!agreed) {
      setError("Please agree to the terms and conditions to submit");
      return;
    }
    setError("");
    onSubmit();
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 sm:w-48 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value || "—"}</span>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Review & Submit
      </h2>
      <p className="text-gray-600 mb-8">
        Please review all the information below before submitting your
        application.
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <Section title="Visa Type">
        <Field label="Selected Visa" value={visaLabels[formData.visaType] || formData.visaType} />
      </Section>

      <Section title="Personal Information">
        <Field label="Full Name" value={formData.fullName} />
        <Field label="Date of Birth" value={formData.dateOfBirth} />
        <Field label="Nationality" value={formData.nationality} />
        <Field label="Passport Number" value={formData.passportNumber} />
        <Field label="Passport Expiry" value={formData.passportExpiry} />
        <Field label="Phone" value={formData.phone} />
        <Field label="Email" value={formData.email} />
        <Field label="Country" value={formData.country} />
        <Field label="City" value={formData.city} />
      </Section>

      <Section title="Financial Information">
        <Field label="Annual Income" value={formData.annualIncome ? `€${formData.annualIncome}` : ""} />
        <Field
          label="Monthly Income"
          value={formData.monthlyIncome ? `€${formData.monthlyIncome}` : ""}
        />
        <Field label="Bank Name" value={formData.bankName} />
        <Field label="Bank Country" value={formData.bankAccountCountry} />
        <Field
          label="Source of Funds"
          value={fundSourceLabels[formData.sourceOfFunds] || formData.sourceOfFunds}
        />
      </Section>

      <Section title="Documents">
        {uploadedDocs.length === 0 ? (
          <p className="text-sm text-gray-500">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {uploadedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
              >
                <div className="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {doc.fileName}
                  </p>
                  <p className="text-xs text-gray-500">{doc.documentType.replace(/_/g, " ")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Terms */}
      <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked) setError("");
            }}
            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            I confirm that all the information provided is accurate and complete.
            I understand that providing false information may result in my
            application being rejected. I agree to the{" "}
            <span className="text-orange-500 font-medium">Terms of Service</span>{" "}
            and{" "}
            <span className="text-orange-500 font-medium">Privacy Policy</span>.
          </span>
        </label>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button onClick={handleSubmit} loading={saving} size="lg">
          Submit Application
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
