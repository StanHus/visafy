"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import Step1VisaType from "./Step1VisaType";
import Step2Personal from "./Step2Personal";
import Step3VisaDetails from "./Step3VisaDetails";
import Step4Financial from "./Step4Financial";
import Step5Documents from "./Step5Documents";
import Step6Review from "./Step6Review";

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
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const STEP_TITLES = t.onboarding.stepTitles;

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
          if (app.documents) {
            setUploadedDocs(
              app.documents.map((d: { id: string; fileName: string; fileUrl: string; documentType: string; status: string }) => ({
                id: d.id,
                fileName: d.fileName,
                fileUrl: d.fileUrl,
                documentType: d.documentType,
                status: d.status,
              }))
            );
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const progress = ((currentStep - 1) / (STEP_TITLES.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-gray-900 tracking-tight">
            KORE
          </Link>
          <span className="text-sm text-gray-400 truncate ml-4">
            {session?.user?.email}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between mb-3">
            {STEP_TITLES.map((title, idx) => {
              const stepNum = idx + 1;
              const isActive = stepNum === currentStep;
              const isCompleted = stepNum < currentStep;
              return (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                      isCompleted
                        ? "bg-indigo-600 text-white"
                        : isActive
                        ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 hidden sm:block ${
                      isActive ? "text-indigo-600 font-medium" : "text-gray-400"
                    }`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1">
            <div
              className="bg-indigo-600 h-1 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        <div className="animate-fade-in">
          {currentStep === 1 && (
            <Step1VisaType formData={formData} onNext={handleNext} saving={saving} />
          )}
          {currentStep === 2 && (
            <Step2Personal formData={formData} onNext={handleNext} onBack={handleBack} saving={saving} userEmail={session?.user?.email || ""} />
          )}
          {currentStep === 3 && (
            <Step3VisaDetails formData={formData} onNext={handleNext} onBack={handleBack} saving={saving} />
          )}
          {currentStep === 4 && (
            <Step4Financial formData={formData} onNext={handleNext} onBack={handleBack} saving={saving} />
          )}
          {currentStep === 5 && (
            <Step5Documents formData={formData} applicationId={applicationId} uploadedDocs={uploadedDocs} setUploadedDocs={setUploadedDocs} onNext={handleNext} onBack={handleBack} saving={saving} />
          )}
          {currentStep === 6 && (
            <Step6Review formData={formData} uploadedDocs={uploadedDocs} onBack={handleBack} onSubmit={handleSubmit} saving={saving} />
          )}
        </div>
      </div>
    </div>
  );
}
