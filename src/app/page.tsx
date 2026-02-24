"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren from "@/components/animations/StaggerChildren";
import { useLanguage } from "@/lib/i18n-context";

export default function LandingPage() {
  const { t } = useLanguage();

  const steps = [
    { num: "1", title: t.landing.step1Title, description: t.landing.step1Desc },
    { num: "2", title: t.landing.step2Title, description: t.landing.step2Desc },
    { num: "3", title: t.landing.step3Title, description: t.landing.step3Desc },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero — subtle warm gradient background */}
      <section className="pt-28 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-8 bg-gradient-to-b from-stone-50/80 via-white to-white relative overflow-hidden">
        {/* Floating gradient orb — very subtle */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-200/15 via-indigo-200/10 to-transparent blur-3xl animate-float-orb pointer-events-none" />

        {/* Decorative warm accent line */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-amber-400/60 rounded-full" />
        <div className="max-w-2xl mx-auto text-center relative">
          <FadeIn delay={0} duration={500} direction="up">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-[1.15] mb-6">
              {t.landing.heroTitle}
            </h1>
          </FadeIn>
          <FadeIn delay={150} duration={500} direction="up">
            <p className="text-base sm:text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
              {t.landing.heroSubtitle}
            </p>
          </FadeIn>
          <FadeIn delay={300} duration={500} direction="up">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 min-h-[48px] bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-sm text-base"
            >
              {t.landing.cta}
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-8 bg-gray-50/60">
        <div className="max-w-2xl mx-auto">
          <FadeIn triggerOnScroll duration={500} direction="up">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-10 sm:mb-12">
              {t.landing.howItWorks}
            </h2>
          </FadeIn>
          <StaggerChildren
            staggerMs={100}
            duration={500}
            direction="up"
            triggerOnScroll
            className="space-y-6 sm:space-y-8"
          >
            {steps.map((item) => (
              <div key={item.num} className="flex gap-4 sm:gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-medium flex items-center justify-center">
                  {item.num}
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-gray-900 tracking-tight">
            KORE
          </span>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} KORE. {t.landing.footerRights}
          </p>
        </div>
      </footer>
    </div>
  );
}
