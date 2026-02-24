"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { translations, type Language, type Translations } from "./i18n";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const STORAGE_KEY = "kore-language";
const VALID_LANGUAGES: Language[] = ["en", "es", "ru"];

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

function getSavedLanguage(): Language | null {
  try {
    // Check new key first, then fallback to old key for migration
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("kore-lang");
    if (saved && VALID_LANGUAGES.includes(saved as Language)) {
      // Migrate old key to new key
      localStorage.setItem(STORAGE_KEY, saved);
      return saved as Language;
    }
  } catch {
    // localStorage not available (SSR, private mode, etc.)
  }
  return null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = getSavedLanguage();
    if (saved) {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // localStorage not available
    }
  };

  // Suppress hydration mismatch: don't render translated content until mounted
  if (!mounted) {
    return (
      <LanguageContext.Provider
        value={{ lang: "en", setLang, t: translations.en }}
      >
        <div style={{ visibility: "hidden" }}>{children}</div>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t: translations[lang] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
