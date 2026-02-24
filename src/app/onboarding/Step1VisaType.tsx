"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { FormData } from "./page";

const visaTypes = [
  {
    id: "work_visa",
    title: "Work Visa",
    description: "Employment-based immigration with a job offer in Spain",
    icon: "💼",
    requirements: "Job offer, employer sponsorship, qualifications",
  },
  {
    id: "golden_visa",
    title: "Golden Visa",
    description: "Residency through significant investment in Spain",
    icon: "🏆",
    requirements: "Min. €500K real estate or €1M financial investment",
  },
  {
    id: "student_visa",
    title: "Student Visa",
    description: "Study at Spanish educational institutions",
    icon: "🎓",
    requirements: "University acceptance, financial proof, insurance",
  },
  {
    id: "digital_nomad",
    title: "Digital Nomad Visa",
    description: "Remote work for foreign companies from Spain",
    icon: "💻",
    requirements: "Remote employment/freelance, min. income proof",
  },
  {
    id: "family_reunification",
    title: "Family Reunification",
    description: "Join family members who are legal residents",
    icon: "👨‍👩‍👧‍👦",
    requirements: "Family member with legal residency, proof of relationship",
  },
  {
    id: "non_lucrative",
    title: "Non-Lucrative Visa",
    description: "Live in Spain with passive income or savings",
    icon: "🌴",
    requirements: "Sufficient passive income, health insurance, no work",
  },
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
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Select Your Visa Type
      </h2>
      <p className="text-gray-600 mb-8">
        Choose the visa category that best fits your situation. This will
        customize the rest of your application.
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {visaTypes.map((visa) => (
          <button
            key={visa.id}
            onClick={() => {
              setSelected(visa.id);
              setError("");
            }}
            className={`text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              selected === visa.id
                ? "border-orange-500 bg-orange-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="text-2xl mb-3">{visa.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{visa.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{visa.description}</p>
            <p className="text-xs text-gray-400">
              <span className="font-medium">Key requirements:</span>{" "}
              {visa.requirements}
            </p>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} loading={saving} size="lg">
          Continue
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
