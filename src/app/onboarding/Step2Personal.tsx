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
  userEmail: string;
}

export default function Step2Personal({
  formData,
  onNext,
  onBack,
  saving,
  userEmail,
}: Props) {
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

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fields.fullName.trim()) errs.fullName = "Full name is required";
    if (!fields.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
    if (!fields.nationality.trim()) errs.nationality = "Nationality is required";
    if (!fields.passportNumber.trim()) errs.passportNumber = "Passport number is required";
    if (!fields.passportExpiry) errs.passportExpiry = "Passport expiry is required";
    if (!fields.phone.trim()) errs.phone = "Phone number is required";
    if (!fields.email.trim()) errs.email = "Email is required";
    if (!fields.country.trim()) errs.country = "Country is required";
    if (!fields.city.trim()) errs.city = "City is required";
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
        Personal information
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Enter your details as they appear on your passport.
      </p>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="fullName"
            label="Full Name"
            placeholder="As on passport"
            value={fields.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            error={errors.fullName}
          />
          <Input
            id="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={fields.dateOfBirth}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
            error={errors.dateOfBirth}
          />
        </div>

        <Input
          id="nationality"
          label="Nationality"
          placeholder="e.g. United States"
          value={fields.nationality}
          onChange={(e) => updateField("nationality", e.target.value)}
          error={errors.nationality}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="passportNumber"
            label="Passport Number"
            placeholder="e.g. AB1234567"
            value={fields.passportNumber}
            onChange={(e) => updateField("passportNumber", e.target.value)}
            error={errors.passportNumber}
          />
          <Input
            id="passportExpiry"
            label="Passport Expiry Date"
            type="date"
            value={fields.passportExpiry}
            onChange={(e) => updateField("passportExpiry", e.target.value)}
            error={errors.passportExpiry}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="+1 234 567 8900"
            value={fields.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            error={errors.phone}
          />
          <Input
            id="email"
            label="Email Address"
            type="email"
            value={fields.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="country"
            label="Current Country"
            placeholder="e.g. United States"
            value={fields.country}
            onChange={(e) => updateField("country", e.target.value)}
            error={errors.country}
          />
          <Input
            id="city"
            label="Current City"
            placeholder="e.g. New York"
            value={fields.city}
            onChange={(e) => updateField("city", e.target.value)}
            error={errors.city}
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
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
