"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren from "@/components/animations/StaggerChildren";
import { useLanguage } from "@/lib/i18n-context";

export default function AboutPage() {
  const { t } = useLanguage();

  const pillars = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: t.about.pillar1Title,
      description: t.about.pillar1Desc,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t.about.pillar2Title,
      description: t.about.pillar2Desc,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
        </svg>
      ),
      title: t.about.pillar3Title,
      description: t.about.pillar3Desc,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-16 px-4 sm:px-8 bg-gradient-to-b from-stone-50/80 via-white to-white relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-brand-200/15 via-accent-200/10 to-transparent blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <FadeIn duration={500} direction="up">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-[1.15] mb-4">
              {t.about.title}
            </h1>
          </FadeIn>
          <FadeIn delay={150} duration={500} direction="up">
            <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              {t.about.subtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <FadeIn triggerOnScroll duration={500} direction="up">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
              {t.about.storyTitle}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t.about.storyP1}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {t.about.storyP2}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-8 bg-gray-50/60">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn triggerOnScroll duration={500} direction="up">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
              {t.about.missionTitle}
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
              {t.about.missionText}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <FadeIn triggerOnScroll duration={500} direction="up">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-10 sm:mb-12">
              {t.about.pillarsTitle}
            </h2>
          </FadeIn>
          <StaggerChildren staggerMs={100} duration={500} direction="up" triggerOnScroll className="space-y-8">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-8 bg-gray-50/60">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn triggerOnScroll duration={500} direction="up">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
              {t.about.ctaTitle}
            </h2>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 min-h-[48px] bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm text-base"
            >
              {t.about.ctaButton}
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
