"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { VISA_LABELS } from "@/lib/constants";
import type { FormData } from "./page";

interface Props {
  formData: FormData;
  onNext: (fields: FormData) => void;
  onBack: () => void;
  saving: boolean;
}

const visaFields: Record<string, { label: string; placeholder: string; key: string }[]> = {
  work_visa: [
    { key: "employerName", label: "Employer Name", placeholder: "Company name in Spain" },
    { key: "employerAddress", label: "Employer Address", placeholder: "Full address" },
    { key: "jobTitle", label: "Job Title", placeholder: "Your position" },
    { key: "contractStartDate", label: "Contract Start Date", placeholder: "" },
    { key: "contractEndDate", label: "Contract End Date", placeholder: "" },
    { key: "annualSalary", label: "Annual Salary (EUR)", placeholder: "e.g. 45000" },
  ],
  golden_visa: [
    { key: "investmentType", label: "Investment Type", placeholder: "e.g. Real estate, Financial assets" },
    { key: "investmentAmount", label: "Investment Amount (EUR)", placeholder: "e.g. 500000" },
    { key: "investmentDescription", label: "Investment Description", placeholder: "Details about your investment" },
    { key: "investmentLocation", label: "Investment Location", placeholder: "City/region in Spain" },
  ],
  student_visa: [
    { key: "universityName", label: "University Name", placeholder: "Name of institution" },
    { key: "programName", label: "Program Name", placeholder: "e.g. MBA, Computer Science" },
    { key: "programDuration", label: "Program Duration", placeholder: "e.g. 2 years" },
    { key: "programStartDate", label: "Program Start Date", placeholder: "" },
    { key: "enrollmentStatus", label: "Enrollment Status", placeholder: "e.g. Accepted, Enrolled" },
  ],
  digital_nomad: [
    { key: "workType", label: "Work Type", placeholder: "Employee or Freelancer" },
    { key: "companyName", label: "Company/Client Name", placeholder: "Your employer or main client" },
    { key: "companyCountry", label: "Company Country", placeholder: "Where the company is based" },
    { key: "monthlyIncome", label: "Monthly Income (EUR)", placeholder: "e.g. 3500" },
    { key: "remoteWorkDescription", label: "Work Description", placeholder: "Brief description of your role" },
  ],
  family_reunification: [
    { key: "sponsorName", label: "Sponsor Full Name", placeholder: "Name of your family member in Spain" },
    { key: "sponsorRelationship", label: "Relationship to Sponsor", placeholder: "e.g. Spouse, Parent, Child" },
    { key: "sponsorResidencePermit", label: "Sponsor's Residence Permit Number", placeholder: "NIE or permit number" },
    { key: "sponsorAddress", label: "Sponsor's Address in Spain", placeholder: "Full address" },
  ],
  non_lucrative: [
    { key: "incomeSource", label: "Source of Income", placeholder: "e.g. Pension, Investments, Savings" },
    { key: "monthlyAmount", label: "Monthly Income/Funds (EUR)", placeholder: "e.g. 3000" },
    { key: "savingsAmount", label: "Total Savings (EUR)", placeholder: "e.g. 100000" },
    { key: "plannedResidence", label: "Planned City of Residence", placeholder: "e.g. Barcelona, Madrid" },
  ],
};

export default function Step3VisaDetails({
  formData,
  onNext,
  onBack,
  saving,
}: Props) {
  const visaType = formData.visaType || "work_visa";
  const fields = visaFields[visaType] || visaFields.work_visa;

  const initialValues: Record<string, string> = {};
  fields.forEach((f) => {
    initialValues[f.key] = formData[f.key] || "";
  });

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      if (!values[f.key]?.trim()) {
        errs[f.key] = `${f.label} is required`;
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
        {VISA_LABELS[visaType]} details
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Provide specific information required for your visa type.
      </p>

      <div className="space-y-5">
        {fields.map((field) => (
          <Input
            key={field.key}
            id={field.key}
            label={field.label}
            type={field.key.includes("Date") ? "date" : "text"}
            placeholder={field.placeholder}
            value={values[field.key]}
            onChange={(e) => updateField(field.key, e.target.value)}
            error={errors[field.key]}
          />
        ))}
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
