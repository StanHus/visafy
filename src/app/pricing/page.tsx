"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren from "@/components/animations/StaggerChildren";
import { useLanguage } from "@/lib/i18n-context";

const VISA_PRICING = [
  { key: "work_visa", price: 499 },
  { key: "golden_visa", price: 499 },
  { key: "student_visa", price: 499 },
  { key: "digital_nomad", price: 499 },
  { key: "family_reunification", price: 499 },
  { key: "non_lucrative", price: 499 },
] as const;

export default function PricingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <FadeIn duration={400} direction="up">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t.pricing.title}
            </h1>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              {t.pricing.subtitle}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren staggerMs={80} duration={400} direction="up" className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VISA_PRICING.map((visa) => {
            const visaInfo = t.pricing.visaTypes[visa.key as keyof typeof t.pricing.visaTypes];
            return (
              <div
                key={visa.key}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {visaInfo?.title || visa.key}
                </h3>
                <p className="text-xs text-gray-500 mb-4 min-h-[32px]">
                  {visaInfo?.desc || ""}
                </p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">&euro;{visa.price}</span>
                  <span className="text-sm text-gray-400 ml-1">{t.pricing.perApp}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {t.pricing.features.map((feat: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <svg className="w-4 h-4 text-accent-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup">
                  <Button className="w-full" size="sm">
                    {t.pricing.getStarted}
                  </Button>
                </Link>
              </div>
            );
          })}
        </StaggerChildren>

        <FadeIn delay={400} duration={400} direction="up">
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <p className="text-sm text-gray-400">{t.pricing.note}</p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
