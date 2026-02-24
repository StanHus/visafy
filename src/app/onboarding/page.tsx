"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Step1VisaType from "./Step1VisaType";
import Step2Personal from "./Step2Personal";
import Step3VisaDetails from "./Step3VisaDetails";
import Step4Financial from "./Step4Financial";
import Step5Documents from "./Step5Documents";
import Step6Review from "./Step6Review";

const STEP_TITLES = [
  "Visa Type",
  "Personal Info",
  "Visa Details",
  "Financial",
  "Documents",
  "Review",
];

export type FormData = Record<string, string>;
export type UploadedDoc = {
  id: string;
  fileName: string;
  fileUrl: string;
  documentType: string;
  status: string;
};

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing application
  useEffect(() => {
    async function loadApplication() {
      try {
        const res = await fetch("/api/applications");
        const apps = await res.json();
        if (apps.length > 0) {
          const app = apps[0];
          setApplicationId(app.id);
          setCurrentStep(app.currentStep);
          setFormData(app.fields || {});
          if (app.visaType) {
            setFormData((prev) => ({ ...prev, visaType: app.visaType }));
          }
        }
      } catch (err) {
        console.error("Failed to load application:", err);
      } finally {
        setLoading(false);
      }
    }
    loadApplication();
  }, []);

  const saveStep = useCallback(
    async (step: number, fields: FormData, nextStep?: number) => {
      setSaving(true);
      try {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicationId,
            step,
            fields,
            visaType: fields.visaType || formData.visaType,
            currentStep: nextStep || currentStep,
          }),
        });
        const data = await res.json();
        if (data.applicationId) {
          setApplicationId(data.applicationId);
        }
      } catch (err) {
        console.error("Failed to save step:", err);
      } finally {
        setSaving(false);
      }
    },
    [applicationId, currentStep, formData.visaType]
  );

  const handleNext = async (stepFields: FormData) => {
    const updatedData = { ...formData, ...stepFields };
    setFormData(updatedData);
    const nextStep = Math.min(currentStep + 1, 6);
    await saveStep(currentStep, stepFields, nextStep);
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!applicationId) return;
    setSaving(true);
    try {
      await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to submit:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Visafy</span>
          </div>
          <span className="text-sm text-gray-500">
            {session?.user?.email}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-3">
            {STEP_TITLES.map((title, idx) => {
              const stepNum = idx + 1;
              const isActive = stepNum === currentStep;
              const isCompleted = stepNum < currentStep;
              return (
                <div
                  key={title}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      isCompleted
                        ? "bg-orange-500 text-white"
                        : isActive
                        ? "bg-orange-500 text-white ring-4 ring-orange-100"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1.5 hidden sm:block ${
                      isActive ? "text-orange-500 font-medium" : "text-gray-500"
                    }`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-orange-500 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep - 1) / (STEP_TITLES.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {currentStep === 1 && (
            <Step1VisaType
              formData={formData}
              onNext={handleNext}
              saving={saving}
            />
          )}
          {currentStep === 2 && (
            <Step2Personal
              formData={formData}
              onNext={handleNext}
              onBack={handleBack}
              saving={saving}
              userEmail={session?.user?.email || ""}
            />
          )}
          {currentStep === 3 && (
            <Step3VisaDetails
              formData={formData}
              onNext={handleNext}
              onBack={handleBack}
              saving={saving}
            />
          )}
          {currentStep === 4 && (
            <Step4Financial
              formData={formData}
              onNext={handleNext}
              onBack={handleBack}
              saving={saving}
            />
          )}
          {currentStep === 5 && (
            <Step5Documents
              formData={formData}
              applicationId={applicationId}
              uploadedDocs={uploadedDocs}
              setUploadedDocs={setUploadedDocs}
              onNext={handleNext}
              onBack={handleBack}
              saving={saving}
            />
          )}
          {currentStep === 6 && (
            <Step6Review
              formData={formData}
              uploadedDocs={uploadedDocs}
              onBack={handleBack}
              onSubmit={handleSubmit}
              saving={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
