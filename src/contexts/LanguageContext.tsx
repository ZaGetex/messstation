"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "de" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("de");

  useEffect(() => {
    // Load language from localStorage or default to German
    try {
      const savedLanguage = (typeof window !== "undefined" ? localStorage.getItem("language") : null) as Language | null;
      setLanguageState(savedLanguage || "de");
    } catch {
      setLanguageState("de");
    }
  }, []);

  useEffect(() => {
    // Save language to localStorage and update HTML lang attribute
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("language", language);
        // Update HTML lang attribute
        if (typeof document !== "undefined") {
          document.documentElement.lang = language === "de" ? "de" : "en";
        }
      }
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === "de" ? "en" : "de"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

