"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLanguage } from "@/lib/i18n-context";
import type { FormData } from "./page";

interface Props {
  formData: FormData;
  onNext: (fields: FormData) => void;
  onBack: () => void;
  saving: boolean;
}

const visaFieldKeys: Record<string, string[]> = {
  work_visa: ["employerName", "employerAddress", "jobTitle", "contractStartDate", "contractEndDate", "annualSalary"],
  golden_visa: ["investmentType", "investmentAmount", "investmentDescription", "investmentLocation"],
  student_visa: ["universityName", "programName", "programDuration", "programStartDate", "enrollmentStatus"],
  digital_nomad: ["workType", "companyName", "companyCountry", "monthlyIncome", "remoteWorkDescription"],
  family_reunification: ["sponsorName", "sponsorRelationship", "sponsorResidencePermit", "sponsorAddress"],
  non_lucrative: ["incomeSource", "monthlyAmount", "savingsAmount", "plannedResidence"],
};

export default function Step3VisaDetails({
  formData,
  onNext,
  onBack,
  saving,
}: Props) {
  const { t } = useLanguage();
  const visaType = formData.visaType || "work_visa";
  const fieldKeys = visaFieldKeys[visaType] || visaFieldKeys.work_visa;

  const vf = t.onboarding.visaFields;
  const visaLabel = t.onboarding.visaTypes[visaType as keyof typeof t.onboarding.visaTypes]?.title || visaType;

  const initialValues: Record<string, string> = {};
  fieldKeys.forEach((key) => {
    initialValues[key] = formData[key] || "";
  });

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getFieldInfo = (key: string) => {
    const info = vf[key as keyof typeof vf];
    return info || { label: key, placeholder: "" };
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    fieldKeys.forEach((key) => {
      if (!values[key]?.trim()) {
        const info = getFieldInfo(key);
        errs[key] = t.validation.required.replace("{field}", info.label);
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext(values);
    }
  };

  const updateField = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        {visaLabel} {t.onboarding.step3Title}
      </h2>
      <p className="text-sm text-gray-500 mb-6 sm:mb-8">
        {t.onboarding.step3Subtitle}
      </p>

      <div className="space-y-5">
        {fieldKeys.map((key) => {
          const info = getFieldInfo(key);
          return (
            <Input
              key={key}
              id={key}
              label={info.label}
              type={key.includes("Date") ? "date" : "text"}
              placeholder={info.placeholder}
              value={values[key]}
              onChange={(e) => updateField(key, e.target.value)}
              error={errors[key]}
            />
          );
        })}
      </div>

      <div className="flex justify-between gap-3 mt-8 md:static fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:border-0 md:p-0 md:bg-transparent">
        <Button variant="outline" onClick={onBack}>
          {t.onboarding.back}
        </Button>
        <Button onClick={handleNext} loading={saving}>
          {t.onboarding.continue}
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
