"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { FormData } from "./page";

const visaTypes = [
  { id: "work_visa", title: "Work Visa", description: "Employment-based immigration with a job offer in Spain" },
  { id: "golden_visa", title: "Golden Visa", description: "Residency through significant investment in Spain" },
  { id: "student_visa", title: "Student Visa", description: "Study at Spanish educational institutions" },
  { id: "digital_nomad", title: "Digital Nomad Visa", description: "Remote work for foreign companies from Spain" },
  { id: "family_reunification", title: "Family Reunification", description: "Join family members who are legal residents" },
  { id: "non_lucrative", title: "Non-Lucrative Visa", description: "Live in Spain with passive income or savings" },
];

interface Props {
  formData: FormData;
  onNext: (fields: FormData) => void;
  saving: boolean;
}

export default function Step1VisaType({ formData, onNext, saving }: Props) {
  const [selected, setSelected] = useState(formData.visaType || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!selected) {
      setError("Please select a visa type to continue");
      return;
    }
    setError("");
    onNext({ visaType: selected });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Select your visa type
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Choose the visa category that fits your situation.
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-3 mb-8">
        {visaTypes.map((visa) => (
          <button
            key={visa.id}
            onClick={() => {
              setSelected(visa.id);
              setError("");
            }}
            className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${
              selected === visa.id
                ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selected === visa.id
                    ? "border-indigo-600"
                    : "border-gray-300"
                }`}
              >
                {selected === visa.id && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{visa.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{visa.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} loading={saving}>
          Continue
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
