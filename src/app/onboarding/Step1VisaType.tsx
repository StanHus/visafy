"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n-context";
import type { FormData } from "./page";

const visaTypeIds = [
  "work_visa",
  "golden_visa",
  "student_visa",
  "digital_nomad",
  "family_reunification",
  "non_lucrative",
] as const;

interface Props {
  formData: FormData;
  onNext: (fields: FormData) => void;
  saving: boolean;
}

export default function Step1VisaType({ formData, onNext, saving }: Props) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(formData.visaType || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!selected) {
      setError(t.onboarding.step1Error);
      return;
    }
    setError("");
    onNext({ visaType: selected });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        {t.onboarding.step1Title}
      </h2>
      <p className="text-sm text-gray-500 mb-6 sm:mb-8">
        {t.onboarding.step1Subtitle}
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-3 mb-8">
        {visaTypeIds.map((id) => {
          const visa = t.onboarding.visaTypes[id];
          return (
            <button
              key={id}
              onClick={() => {
                setSelected(id);
                setError("");
              }}
              className={`w-full text-left px-4 sm:px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer min-h-[56px] ${
                selected === id
                  ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selected === id ? "border-indigo-600" : "border-gray-300"
                  }`}
                >
                  {selected === id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{visa.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{visa.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end md:static fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:border-0 md:p-0 md:bg-transparent">
        <Button onClick={handleNext} loading={saving} className="w-full md:w-auto">
          {t.onboarding.continue}
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
