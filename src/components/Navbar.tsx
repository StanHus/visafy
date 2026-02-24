"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Button from "./ui/Button";
import { useLanguage } from "@/lib/i18n-context";
import type { Language } from "@/lib/i18n";

const languages: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "ru", label: "RU" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { lang, setLang, t } = useLanguage();
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Only apply auto-hide on mobile (below md breakpoint = 768px)
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
          setHidden(true);
        } else {
          setHidden(false);
        }
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              KORE
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Language Toggle */}
            <div className="flex items-center gap-0.5 text-xs text-gray-400">
              {languages.map((l, idx) => (
                <span key={l.code} className="flex items-center">
                  {idx > 0 && <span className="mx-0.5">|</span>}
                  <button
                    onClick={() => setLang(l.code)}
                    className={`px-1 py-0.5 transition-all duration-200 cursor-pointer ${
                      lang === l.code
                        ? "text-gray-900 font-semibold underline underline-offset-2"
                        : "hover:text-gray-600"
                    }`}
                  >
                    {l.label}
                  </button>
                </span>
              ))}
            </div>

            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150 hidden sm:inline"
                >
                  {t.nav.dashboard}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150 cursor-pointer"
                >
                  {t.nav.signOut}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150"
                >
                  {t.nav.signIn}
                </Link>
                <Link href="/auth/signup" className="hidden sm:inline-block">
                  <Button size="sm">{t.nav.getStarted}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
