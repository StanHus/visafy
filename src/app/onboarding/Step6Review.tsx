"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { VISA_LABELS, FUND_SOURCE_LABELS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n-context";
import type { FormData, UploadedDoc } from "./page";

interface Props {
  formData: FormData;
  uploadedDocs: UploadedDoc[];
  onBack: () => void;
  onSubmit: () => void;
  saving: boolean;
}

function isImageFile(fileName: string) {
  const ext = fileName.toLowerCase().split(".").pop();
  return ext === "jpg" || ext === "jpeg" || ext === "png";
}

export default function Step6Review({
  formData,
  uploadedDocs,
  onBack,
  onSubmit,
  saving,
}: Props) {
  const { t } = useLanguage();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!agreed) {
      setError(t.onboarding.step6Error);
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
      <div className="bg-gray-50 px-4 sm:px-5 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      </div>
      <div className="px-4 sm:px-5 py-4">{children}</div>
    </div>
  );

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500 sm:w-44 shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{value || "\u2014"}</span>
    </div>
  );

  const pf = t.onboarding.fields;
  const ff = t.onboarding.step4Fields;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        {t.onboarding.step6Title}
      </h2>
      <p className="text-sm text-gray-500 mb-6 sm:mb-8">
        {t.onboarding.step6Subtitle}
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <Section title={t.onboarding.sectionVisaType}>
        <Field label={t.onboarding.selectedVisa} value={VISA_LABELS[formData.visaType] || formData.visaType} />
      </Section>

      <Section title={t.onboarding.sectionPersonal}>
        <Field label={pf.fullName.label} value={formData.fullName} />
        <Field label={pf.dateOfBirth.label} value={formData.dateOfBirth} />
        <Field label={pf.nationality.label} value={formData.nationality} />
        <Field label={pf.passportNumber.label} value={formData.passportNumber} />
        <Field label={pf.passportExpiry.label} value={formData.passportExpiry} />
        <Field label={pf.phone.label} value={formData.phone} />
        <Field label={pf.email.label} value={formData.email} />
        <Field label={pf.country.label} value={formData.country} />
        <Field label={pf.city.label} value={formData.city} />
      </Section>

      <Section title={t.onboarding.sectionFinancial}>
        <Field label={ff.annualIncome.label} value={formData.annualIncome ? `\u20AC${formData.annualIncome}` : ""} />
        <Field label={ff.monthlyIncome.label} value={formData.monthlyIncome ? `\u20AC${formData.monthlyIncome}` : ""} />
        <Field label={ff.bankName.label} value={formData.bankName} />
        <Field label={ff.bankAccountCountry.label} value={formData.bankAccountCountry} />
        <Field label={ff.sourceOfFunds.label} value={FUND_SOURCE_LABELS[formData.sourceOfFunds] || formData.sourceOfFunds} />
      </Section>

      <Section title={t.onboarding.sectionDocuments}>
        {uploadedDocs.length === 0 ? (
          <p className="text-sm text-gray-400">{t.onboarding.noDocuments}</p>
        ) : (
          <div className="space-y-3">
            {uploadedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
              >
                {isImageFile(doc.fileName) ? (
                  <img
                    src={doc.fileUrl}
                    alt={doc.fileName}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900 truncate">{doc.fileName}</p>
                  <p className="text-xs text-gray-400">{doc.documentType.replace(/_/g, " ")}</p>
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
        )}
      </Section>

      {/* Terms */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked) setError("");
            }}
            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer accent-[#302a7e]"
          />
          <span className="text-xs text-gray-500 leading-relaxed">
            {t.onboarding.termsConfirm}{" "}
            <span className="text-brand-600 font-medium">{t.onboarding.termsOfService}</span>{" "}
            {t.onboarding.and}{" "}
            <span className="text-brand-600 font-medium">{t.onboarding.privacyPolicy}</span>.
          </span>
        </label>
      </div>

      <div className="flex justify-between gap-3 mt-8 md:static fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:border-0 md:p-0 md:bg-transparent">
        <Button variant="outline" onClick={onBack}>
          {t.onboarding.back}
        </Button>
        <Button onClick={handleSubmit} loading={saving}>
          {t.onboarding.submitApplication}
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
