"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
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
    if (!fields.annualIncome.trim()) errs.annualIncome = "Annual income is required";
    if (!fields.monthlyIncome.trim()) errs.monthlyIncome = "Monthly income is required";
    if (!fields.bankName.trim()) errs.bankName = "Bank name is required";
    if (!fields.bankAccountCountry.trim()) errs.bankAccountCountry = "Bank account country is required";
    if (!fields.sourceOfFunds.trim()) errs.sourceOfFunds = "Source of funds is required";
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
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Financial Information
      </h2>
      <p className="text-gray-600 mb-8">
        Provide details about your financial situation. This is required for all
        visa applications.
      </p>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="annualIncome"
            label="Annual Income (EUR)"
            type="text"
            placeholder="e.g. 60000"
            value={fields.annualIncome}
            onChange={(e) => updateField("annualIncome", e.target.value)}
            error={errors.annualIncome}
          />
          <Input
            id="monthlyIncome"
            label="Monthly Income (EUR)"
            type="text"
            placeholder="e.g. 5000"
            value={fields.monthlyIncome}
            onChange={(e) => updateField("monthlyIncome", e.target.value)}
            error={errors.monthlyIncome}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="bankName"
            label="Bank Name"
            placeholder="e.g. Chase, HSBC"
            value={fields.bankName}
            onChange={(e) => updateField("bankName", e.target.value)}
            error={errors.bankName}
          />
          <Input
            id="bankAccountCountry"
            label="Bank Account Country"
            placeholder="e.g. United States"
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
            Source of Funds
          </label>
          <select
            id="sourceOfFunds"
            value={fields.sourceOfFunds}
            onChange={(e) => updateField("sourceOfFunds", e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white ${
              errors.sourceOfFunds
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <option value="">Select source of funds</option>
            <option value="employment">Employment / Salary</option>
            <option value="self_employment">Self-Employment / Business</option>
            <option value="investments">Investments / Dividends</option>
            <option value="savings">Savings</option>
            <option value="pension">Pension / Retirement</option>
            <option value="family_support">Family Support</option>
            <option value="other">Other</option>
          </select>
          {errors.sourceOfFunds && (
            <p className="mt-1 text-sm text-red-500">{errors.sourceOfFunds}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
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
