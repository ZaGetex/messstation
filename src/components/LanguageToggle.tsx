"use client";

import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed z-50 p-3 transition-all duration-300 border rounded-full shadow-lg 
                 sm:bottom-auto sm:top-[4.5rem] bottom-[4.5rem] right-4 
                 bg-background-light/80 dark:bg-primary-600/80 backdrop-blur-lg 
                 border-primary-50/20 dark:border-primary-200/30 
                 hover:shadow-xl hover:scale-110 
                 focus:outline-none focus:ring-4 focus:ring-primary-400/50"
      aria-label={`Switch to ${language === "de" ? "English" : "Deutsch"}`}
      title={language === "de" ? "Switch to English" : "Auf Deutsch wechseln"}
    >
      
      <div className="relative w-5 h-5 rounded-full overflow-hidden">
        <img
          src={language === "de" 
            ? "https://flagcdn.com/de.svg" 
            : "https://flagcdn.com/gb.svg"} 
          alt={language === "de" ? "German Flag" : "English Flag"}
          className="w-full h-full object-cover transform scale-150" 
        />
        {/* Subtle overlay for dark mode contrast */}
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/10" />
      </div>
    </button>
  );
}