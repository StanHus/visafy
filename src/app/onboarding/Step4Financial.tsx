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

export default function Step4Financial({
  formData,
  onNext,
  onBack,
  saving,
}: Props) {
  const { t } = useLanguage();
  const f = t.onboarding.step4Fields;
  const fs = t.onboarding.fundSources;

  const [fields, setFields] = useState({
    annualIncome: formData.annualIncome || "",
    monthlyIncome: formData.monthlyIncome || formData.monthlyAmount || "",
    bankName: formData.bankName || "",
    bankAccountCountry: formData.bankAccountCountry || "",
    sourceOfFunds: formData.sourceOfFunds || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fields.annualIncome.trim()) errs.annualIncome = t.validation.required.replace("{field}", f.annualIncome.label);
    if (!fields.monthlyIncome.trim()) errs.monthlyIncome = t.validation.required.replace("{field}", f.monthlyIncome.label);
    if (!fields.bankName.trim()) errs.bankName = t.validation.required.replace("{field}", f.bankName.label);
    if (!fields.bankAccountCountry.trim()) errs.bankAccountCountry = t.validation.required.replace("{field}", f.bankAccountCountry.label);
    if (!fields.sourceOfFunds.trim()) errs.sourceOfFunds = t.validation.required.replace("{field}", f.sourceOfFunds.label);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext(fields);
    }
  };

  const updateField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
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
        {t.onboarding.step4Title}
      </h2>
      <p className="text-sm text-gray-500 mb-6 sm:mb-8">
        {t.onboarding.step4Subtitle}
      </p>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="annualIncome"
            label={f.annualIncome.label}
            type="text"
            placeholder={f.annualIncome.placeholder}
            value={fields.annualIncome}
            onChange={(e) => updateField("annualIncome", e.target.value)}
            error={errors.annualIncome}
          />
          <Input
            id="monthlyIncome"
            label={f.monthlyIncome.label}
            type="text"
            placeholder={f.monthlyIncome.placeholder}
            value={fields.monthlyIncome}
            onChange={(e) => updateField("monthlyIncome", e.target.value)}
            error={errors.monthlyIncome}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="bankName"
            label={f.bankName.label}
            placeholder={f.bankName.placeholder}
            value={fields.bankName}
            onChange={(e) => updateField("bankName", e.target.value)}
            error={errors.bankName}
          />
          <Input
            id="bankAccountCountry"
            label={f.bankAccountCountry.label}
            placeholder={f.bankAccountCountry.placeholder}
            value={fields.bankAccountCountry}
            onChange={(e) => updateField("bankAccountCountry", e.target.value)}
            error={errors.bankAccountCountry}
          />
        </div>

        <div>
          <label
            htmlFor="sourceOfFunds"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {f.sourceOfFunds.label}
          </label>
          <select
            id="sourceOfFunds"
            value={fields.sourceOfFunds}
            onChange={(e) => updateField("sourceOfFunds", e.target.value)}
            className={`w-full px-4 py-3 min-h-[48px] border rounded-lg text-gray-900 text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ${
              errors.sourceOfFunds
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <option value="">{fs.select}</option>
            <option value="employment">{fs.employment}</option>
            <option value="self_employment">{fs.self_employment}</option>
            <option value="investments">{fs.investments}</option>
            <option value="savings">{fs.savings}</option>
            <option value="pension">{fs.pension}</option>
            <option value="family_support">{fs.family_support}</option>
            <option value="other">{fs.other}</option>
          </select>
          {errors.sourceOfFunds && (
            <p className="mt-1 text-sm text-red-500">{errors.sourceOfFunds}</p>
          )}
        </div>
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
