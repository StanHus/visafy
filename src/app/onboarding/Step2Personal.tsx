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
  userEmail: string;
}

export default function Step2Personal({
  formData,
  onNext,
  onBack,
  saving,
  userEmail,
}: Props) {
  const { t } = useLanguage();
  const [fields, setFields] = useState({
    fullName: formData.fullName || "",
    dateOfBirth: formData.dateOfBirth || "",
    nationality: formData.nationality || "",
    passportNumber: formData.passportNumber || "",
    passportExpiry: formData.passportExpiry || "",
    phone: formData.phone || "",
    email: formData.email || userEmail,
    country: formData.country || "",
    city: formData.city || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const f = t.onboarding.fields;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fields.fullName.trim()) errs.fullName = t.validation.required.replace("{field}", f.fullName.label);
    if (!fields.dateOfBirth) errs.dateOfBirth = t.validation.required.replace("{field}", f.dateOfBirth.label);
    if (!fields.nationality.trim()) errs.nationality = t.validation.required.replace("{field}", f.nationality.label);
    if (!fields.passportNumber.trim()) errs.passportNumber = t.validation.required.replace("{field}", f.passportNumber.label);
    if (!fields.passportExpiry) errs.passportExpiry = t.validation.required.replace("{field}", f.passportExpiry.label);
    if (!fields.phone.trim()) errs.phone = t.validation.required.replace("{field}", f.phone.label);
    if (!fields.email.trim()) errs.email = t.validation.required.replace("{field}", f.email.label);
    if (!fields.country.trim()) errs.country = t.validation.required.replace("{field}", f.country.label);
    if (!fields.city.trim()) errs.city = t.validation.required.replace("{field}", f.city.label);
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
        {t.onboarding.step2Title}
      </h2>
      <p className="text-sm text-gray-500 mb-6 sm:mb-8">
        {t.onboarding.step2Subtitle}
      </p>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="fullName"
            label={f.fullName.label}
            placeholder={f.fullName.placeholder}
            value={fields.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            error={errors.fullName}
          />
          <Input
            id="dateOfBirth"
            label={f.dateOfBirth.label}
            type="date"
            value={fields.dateOfBirth}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
            error={errors.dateOfBirth}
          />
        </div>

        <Input
          id="nationality"
          label={f.nationality.label}
          placeholder={f.nationality.placeholder}
          value={fields.nationality}
          onChange={(e) => updateField("nationality", e.target.value)}
          error={errors.nationality}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="passportNumber"
            label={f.passportNumber.label}
            placeholder={f.passportNumber.placeholder}
            value={fields.passportNumber}
            onChange={(e) => updateField("passportNumber", e.target.value)}
            error={errors.passportNumber}
          />
          <Input
            id="passportExpiry"
            label={f.passportExpiry.label}
            type="date"
            value={fields.passportExpiry}
            onChange={(e) => updateField("passportExpiry", e.target.value)}
            error={errors.passportExpiry}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="phone"
            label={f.phone.label}
            type="tel"
            placeholder={f.phone.placeholder}
            value={fields.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            error={errors.phone}
          />
          <Input
            id="email"
            label={f.email.label}
            type="email"
            value={fields.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="country"
            label={f.country.label}
            placeholder={f.country.placeholder}
            value={fields.country}
            onChange={(e) => updateField("country", e.target.value)}
            error={errors.country}
          />
          <Input
            id="city"
            label={f.city.label}
            placeholder={f.city.placeholder}
            value={fields.city}
            onChange={(e) => updateField("city", e.target.value)}
            error={errors.city}
          />
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
