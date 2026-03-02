"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl sm:text-8xl font-bold text-brand-600/20 mb-4">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
          {t.notFound.title}
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          {t.notFound.subtitle}
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm text-sm"
        >
          <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          {t.notFound.backHome}
        </Link>
      </div>
    </div>
  );
}
